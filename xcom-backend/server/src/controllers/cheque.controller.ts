import { BadRequestError, Body, JsonController, Post } from 'routing-controllers'
import { Inject } from 'typedi'

import { SoftChequeRequest } from '../common/softChequeRequest'
import { NODE_ENV } from '../config/env.config'
import { PayType } from '../ecom/payType'
import { ManzanaCheque } from '../manzana/manzanaCheque'
import { ManzanaPosService } from '../manzana/manzanaPosService'
import { INN, StoreRepository } from '../mongo/repository/stores'
import { AccountManager } from '../sbol/accountManager'
import LocalizationManager from '../utils/localizationManager'

@JsonController('/cheque')
export class ChequeController {
    @Inject()
    private readonly manzanaPosService!: ManzanaPosService
    @Inject()
    private readonly stores!: StoreRepository
    @Inject()
    private readonly accountManager!: AccountManager
    @Inject()
    private readonly localizationManager!: LocalizationManager

    @Post('/soft')
    public async handleSoftCheque(
        @Body() request: SoftChequeRequest
    ): Promise<ManzanaCheque & { payTypes: PayType[] }> {
        const inn: INN | null = await this.stores.getInn(request.storeId)
        if (!inn) {
            throw new BadRequestError(`${this.localizationManager.getValue(6)} ${request.storeId}`)
        }
        const manzanaCheque: ManzanaCheque = await this.manzanaPosService.getCheque(request)
        const payTypes: PayType[] = [PayType.CASH]
        // check if has a gateway account with this INN
        // TODO: online payment temporarily disabled for prod
        if (inn.INN && this.accountManager.getForInn(inn.INN)) {
            payTypes.push(PayType.ONLINE)
        }
        return {
            ...manzanaCheque,
            payTypes
        }
    }
}
