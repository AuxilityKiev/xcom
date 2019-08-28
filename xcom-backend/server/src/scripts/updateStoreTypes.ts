import { Container } from 'typedi'
import { logInfo } from '../common/Logger'
import { StoreRepository } from '../mongo/repository/stores'
import { StoreTypeRepository } from '../mongo/repository/storeTypes'
import { storeTypesIconsMap } from '../utils/storeTypesIcons'

/**
 * Before: updateStores
 */
export default async () => {
    const script = 'updateStoreTypes'
    const storesRepo = Container.get(StoreRepository)
    const storeTypesRepo = Container.get(StoreTypeRepository)

    const types = await storesRepo.getLocationsType()
    for (const item of types) {
        item.img = storeTypesIconsMap.get(item.name)
    }

    await storeTypesRepo.dropCollection()
    await storeTypesRepo.createCollection()
    await storeTypesRepo.insertMany(types)
    logInfo('store types updated', { script })
    return { updated: types.length }
}
