import * as requestPromise from 'request-promise-native'
import { Container } from 'typedi'
import { logDebug, logError, Severity } from '../common/Logger'
import { ECOM_URL } from '../config/env.config'
import { ecomOptions } from '../ecom/ecomOptions'
import { Stock } from '../mongo/entity/stock'
import { StocksRepository } from '../mongo/repository/stocks'
import { StoreRepository } from '../mongo/repository/stores'

/**
 * Before: updateStores
 */
export default async () => {
    const script = 'updateStocks'
    const storesRepo = Container.get(StoreRepository)
    const stocksRepo = Container.get(StocksRepository)

    const storeIds: any[] = await storesRepo.collection.aggregate([{ $project: { id: 1 } }]).toArray()
    let updatedCount = 0
    let failedCount = 0
    const failedIds = []

    await stocksRepo.createCollection()

    const deletedStocks = await stocksRepo.collection.deleteMany({ storeId: { $nin: storeIds.map(it => it.id) } })
    const deletedForNoStoresCount = deletedStocks.deletedCount
    logDebug(`deleted ${deletedForNoStoresCount} stocks for removed stores`, { script })

    for (const store of storeIds) {
        try {
            const rp = requestPromise({
                ...ecomOptions,
                uri: `${ECOM_URL}/stocks/${store.id}`,
                timeout: 1000 * 60 * 5
            })

            let timer

            const timeout = new Promise((resolve, reject) => {
                timer = setTimeout(() => {
                    rp.abort()
                    reject(new Error('Request timed out'))
                }, 60000 * 2)
            })

            const res: { stocks: Stock[] } = await Promise.race([rp, timeout])

            clearTimeout(timer)

            const { deletedCount } = await stocksRepo.collection.deleteMany({ storeId: store.id })
            let insertedCount = 0

            // TODO: possible race condition on stocks :(
            if (res.stocks && res.stocks.length > 0) {
                const insertRes = await stocksRepo.collection.insertMany(res.stocks)
                insertedCount = insertRes.insertedCount
            }
            updatedCount++
            logDebug(`${updatedCount + failedCount}/${storeIds.length} stocks updated. store ${store.id}`, {
                deletedCount,
                insertedCount,
                script,
                storeId: store.id
            })
        } catch (err) {
            failedIds.push(store.id)
            logError(`stocks for store ${store.id} update failed`, { script, storeId: store.id }, Severity.HIGH)
            failedCount++
        }
    }
    return { deletedForNoStoresCount, updatedCount, failedCount, failedIds }
}
