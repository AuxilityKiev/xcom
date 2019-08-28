import * as requestPromise from 'request-promise-native'
import { Container } from 'typedi'
import { log, logDebug, logError, logInfo } from '../common/Logger'
import { ECOM_URL } from '../config/env.config'
import { ecomOptions } from '../ecom/ecomOptions'
import { ElasticSearchService } from '../ecom/elasticService'
import { GoodRepository } from '../mongo/repository/goods'

export default async () => {
    const goodsRepo = Container.get(GoodRepository)
    const elasticService = Container.get(ElasticSearchService)
    await goodsRepo.createCollection()
    const script = 'updateGoods'

    let updated = 0
    let inserted = 0

    const ids = []

    let pageCount = 9999
    for (let i = 1; i < pageCount; i++) {
        try {
            const res: any = await requestPromise({
                ...ecomOptions,
                uri: `${ECOM_URL}/goods?page=${i}&expand=barcodeList`
            })
            pageCount = res.pageCount
            if (res.goodsCount) {
                for (const item of res.goods) {
                    ids.push(item.id)
                    item.searchKeywords = [].concat(
                        ...(item.name || '').toLocaleLowerCase().split(' '),
                        ...(item.mnn || '').toLocaleLowerCase().split(' '),
                        ...(item.manufacturer || '').toLocaleLowerCase().split(' '),
                        ...(item.tradeMark || '').toLocaleLowerCase().split(' '),
                        ...(item.tradeName || '').toLocaleLowerCase().split(' ')
                    )
                    const upd = await goodsRepo.collection.findOneAndUpdate(
                        { id: item.id },
                        { $set: item },
                        { upsert: true }
                    )
                    if (!upd.value) {
                        inserted++
                        // TODO update price
                        // if new item added
                        // update price
                    } else {
                        updated++
                    }
                    await elasticService.upsert('goods_index', 'goods', item.id.toString(), item)
                    log(`goods ${item.id} updated`, { goodsId: item.id, script })
                }
            }
            logDebug(`goods page ${i}/${res.pageCount} updated`, { script })
        } catch (err) {
            logError(`goods page ${i} failed`, { err: err.message, script })
        }
    }

    const del = await goodsRepo.collection.deleteMany({ id: { $nin: ids } })

    logInfo('goods updated', { script })
    return { updated, inserted, deleted: del.result.n || 0 }
}
