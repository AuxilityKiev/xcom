export class GoodsSort {
    public $sort: any

    constructor(sort?: string, order?: string) {
        if (!sort) {
            sort = 'top'
        }
        if (!order) {
            order = 'desc'
        }
        const orderSign = order === 'desc' ? -1 : 1
        if (sort === 'price') {
            this.$sort = {
                sortHint: orderSign,
                price: orderSign
            }
        } else if (sort === 'name') {
            this.$sort = { name: orderSign }
        } else if (sort === 'top') {
            this.$sort = { ordersLast30d: orderSign }
        } else {
            this.$sort = {
                img: orderSign,
                price: -1 // null prices at bottom
            }
        }
    }
}
