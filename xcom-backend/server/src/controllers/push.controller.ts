import { PhoneNumberFormat as PNF, PhoneNumberUtil } from 'google-libphonenumber'
import {
    Authorized,
    Body,
    Delete,
    JsonController,
    NotFoundError,
    Param,
    Post,
    Put,
    State,
    UseBefore
} from 'routing-controllers'
import { Inject } from 'typedi'
import { log, logError, logInfo, LogLevel } from '../common/Logger'
import { ORDER_STATUSES } from '../ecom/ecomOrderStatus'
import { FcmService } from '../fcm/FcmService'
import { ManzanaUser } from '../manzana/manzanaUser'
import { ManzanaUserApiClient } from '../manzana/manzanaUserApiClient'
import { ManzanaAuthMiddleware } from '../middlewares/manzanaAuth.middleware'
import { Device } from '../mongo/entity/device'
import { DevicesRepository } from '../mongo/repository/devices'
import { OrderStatusPushRequest } from '../parameters/OrderStatusPushRequest'
import { RegisterDeviceRequest } from '../parameters/RegisterDeviceRequest'
import LocalizationManager from '../utils/localizationManager'

@JsonController('/push')
export class PushController {
    @Inject()
    private readonly fcmService!: FcmService
    @Inject()
    private readonly devices!: DevicesRepository
    @Inject()
    private readonly localizationManager!: LocalizationManager

    @Authorized()
    @Post('/order/status')
    public async send(@Body() request: OrderStatusPushRequest) {
        const phoneNumberUtil: PhoneNumberUtil = PhoneNumberUtil.getInstance()
        const phoneNumber = phoneNumberUtil.format(phoneNumberUtil.parse(request.phoneNumber, 'RU'), PNF.E164)
        const status = ORDER_STATUSES.find(it => it.id === request.orderStatusId)
        if (!status) {
            throw new NotFoundError('No status with this id')
        }

        const devices = await this.devices.findForNumber(phoneNumber)
        if (!devices.length) {
            log(`no registered devices for ${phoneNumber}`, { request, context: __filename }, LogLevel.WARN)
        }

        const deliveries = devices.map(async (device: Device) => {
            const notification = {
                title: this.localizationManager.getValue(18, request.extId),
                body: status.altName || status.name
            }
            try {
                await this.fcmService.send(device.deviceToken, notification, request)
                logInfo(`push sent to ${phoneNumber}`, { notification, context: __filename })
            } catch (e) {
                logError(`push delivery to ${phoneNumber} failed`, { reason: e, context: __filename })
            }
        })

        // client will not wait for the delivery of all notifications
        Promise.all(deliveries)

        return { scheduled: true }
    }

    @Delete('/devices/:deviceToken')
    public async unsubscribe(@Param('deviceToken') deviceToken: string) {
        await this.devices.delete(deviceToken)
        return { success: true }
    }

    @Put('/devices')
    @UseBefore(ManzanaAuthMiddleware)
    public async putDevice(
        @Body() request: RegisterDeviceRequest,
        @State('manzanaClient') manzanaClient: ManzanaUserApiClient
    ) {
        const user: ManzanaUser = await manzanaClient.getCurrentUser()
        const phoneNumberUtil: PhoneNumberUtil = PhoneNumberUtil.getInstance()
        const phoneNumber = phoneNumberUtil.format(phoneNumberUtil.parse(user.MobilePhone, 'RU'), PNF.E164)
        await this.devices.insert({
            phoneNumber,
            deviceToken: request.deviceToken
        })
        return { success: true }
    }
}
