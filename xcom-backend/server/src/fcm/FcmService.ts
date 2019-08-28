import { Service } from 'typedi'
import { FCM_SERVER_KEY } from '../config/env.config'

const FCM = require('fcm-node')

interface Notification {
    title: string
    body: string
}

@Service()
export class FcmService {
    private readonly fcm = new FCM(FCM_SERVER_KEY)

    public async send(token: string, notification: Notification, data?: any) {
        const message = {
            to: token,
            notification,
            data
        }
        return new Promise((resolve, reject) => {
            this.fcm.send(message, (err: any, response: any) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(response)
                }
            })
        })
    }
}
