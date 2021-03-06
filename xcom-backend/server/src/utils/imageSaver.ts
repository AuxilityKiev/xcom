import * as sharp from 'sharp'
import { logVerbose } from '../common/Logger'
import { IMAGE_FOLDER, IMAGE_GOOD_FOLDER, IMAGE_M_SUBFOLDER, IMAGE_S_SUBFOLDER } from '../config/env.config'

async function saveM(from: string, to: string) {
    await sharp(from)
        .background({ r: 255, g: 255, b: 255, alpha: 1 })
        .flatten()
        .resize(250, 250)
        .max()
        .withoutEnlargement()
        .jpeg({ quality: 90 })
        .toFile(to)
    logVerbose('image saved', { name: to, context: __filename })
}

async function saveS(from: string, to: string) {
    await sharp(from)
        .background({ r: 255, g: 255, b: 255, alpha: 1 })
        .flatten()
        .resize(30, 30)
        .max()
        .withoutEnlargement()
        .jpeg({ quality: 100 })
        .toFile(to)
    logVerbose('image saved', { name: to, context: __filename })
}

async function save(from: string, to: string) {
    await sharp(from)
        .background({ r: 255, g: 255, b: 255, alpha: 1 })
        .flatten()
        .resize(1920, 1920)
        .max()
        .withoutEnlargement()
        .jpeg({ progressive: true })
        .toFile(to)
    logVerbose('image saved', { name: to, context: __filename })
}

export async function saveGoodImage(from: string, id: number) {
    const to = `${IMAGE_FOLDER}${IMAGE_GOOD_FOLDER}${id}.jpeg`
    const toS = `${IMAGE_FOLDER}${IMAGE_GOOD_FOLDER}${IMAGE_S_SUBFOLDER}${id}.jpeg`
    const toM = `${IMAGE_FOLDER}${IMAGE_GOOD_FOLDER}${IMAGE_M_SUBFOLDER}${id}.jpeg`
    await save(from, to)
    await saveS(from, toS)
    await saveM(from, toM)
}
