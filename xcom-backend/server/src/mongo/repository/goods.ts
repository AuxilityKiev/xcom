import { Inject, Service } from 'typedi'

import moment = require('moment')
import {
    IMAGE_DEFAULT_TYPE,
    IMAGE_GOOD_FOLDER,
    IMAGE_M_SUBFOLDER,
    IMAGE_S_SUBFOLDER,
    IMAGE_URL
} from '../../config/env.config'
import { OrderItem } from '../../ecom/ecomOrder'
import { Region } from '../../parameters/region'
import { SkipTake } from '../../parameters/skipTake'
import { Good } from '../entity/good'
import { Share } from '../entity/share'
import { GoodsFilter } from '../queries/GoodsFilter'
import { GoodsHint } from '../queries/GoodsHint'
import { GoodsSort } from '../queries/GoodsSort'
import { GoodsTextQuery } from '../queries/GoodsTextQuery'
import { Repository } from './repository'
import { StocksRepository } from './stocks'

@Service()
export class GoodRepository extends Repository {
    @Inject()
    private readonly stocks!: StocksRepository

    constructor() {
        super('goods')
    }

    public getGoodsProjection(regionId: number) {
        return {
            _id: 0,
            id: 1,
            name: 1,
            manufacturer: 1,
            tradeName: 1,
            tradeMark: 1,
            siteCatId: 1,
            country: 1,
            byPrescription: { $ifNull: ['$byPrescription', false] },
            activeSubstance: '$mnn',
            categoryId: '$siteCatId',
            descrHTML: 1,
            consistHTML: 1,
            usageHTML: 1,
            price: {
                $ifNull: [
                    {
                        $arrayElemAt: [
                            {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: '$price',
                                            as: 'price',
                                            cond: { $eq: ['$$price.region', regionId] }
                                        }
                                    },
                                    as: 'price',
                                    in: {
                                        min: '$$price.priceMin',
                                        max: '$$price.priceMax',
                                        inStock: { $ifNull: ['$$price.available', 0] }
                                    }
                                }
                            },
                            0
                        ]
                    },
                    null
                ]
            },
            icon: {
                url: { $concat: [IMAGE_URL, IMAGE_GOOD_FOLDER, '$img'] },
                urls: { $concat: [IMAGE_URL, IMAGE_GOOD_FOLDER, IMAGE_S_SUBFOLDER, '$img'] },
                urlm: { $concat: [IMAGE_URL, IMAGE_GOOD_FOLDER, IMAGE_M_SUBFOLDER, '$img'] }
            },
            share: {
                $cond: {
                    if: { $or: [{ $lt: ['$share.endDate', new Date()] }, { $gt: ['$share.startDate', new Date()] }] },
                    then: '$$REMOVE',
                    else: '$share'
                }
            }
        }
    }

    public async createCollection() {
        await super.createCollection()
        // index for partial regex text matches
        await this.collection.createIndex({ searchKeywords: 1 })
        // index for stemmed text search
        await this.collection.createIndex(
            {
                name: 'text',
                mnn: 'text',
                manufacturer: 'text',
                tradeMark: 'text',
                tradeName: 'text',
                descrHTML: 'text',
                consistHTML: 'text',
                usageHTML: 'text',
                categoryName: 'text'
            },
            {
                name: 'text_index',
                // @ts-ignore
                weights: {
                    name: 10,
                    mnn: 5,
                    manufacturer: 3,
                    tradeMark: 3,
                    tradeName: 3,
                    categoryName: 2,
                    descrHTML: 1,
                    consistHTML: 1,
                    usageHTML: 1
                },
                default_language: 'russian'
            }
        )
        await this.collection.createIndex({ id: 1 }, { unique: true })
        await this.collection.createIndex({ siteCatId: 1 })
        await this.collection.createIndex({ img: 1 }, { name: 'img' })
        await this.collection.createIndex({ 'price.stores': 1 }, { name: 'stores' })
        await this.collection.createIndex({ 'price.region': 1 }, { name: 'priceReg' })
        await this.collection.createIndex({ 'price.priceMin': 1 }, { name: 'priceMin' })
        await this.collection.createIndex({ 'price.priceMax': 1 }, { name: 'priceMax' })
        await this.collection.createIndex({ 'price.region': 1, 'price.priceMin': 1 }, { name: 'priceMinReg' })
        await this.collection.createIndex({ 'price.region': 1, 'price.priceMax': 1 }, { name: 'priceMaxReg' })
        await this.collection.createIndex(
            { 'price.region': 1, 'price.priceMin': 1, 'price.priceMax': -1 },
            { name: 'priceMinMaxReg' }
        )
        await this.collection.createIndex({ 'share.regions': 1 })
        await this.collection.createIndex({ barcodeList: 1 })
    }

    public async updateImageLink(id: number) {
        return this.collection.updateOne({ id }, { $set: { img: `${id}${IMAGE_DEFAULT_TYPE}` } })
    }

    public async getAll(
        filter: GoodsFilter,
        query: GoodsTextQuery,
        skipTake: SkipTake,
        region: Region,
        sort: GoodsSort,
        hint: GoodsHint,
        storeIds?: number[]
    ) {
        const fullLength = await this.getLength(filter, query, hint)
        const data = await this.getAllWithPrice(filter, query, skipTake, region, sort)
        return {
            fullLength,
            data: storeIds ? await this.joinStocksForStores(data, storeIds) : data
        }
    }

    public async getAllWithPrice(
        filter: GoodsFilter,
        query: GoodsTextQuery,
        skipTake: SkipTake,
        region: Region,
        sort: GoodsSort
    ) {
        const pipeline: any[] = [
            { $match: query },
            { $match: filter },
            { $project: this.getGoodsProjection(region.region) }
        ]

        if (sort.$sort.price === 1) {
            // By default, mongo treats nulls as min values and sorts them
            // in the beginning when using ascending order.
            // If have to sort price in ascending order, we have to push
            // null prices (out of stock) at the bottom of the list
            // for this reason we add additional sorting hint
            pipeline.push({
                $addFields: {
                    sortHint: {
                        $cond: {
                            if: { $eq: ['$price', null] },
                            then: 1,
                            else: '$$REMOVE'
                        }
                    }
                }
            })
        } else if (sort.$sort.ordersLast30d) {
            pipeline[2].$project.ordersLast30d = {
                $sum: {
                    $map: {
                        input: {
                            $filter: {
                                input: { $objectToArray: '$ordered' },
                                as: 'order',
                                cond: {
                                    $gt: [
                                        '$$order.k',
                                        String(
                                            moment()
                                                .subtract(30, 'days')
                                                .hour(0)
                                                .minute(0)
                                                .second(0)
                                                .millisecond(0)
                                                .valueOf()
                                        )
                                    ]
                                }
                            }
                        },
                        as: 'order',
                        in: '$$order.v'
                    }
                }
            }
        }

        pipeline.push(sort, { $skip: skipTake.skip }, { $limit: skipTake.take })
        return this.collection.aggregate(pipeline, { allowDiskUse: true }).toArray()
    }

    public async getByIds(ids: number[], region: Region, storeIds?: number[]) {
        const goods = await this.collection
            .aggregate([{ $match: { id: { $in: ids } } }, { $project: this.getGoodsProjection(region.region) }])
            .toArray()
        return storeIds ? this.joinStocksForStores(goods, storeIds) : goods
    }

    public async getSingle(id: number, region: Region, storeIds?: number[]) {
        const goods = await this.collection
            .aggregate([{ $match: { id } }, { $project: this.getGoodsProjection(region.region) }])
            .toArray()
        return storeIds ? this.joinStocksForStores(goods, storeIds) : goods
    }

    public async getLength(match: GoodsFilter, query: GoodsTextQuery, hint: GoodsHint) {
        if (hint.hint) {
            return this.collection
                .find({ $and: [query, match] })
                .hint(hint.hint)
                .count()
        }
        return this.collection.find({ $and: [query, match] }).count()
    }

    public async getByBarcode(barcode: string, region: Region, storeIds?: number[]) {
        const goods = await this.collection
            .aggregate([
                {
                    $match: {
                        $or: [{ barcode: { $regex: `.*${barcode}.*` } }, { barcodeList: { $regex: `.*${barcode}.*` } }]
                    }
                },
                { $project: this.getGoodsProjection(region.region) }
            ])
            .toArray()
        return storeIds ? this.joinStocksForStores(goods, storeIds) : goods
    }

    public async getCategories(filter: GoodsFilter, query: GoodsTextQuery, hint: GoodsHint) {
        const res = await this.collection
            .aggregate([
                { $match: query },
                { $match: filter },
                { $limit: 1000 },
                {
                    $group: {
                        _id: '$siteCatId'
                    }
                },
                {
                    $group: {
                        _id: {},
                        categories: { $push: '$_id' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        categories: 1
                    }
                }
            ])
            .toArray()
        return res[0] ? res[0].categories : res
    }

    public async getMinMaxPrice(filter: GoodsFilter, query: GoodsTextQuery, region: Region, hint: GoodsHint) {
        const res = await this.collection
            .aggregate([
                { $match: query },
                { $match: filter },
                {
                    $project: {
                        _id: 0,
                        id: 1,
                        price: 1
                    }
                },
                { $unwind: '$price' },
                { $match: { 'price.region': region.region } },
                {
                    $group: {
                        _id: null,
                        min: { $min: '$price.priceMin' },
                        max: { $max: '$price.priceMax' }
                    }
                },
                {
                    $project: {
                        min: 1,
                        max: 1,
                        _id: 0
                    }
                }
            ])
            .toArray()
        if (res[0]) {
            return res[0]
        }
        return {
            min: null,
            max: null
        }
    }

    public async getDensity(filter: GoodsFilter, query: GoodsTextQuery, region: Region, hint: GoodsHint, max?: number) {
        // generate boundaries
        const min = 300
        if (!max) {
            max = 2500
        }
        const boundaries: number[] = [100, 200]
        for (let i = min; i <= max; i += 100) {
            boundaries.push(i)
        }
        return this.collection
            .aggregate([
                { $match: query },
                { $match: filter },
                {
                    $project: {
                        _id: 0,
                        id: 1,
                        price: 1
                    }
                },
                { $unwind: '$price' },
                { $match: { 'price.region': region.region } },
                { $limit: 1000 },
                {
                    $bucket: {
                        groupBy: '$price.priceMax',
                        boundaries,
                        default: 'Other',
                        output: {
                            count: { $sum: 1 }
                        }
                    }
                },
                {
                    $project: {
                        value: '$_id',
                        count: 1,
                        _id: 0
                    }
                }
            ])
            .toArray()
    }

    public async setShare(share: Share) {
        return this.collection.findOneAndUpdate({ id: share.goodId }, { $set: { share } })
    }

    public async incrementOrdersCount(basket: OrderItem[]) {
        for (const item of basket) {
            if (item.price > 199) {
                await this.collection.updateOne(
                    { id: item.goodsId },
                    {
                        $inc: {
                            [`ordered.${moment()
                                .hour(0)
                                .minute(0)
                                .second(0)
                                .millisecond(0)
                                .valueOf()}`]: 1
                        }
                    }
                )
            }
        }
    }

    private joinStocksForStores(goods: Good[], storeIds: number[]): Promise<any[]> {
        return Promise.all(
            goods.map(async (good: any) => {
                return {
                    ...good,
                    stocks: await this.stocks.getForStores(storeIds, [good.id])
                }
            })
        )
    }
}
