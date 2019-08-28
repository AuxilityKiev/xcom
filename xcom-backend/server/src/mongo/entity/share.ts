import * as moment from 'moment'

import { REGIONS_MAP } from '../../common/data'
import { CSVData } from '../../common/definitions'
import { isArray } from 'util'

export class Share {
    public id: number
    public goodId: number // 'Код А2005'
    public discountValue: number
    public packCount: number
    public attributeZOZ: boolean
    public startDate: Date
    public endDate: Date
    public description: string
    public regions: number[] | null

    constructor(csvRowData: CSVData) {
        this.id = parseInt(csvRowData['ID акции'], 10)
        this.goodId = parseInt(csvRowData.КодА2005, 10)
        this.discountValue = parseInt(csvRowData['Значение скидки'], 10)
        this.packCount = parseInt(csvRowData['Кол-во упаковок'], 10)
        this.attributeZOZ = !!parseInt(csvRowData['Признак ЗОЗ'], 10)
        // start date or UNIX epoch
        this.startDate = moment(csvRowData['Дата начала'], 'DD.MM.YYYY').toDate()
        const endDate = csvRowData['Дата окончания']
        if (endDate) {
            this.endDate = moment(csvRowData['Дата окончания'], 'DD.MM.YYYY').toDate()
        } else {
            this.endDate = moment(new Date())
                .add(1, 'year')
                .toDate()
        }
        this.description = csvRowData['Описание акции']
        if (csvRowData.Регион === '') {
            this.regions = null
        } else {
            const regions: number | number[] = csvRowData.Регион.split(',').map(value => {
                return REGIONS_MAP[value]
            })
            this.regions = regions.filter(reg => !isArray(reg)).concat(...regions.filter(reg => isArray(reg)))
        }
    }
}
