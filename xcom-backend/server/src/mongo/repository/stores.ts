import { Inject, Service } from 'typedi'
import { IMAGE_STORE_TYPE_FOLDER, IMAGE_URL } from '../../config/env.config'
import { LocationFilter } from '../../parameters/locationFilter'
import { LocationsQuery } from '../queries/LocationsQuery'
import { Repository } from './repository'
import { StocksRepository } from './stocks'

export interface INN {
    INN: string
}

@Service()
export class StoreRepository extends Repository {
    @Inject()
    private readonly stocks!: StocksRepository

    constructor() {
        super('stores')
    }
    public async createCollection() {
        await super.createCollection()
        await this.collection.createIndex({ id: 1 }, { unique: true })
        await this.collection.createIndex({ storeType: 1 })
        await this.collection.createIndex({ region: 1 })
        await this.collection.createIndex({ regionCode: 1 })
    }

    public async getAll(query: LocationsQuery) {
        return this.collection
            .aggregate([
                { $match: query },
                {
                    $project: {
                        _id: 0,
                        id: 1,
                        name: 1,
                        region: '$regionCode',
                        storeType: 1,
                        address: 1,
                        phone: '$phoneNumber',
                        workTime: 1,
                        location: 1,
                        stations: 1
                    }
                },
                {
                    $lookup: {
                        from: 'storeTypes',
                        localField: 'storeType',
                        foreignField: 'name',
                        as: 'type'
                    }
                },
                { $unwind: '$type' },
                {
                    $project: {
                        id: 1,
                        name: 1,
                        region: 1,
                        address: 1,
                        phone: 1,
                        workTime: 1,
                        location: 1,
                        stations: 1,
                        'type.name': 1,
                        'type.icon': {
                            url: { $concat: [IMAGE_URL, IMAGE_STORE_TYPE_FOLDER, '$type.img'] },
                            urls: null,
                            urlm: null
                        }
                    }
                }
            ])
            .toArray()
    }
    public async getSingle(id: number) {
        return this.collection
            .aggregate([
                { $match: { id } },
                {
                    $project: {
                        _id: 0,
                        id: 1,
                        name: 1,
                        region: '$regionCode',
                        storeType: 1,
                        address: 1,
                        phone: '$phoneNumber',
                        workTime: 1,
                        location: 1,
                        stations: 1
                    }
                },
                {
                    $lookup: {
                        from: 'storeTypes',
                        localField: 'storeType',
                        foreignField: 'name',
                        as: 'type'
                    }
                },
                { $unwind: '$type' },
                {
                    $project: {
                        id: 1,
                        name: 1,
                        region: 1,
                        address: 1,
                        phone: 1,
                        workTime: 1,
                        location: 1,
                        stations: 1,
                        'type.name': 1,
                        'type.icon': {
                            url: { $concat: [IMAGE_URL, IMAGE_STORE_TYPE_FOLDER, '$type.img'] },
                            urls: null,
                            urlm: null
                        }
                    }
                }
            ])
            .toArray()
    }
    public async getLocationsType() {
        const res = await this.collection
            .aggregate([
                {
                    $group: {
                        _id: { storeType: '$storeType', region: '$regionCode' },
                        name: { $first: '$storeType' },
                        region: { $first: '$regionCode' },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: { name: '$name' },
                        name: { $first: '$name' },
                        count: { $sum: '$count' },
                        regions: {
                            $push: { region: '$region', count: '$count' }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ])
            .toArray()
        return res.filter(item => (item.name ? item : null))
    }
    public async getRegions() {
        return this.collection
            .aggregate([
                {
                    $project: {
                        _id: 0,
                        region: 1,
                        regionCode: 1
                    }
                },
                {
                    $group: {
                        _id: '$regionCode',
                        region: { $first: '$region' }
                    }
                },
                {
                    $project: {
                        regionCode: '$_id',
                        region: 1,
                        _id: 0
                    }
                }
            ])
            .toArray()
    }

    public async getInn(id: number): Promise<INN | null> {
        return this.collection
            .aggregate([
                {
                    $match: { id }
                },
                {
                    $project: {
                        _id: 0,
                        INN: 1
                    }
                }
            ])
            .next()
    }

    public async getStoresAndStocksForProductList(filter: LocationFilter, ids: number[]) {
        const stores = await this.getAll(new LocationsQuery(filter))
        for (const store of stores) {
            store.stocks = (await this.stocks.getForStores([store.id], ids)).map(it => {
                // Old mobile versions have been using the wrong price.
                // They used storePrice when should have used ecomPrice
                // http://jira.id-east.ru/browse/ERKAS-116
                it.storePrice = it.ecomPrice
                return it
            })
        }
        return stores
    }
}
