import { Container } from 'typedi'
import { logDebug, logInfo } from '../common/Logger'
import { GoodRepository } from '../mongo/repository/goods'
import { Price, StocksRepository } from '../mongo/repository/stocks'

/**
 * Before: updateGoods, updateStocks
 */
export default async () => {
    const script = 'updatePricesIndex'
    const stocksRepo = Container.get(StocksRepository)
    const goodsRepo = Container.get(GoodRepository)

    const pricesCursor = await stocksRepo.getMinMaxCursor()
    let updated = 0

    const updatedGoods = new Set()

    while (await pricesCursor.hasNext()) {
        const good: { id: number; price: Price } = (await pricesCursor.next())!
        updatedGoods.add(good.id)
        await goodsRepo.collection.updateOne({ id: good.id }, { $set: { price: good.price } })
        logDebug(`updatePricesIndex: price for ${good.id} updated`, { script, goodsId: good.id })
        updated++
    }

    // set null prices to all goods that don't have stocks
    const res = await goodsRepo.collection.updateMany(
        { id: { $nin: Array.from(updatedGoods) } },
        { $set: { price: null } }
    )

    logInfo(`prices updated`, { script })
    return { updated, nulled: res.modifiedCount }
}
