import 'reflect-metadata'
import { Container } from 'typedi'

import { log, logError } from '../common/Logger'
import { MONGO_DB, MONGO_URI } from '../config/env.config'
import Mongo from '../mongo'
import { AdminsRepository } from '../mongo/repository/admins'
import { CountersRepository } from '../mongo/repository/counters'
import { DevicesRepository } from '../mongo/repository/devices'
import { OrdersRepository } from '../mongo/repository/orders'

async function start() {
    const mongodbOptions = { url: MONGO_URI, dbName: MONGO_DB }
    await Mongo.connect(mongodbOptions)
    log('mongodb connected', mongodbOptions)
    const adminsRepository = Container.get(AdminsRepository)
    await adminsRepository.dropCollection()
    await adminsRepository.createCollection()
    const countersRepository = Container.get(CountersRepository)
    await countersRepository.createCollection()
    const ordersRepository = Container.get(OrdersRepository)
    await ordersRepository.createCollection()
    const devicesRepository = Container.get(DevicesRepository)
    await devicesRepository.createCollection()
    await Mongo.close()
}

start().catch(err => {
    logError(err)
    process.exit(1)
})
