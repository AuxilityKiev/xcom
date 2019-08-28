import { Service } from 'typedi'
import { log, logWarn } from '../../common/Logger'
import { Repository } from './repository'

@Service()
export class CountersRepository extends Repository {
    public constructor() {
        super('counters')
    }

    public async createCollection(): Promise<void> {
        await super.createCollection()
        try {
            await this.collection.insertOne({
                _id: 'orderNum',
                number: 0
            })
        } catch (e) {
            logWarn('CountersRepository already initialized', { context: __filename })
        }
    }

    public async getNextOrderNumber(): Promise<number> {
        const res = await this.collection.findOneAndUpdate(
            {
                _id: 'orderNum'
            },
            {
                $inc: { number: 1 }
            },
            {
                returnOriginal: false
            }
        )
        if (!res.value) {
            throw new Error(
                `Can't generate order number: counters repository was not initialized. Run db:init:{mode} script`
            )
        }
        return res.value.number
    }
}
