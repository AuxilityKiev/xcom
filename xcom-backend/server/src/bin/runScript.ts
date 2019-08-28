import { log, logError } from '../common/Logger'
import { MONGO_DB, MONGO_URI } from '../config/env.config'
import Mongo from '../mongo/index'
import { run } from '../scripts/scriptRunner'
;(async () => {
    try {
        const mongodbOptions = { url: MONGO_URI, dbName: MONGO_DB }
        await Mongo.connect(mongodbOptions)
        log('mongodb connected', mongodbOptions)
        const pipe = process.argv.slice(2)
        await run(pipe)
        process.exit(0)
    } catch (e) {
        logError(e.stack)
        process.exit(-1)
        throw e
    } finally {
        await Mongo.close()
    }
})()
