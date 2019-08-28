import * as requestPromise from 'request-promise-native'
import { Container } from 'typedi'
import { logDebug, logInfo } from '../common/Logger'
import { ECOM_URL } from '../config/env.config'
import { ecomOptions } from '../ecom/ecomOptions'
import { Store } from '../mongo/entity/store'
import { StoreRepository } from '../mongo/repository/stores'

export default async () => {
    const script = 'updateStores'
    const storesRepo = Container.get(StoreRepository)
    await storesRepo.createCollection()

    const res: { stores: Store[] } = await requestPromise({
        ...ecomOptions,
        uri: `${ECOM_URL}/stores`
    })

    for (const item of res.stores) {
        if (item.GPS) {
            let [lat, lng] = item.GPS.split(',')
            if (!lat || !lng) {
                const [l1, l2] = item.GPS.split(';')
                lat = l1
                lng = l2
            }
            item.location = {
                lat: parseFloat(lat),
                lng: parseFloat(lng)
            }
        }
        await storesRepo.collection.updateOne({ id: item.id }, { $set: item }, { upsert: true })
        logInfo(`updated store ${item.id}`, { storeId: item.id, script })
    }

    const ids = res.stores.map((it: Store) => it.id)

    // delete stores that are not in ecom anymore
    const deleteRes = await storesRepo.collection.deleteMany({ id: { $nin: ids } })

    return { updated: res.stores.length, deleted: deleteRes.result.n }
}
