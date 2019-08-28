import { Container } from 'typedi'
import { logDebug, logError } from '../common/Logger'
import { GoodRepository } from '../mongo/repository/goods'
import { goodImageExist } from '../utils/fileExist'
import { downloadImage } from '../utils/ftpUploader'
import { saveGoodImage } from '../utils/imageSaver'

/**
 * Before: updateGoods
 */
export default async () => {
    const script = 'updateGoodsImages'
    const goodsRepo = Container.get(GoodRepository)

    let success = 0
    let skipped = 0
    let errors = 0

    const goodsCursor = goodsRepo.collection.find({})
    while (await goodsCursor.hasNext()) {
        const item = await goodsCursor.next()
        if (goodImageExist(item.id)) {
            // todo checksum?
            logDebug(`already have images for ${item.id}, skipping...`, { script, goodsId: item.id })
            skipped++
            continue
        }
        if (item.imgLinkFTP) {
            // upload image from ftp
            try {
                const tmpFile = await downloadImage(item.imgLinkFTP)
                await saveGoodImage(tmpFile, item.id)
                await goodsRepo.updateImageLink(item.id)
                success++
                logDebug(`generated all images for ${item.id}`, { script, goodsId: item.id })
            } catch (e) {
                errors++
                logError(`err while updating image for good ${item.id}`, { err: e.message, script, goodsId: item.id })
            }
        } else {
            logDebug(`item ${item.id} does not have image link, skipping...`, { script, goodsId: item.id })
            skipped++
        }
    }

    return { success, errors, skipped }
}
