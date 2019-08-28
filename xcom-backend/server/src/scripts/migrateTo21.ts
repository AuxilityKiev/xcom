import { Container } from 'typedi'
import { logInfo } from '../common/Logger'
import { CountersRepository } from '../mongo/repository/counters'
import { DevicesRepository } from '../mongo/repository/devices'
import { OrdersRepository } from '../mongo/repository/orders'

export default async () => {
    const ordersRepository = Container.get(OrdersRepository)
    // replace old orders that had no extId
    const extIdCount = await ordersRepository.collection.find({ extId: { $exists: true } }).count()
    if (extIdCount > 0) {
        throw new Error(`Can't migrate, will overwrite ${extIdCount} orders with extId`)
    }
    await ordersRepository.collection
        .aggregate([
            {
                $addFields: {
                    extId: { $toString: '$_id' }
                }
            },
            { $out: 'orders' }
        ])
        .toArray()
    logInfo(`migrated extId`, { context: __filename })
    // re-init indexes
    await ordersRepository.createCollection()

    const devicesRepository = Container.get(DevicesRepository)
    await devicesRepository.createCollection()
    const countersRepository = Container.get(CountersRepository)
    await countersRepository.createCollection()
}
