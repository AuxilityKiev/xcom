import { Service } from 'typedi'
import { Device } from '../entity/device'
import { Repository } from './repository'

@Service()
export class DevicesRepository extends Repository {
    public constructor() {
        super('devices')
    }

    public async createCollection(): Promise<void> {
        await super.createCollection()
        await this.collection.createIndex({ deviceToken: 1 }, { unique: true })
        await this.collection.createIndex({ phoneNumber: 1 })
    }

    public async insert(device: Device) {
        return this.collection.insertOne(device)
    }

    public async findForNumber(phoneNumber: string): Promise<Device[]> {
        return this.collection.find({ phoneNumber }).toArray()
    }

    public async delete(deviceToken: string) {
        return this.collection.deleteMany({ deviceToken })
    }
}
