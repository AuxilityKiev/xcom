export enum EcomOrderStatus {
    NEW = 9,
    FULLY_ASSEMBLED = 10,
    PARTIALLLY_ASSEMBLED = 11,
    SALED = 12,
    REVERSED = 13,
    REVERSED_BY_DEFECT = 14,
    REVERSED_BY_CLIENT = 15,
    ON_PICKING = 16,
    IN_PRODUCTION = 17,
    PRODUCED = 18,
    REFUND = 19
}

export const ORDER_STATUSES = [
    {
        id: 9,
        name: 'Новый',
        altName: 'Заказ передан в аптеку, начата сборка.'
    },
    {
        id: 10,
        name: 'Собран полностью',
        altName: 'Заказ собран и готов к выдаче.'
    },
    {
        id: 11,
        name: 'Собран частично',
        altName: 'Не все товары есть в наличии, с Вами свяжется аптека для уточнения деталей по заказу.'
    },
    {
        id: 12,
        name: 'Продан',
        altName: 'Заказ продан.'
    },
    {
        id: 13,
        name: 'Отказ',
        altName: 'Заказ отменен.'
    },
    {
        id: 14,
        name: 'Отказ по дефектуре',
        altName:
            'К сожалению заказ не может быть подтвержден из-за отсутствия товаров. Приносим извинения за неудобста.'
    },
    {
        id: 15,
        name: 'Отказ клиента',
        altName: 'Заказ отменен.'
    },
    {
        id: 16,
        name: 'На комплектации',
        altName: ''
    },
    {
        id: 17,
        name: 'На производстве',
        altName: ''
    },
    {
        id: 18,
        name: 'Произведен',
        altName: ''
    },
    {
        id: 19,
        name: 'Возврат',
        altName: ''
    },
    {
        id: 26,
        name: 'Ожидает поставки',
        altName: ''
    }
]
