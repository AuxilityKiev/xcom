import * as converter from 'csvtojson'
import { Inject, Service } from 'typedi'
import { Repository } from './repository'

import { HttpError } from 'routing-controllers'
import { Share } from '../entity/share'
import { GoodRepository } from './goods'
import { RegionsRepository } from './regions'

@Service()
export class SharesRepository extends Repository {
    @Inject()
    private goods!: GoodRepository

    @Inject()
    private regions!: RegionsRepository

    constructor() {
        super('shares')
    }

    public async createCollection() {
        await super.createCollection()
    }

    public async saveShares(csvFile: any): Promise<any> {
        const data = await converter({ trim: true, delimiter: '|' }).fromString(csvFile.buffer.toString())
        if (!data.length) {
            return false
        }
        await this.dropCollection()
        await this.createCollection()
        // delete old shares
        await this.goods.collection.updateMany({ share: { $ne: null } }, { $set: { share: null } })
        for (let i = 0; i < data.length; i++) {
            try {
                const share = new Share(data[i])
                await this.collection.insertOne(share)
                await this.goods.setShare(share)
            } catch (e) {
                throw new HttpError(500, `Не удалось создать акцию для строки номер ${i + 1}`)
            }
        }
        return data
    }
    public async getAll() {
        return this.collection
            .aggregate([
                {
                    $match: { endDate: { $gt: new Date() } }
                },
                {
                    $group: {
                        _id: '$id',
                        description: { $addToSet: '$description' }
                    }
                },
                {
                    $project: {
                        id: '$_id',
                        description: 1,
                        _id: 0
                    }
                }
            ])
            .toArray()
    }
}
