import { ProductFilter } from '../../parameters/productFilter'

type RegionFilter = [{ 'share.regions': { $exists: true; $eq: null } }, { 'share.regions': number }]

export class GoodsFilter {
    public siteCatId?: { $in: number[] }
    public price?: any
    public 'share.id'?: { $in: number[] }
    public 'share.endDate'?: { $gt: Date }
    public 'share.startDate'?: { $lt: Date }
    public $or?: RegionFilter
    public tradeMark?: { $eq: string }
    public tradeName?: { $eq: string }
    public manufacturer?: { $eq: string }
    public mnn?: { $eq: string }

    constructor(region: number, filter: ProductFilter) {
        if (filter.categories) {
            this.siteCatId = { $in: filter.categories }
        }
        if (filter.shares) {
            const date = new Date()
            this['share.id'] = { $in: filter.shares }
            this['share.endDate'] = { $gt: date }
            this['share.startDate'] = { $lt: date }
            this.$or = [{ 'share.regions': { $exists: true, $eq: null } }, { 'share.regions': region }]
        }
        if (filter.inStock) {
            if (filter.storeIds) {
                this.price = {
                    $elemMatch: {
                        stores: { $in: filter.storeIds }
                    }
                }
            } else {
                this.price = {
                    $elemMatch: {
                        region
                    }
                }
            }
        }
        if (filter.priceMin || filter.priceMax) {
            this.price = this.price || {}
            this.price.$elemMatch = this.price.$elemMatch || {}
            this.price.$elemMatch.region = region
            this.price.$elemMatch.priceMin = { $lt: filter.priceMax || 1000000 }
            this.price.$elemMatch.priceMax = { $gt: filter.priceMin || 0 }
        }
        if (filter.tradeMark) {
            this.tradeMark = { $eq: filter.tradeMark }
        }
        if (filter.tradeName) {
            this.tradeName = { $eq: filter.tradeName }
        }
        if (filter.manufacturer) {
            this.manufacturer = { $eq: filter.manufacturer }
        }
        if (filter.activeSubstance) {
            this.mnn = { $eq: filter.activeSubstance }
        }
    }
}
