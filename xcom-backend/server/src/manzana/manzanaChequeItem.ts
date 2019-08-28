import { IsDefined, IsInt } from 'class-validator'
import { Item } from '../common/item'

export interface ManzanaChequeItem extends Item {
    /**
     * Цена
     */
    price: number

    /**
     * Сумма по строке.
     */
    amount: number

    /**
     * Сумма скидки. (Если не передается сумма по строке,
     * то сумма рассчитывается кол-во*цена - сумма скидки)
     */
    discount: number

    /**
     * Сумма по строке со скидкой.
     */
    amountDiscounted: number

    /**
     * Доступный платеж в деньгах
     */
    availablePayment: number

    /**
     * Всего начислено баллов
     */
    chargedBonus: number

    /**
     * Начислено статусных баллов
     */
    chargedStatusBonus: number

    /**
     * Всего списано баллов
     */
    writeoffBonus: number

    /**
     * Списано статусных баллов
     */
    writeoffStatusBonus: number

    /**
     * Всего начислено активных бонусных баллов
     */
    activeChargedBonus: number

    /**
     * Всего начислено активных статусных бонусных баллов
     */
    activeChargedStatusBonus: number

    /**
     * Расширенный аттрибут
     */
    extendedAttribute?: {
        key: string
        value: string
    }
}
