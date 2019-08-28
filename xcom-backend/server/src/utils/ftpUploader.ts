import * as appRoot from 'app-root-path'
import * as fs from 'fs'
import * as FtpClient from 'ftp'
import * as path from 'path'

import { logDebug, logError, logWarn } from '../common/Logger'
import {
    FTP_CLIENT_HOST,
    FTP_CLIENT_PASSWORD,
    FTP_CLIENT_PORT,
    FTP_CLIENT_USER,
    IMAGE_TMP_FOLDER
} from '../config/env.config'

export async function downloadImage(imgLinkFTP: string) {
    return new Promise<string>((resolve, reject) => {
        const client = new FtpClient()
        client.on('ready', () => {
            const ftp = path.join(path.basename(path.dirname(imgLinkFTP)), path.basename(imgLinkFTP))
            const destination = `${appRoot}/${IMAGE_TMP_FOLDER}/${path.basename(imgLinkFTP)}`
            client.get(ftp, (err, stream) => {
                if (err || !stream) {
                    logWarn(`${imgLinkFTP} was failed.`, { err, context: __filename })
                    client.end()
                    reject(err)
                } else {
                    stream.once('close', () => {
                        resolve(destination)
                        logDebug(`${imgLinkFTP} was uploaded.`, { context: __filename })
                        client.end()
                    })
                    stream.pipe(fs.createWriteStream(destination))
                }
            })
        })

        client.on('error', (e: Error) => {
            reject(e)
        })

        // set 2-minute timeout
        setTimeout(() => {
            client.abort(error => reject(new Error('download timed out')))
        }, 60000 * 2)

        client.connect({
            host: FTP_CLIENT_HOST,
            port: FTP_CLIENT_PORT,
            user: FTP_CLIENT_USER,
            password: FTP_CLIENT_PASSWORD
        })
    })
}
