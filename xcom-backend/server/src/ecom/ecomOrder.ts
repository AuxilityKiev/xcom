// https://docs.google.com/document/d/12qB6IpXknP48yfyHkfkvrCxZ-NvEKq-hMchIRLeuHdc/edit#heading=h.bn92tmk9unyx
import { Container } from 'typedi'
import { FiscalChequeRequest } from '../common/fiscalChequeRequest'
import { Item } from '../common/item'
import { ManzanaCheque } from '../manzana/manzanaCheque'
import { CountersRepository } from '../mongo/repository/counters'
import { INN } from '../mongo/repository/stores'
import { PayType } from './payType'

export interface EcomOrderMeta {
    storeId: number // Код склада
    loyaltyCard?: string // Код карты клиента
    clientName: string // ФИО Клиента
    clientTel: string // Номер телефона клиента (7XXXXXXXXXX)
}

export interface EcomOrder extends EcomOrderMeta {
    serviceDetail?: string // Детали источника заказа (переход с яндекс маркета и т.п.)
    preorder?: boolean // Признак предзаказа (Заказ того, чего нет на остатках в данный момент)
    extId: string // Код заказа источника
    extDate: string // Дата заказа источника
    statusId?: number // Идентификатор статуса текущего заказа
    extStatusId?: string // Внешний статус источника (если есть)
    extComment?: string // Комментарий от внешней системы
    insuranceId?: string // Идентификатор сервиса страхования по заказу. (Заказы по страховому контракту)
    clientEmail?: string // Электронная почта клиента
    clientAddress?: string // Адрес доставки
    clientComment?: string // Комментарий от клиента
    loyaltyCardType?: string // Тип карты лояльности (“Забота о здоровье” и т.п.)
    paySum?: number // Сумма оплаты
    payGUID?: string // Идентификатор транзакции платежной системы
    payType?: number // Тип оплаты
    deliveryServiceId?: string // Сервис доставки
    deliveryTimeFrom?: string // Дата доставки с * (Если в заказе указать сервис доставки, то все поля “delivery*” становятся обязательными)
    deliveryTimeTo?: string // Дата доставки по * (Если в заказе указать сервис доставки, то все поля “delivery*” становятся обязательными)
    /**
     * Extended attributes (soft cheque request body)
     */
    additionalFields?: {
        ManzanaSoftCheck: string
    }
    basket: OrderItem[] // Корзина товара (массив элементов),
}

export interface OrderItem extends Item {
    price: number
    batch?: string // Идентификатор партии
    analogAllow?: boolean // Признак, искать по всем аналогам. (используется для предзаказов товара)
    amount?: number // Сумма по строке. (Если передается сумма по строке и она меньше кол-во*цена, то рассчитывается скидка)
    discount?: number // Сумма скидки. (Если не передается сумма по строке, то сумма рассчитывается кол-во*цена - сумма скидки)
}

export const createEcomOrder = async (
    { storeId, loyaltyCard, clientName, clientTel, loyaltyCardType }: FiscalChequeRequest,
    manzanaCheque: ManzanaCheque,
    payType: PayType,
    inn: string
): Promise<EcomOrder & INN> => {
    const countersRepository = Container.get(CountersRepository)
    return {
        storeId,
        loyaltyCard,
        clientName,
        clientTel,
        payType,
        paySum: manzanaCheque.amountDiscounted,
        extDate: new Date().toISOString(),
        basket: manzanaCheque.basket.map(it => {
            return {
                ...it,
                // manzana discount is in % and ECOM is in value
                discount: it.amount * (it.discount / 100)
            }
        }),
        INN: inn,
        // order number of type M123456
        extId: 'M' + (await countersRepository.getNextOrderNumber()).toString().padStart(6, '0'),
        loyaltyCardType,
        serviceDetail: 'Android/iOS',
        additionalFields: { ManzanaSoftCheck: manzanaCheque.responseRaw }
    }
}
