import { ObjectId } from 'bson'
import { InsertOneWriteOpResult } from 'mongodb'
import { Service } from 'typedi'
import { EcomOrder, OrderItem } from '../../ecom/ecomOrder'
import { Order } from '../entity/order'
import { Repository } from './repository'
import { INN } from './stores'

/**
 * Used as a temporary order storage for payment gateway processing.
 * Not served for users.
 * IMPORTANT!:
 * 1. extId - local order id (xcom) and sbol primary order number
 * 2. 'id' is an internal e-com number
 */
@Service()
export class OrdersRepository extends Repository {
    constructor() {
        super('orders')
    }

    public async createCollection(): Promise<void> {
        await super.createCollection()
        await this.collection.createIndex({ extId: 1 }, { unique: true })
    }

    public async findById(extId: string): Promise<Order | null> {
        return this.collection.findOne({ extId })
    }

    public async insert(order: EcomOrder & INN): Promise<Order> {
        await this.collection.insertOne(order)
        return order
    }

    public async updateById(extId: string, fields: any) {
        await this.collection.updateOne({ extId }, { $set: fields })
    }
}
