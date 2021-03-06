import { IsArray, IsBoolean, IsEnum, IsPositive, Length } from 'class-validator'

export class ProductFilter {
    @Length(1, 100)
    public query?: string
    @IsArray()
    @IsPositive({ each: true })
    public categories?: number[]
    @IsArray()
    @IsPositive({ each: true })
    public shares?: number[]
    @IsPositive()
    public labelCategoryId?: number
    @IsPositive()
    public priceMin?: number
    @IsPositive()
    public priceMax?: number
    @IsEnum({ asc: 'asc', desc: 'desc' })
    public order?: string
    @IsEnum({ top: 'top', price: 'price', name: 'name' })
    public sort?: string
    /**
     * Show only products that are in stock
     */
    @IsBoolean()
    public inStock: boolean
    @IsArray()
    public storeIds?: number[]
    @Length(3, 50)
    public tradeMark?: string
    @Length(3, 50)
    public tradeName?: string
    @Length(3, 50)
    public manufacturer?: string
    @Length(3, 50)
    public activeSubstance?: string

    constructor(query: any) {
        if (query.query) {
            this.query = query.query
        }
        this.order = query.order
        this.sort = query.sort
        if (query.categories) {
            this.categories = query.categories.split(',').map(Number)
        }
        if (query.shares) {
            this.shares = query.shares.split(',').map(Number)
        }
        if (query.labelCategoryId) {
            this.labelCategoryId = parseInt(query.labelCategoryId, 10)
        }
        if (query.priceMin) {
            this.priceMin = parseInt(query.priceMin, 10)
            if (this.priceMin <= 0) {
                this.priceMin = 1
            }
        }
        if (query.priceMax) {
            this.priceMax = parseInt(query.priceMax, 10)
            if (this.priceMax <= 0) {
                this.priceMax = 1
            }
        }
        if (query.labelCategoryId) {
            this.labelCategoryId = parseInt(query.labelCategoryId, 10)
        }
        if (query.storeId) {
            this.storeIds = (Array.isArray(query.storeId) ? query.storeId : [query.storeId]).map(Number)
        }
        this.tradeMark = query.tradeMark
        this.tradeName = query.tradeName
        this.manufacturer = query.manufacturer
        this.inStock = query.inStock === 'true'
        this.activeSubstance = query.activeSubstance
    }
}
