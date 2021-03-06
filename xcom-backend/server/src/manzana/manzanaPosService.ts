import { Inject, Service } from 'typedi'
import { SoftChequeRequest } from '../common/softChequeRequest'
import { MANZANA_CASH_URL } from '../config/env.config'
import SoapUtil from '../utils/soapUtil'
import { ManzanaCheque } from './manzanaCheque'

@Service()
export class ManzanaPosService {
    @Inject()
    private soapUtil!: SoapUtil

    public async getCheque(chequeRequest: SoftChequeRequest): Promise<ManzanaCheque> {
        return this.soapUtil.sendRequest(MANZANA_CASH_URL, chequeRequest)
    }
}
