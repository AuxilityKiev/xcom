import * as bcrypt from 'bcrypt'

import { Admin } from '../mongo/entity/admin'

export const ADMINS: Admin[] = [
    new Admin('admin', bcrypt.hashSync('admin', bcrypt.genSaltSync(10))),
    new Admin('test', bcrypt.hashSync('test', bcrypt.genSaltSync(10)))
]

export const orderedCategoriesRoots: Array<{ id: number; order: number }> = [
    {
        id: 7,
        order: 0
    },
    {
        id: 6,
        order: 1
    },
    {
        id: 9,
        order: 2
    },
    {
        id: 3,
        order: 3
    },
    {
        id: 8,
        order: 4
    },
    {
        id: 2,
        order: 5
    },
    {
        id: 5,
        order: 6
    },
    {
        id: 14,
        order: 7
    },
    {
        id: 10,
        order: 8
    },
    {
        id: 13,
        order: 9
    }
]

export const REGIONS_MAP: any = {
    20237: [50, 77],
    20238: 78,
    20947: 13,
    20871: 21,
    21024: 23,
    21033: 24,
    21143: 31,
    20869: 33,
    20873: 34,
    21023: 35,
    21031: 42,
    20903: 48,
    20816: 52,
    20817: 54,
    20949: 57,
    20948: 58,
    21026: 61,
    20874: 62,
    20659: 64,
    21083: 72,
    21025: 76
}

export const TECHNICAL_CARD = '9419410000035'
