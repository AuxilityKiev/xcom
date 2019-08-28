import axios from 'axios'

import {
    SELECT_REGIONS,
    SELECT_PRODUCTS,
    REMOVE_REGION,
    REMOVE_PRODUCT,
    DISCOUNT_UPLOAD_REQUEST,
    DISCOUNT_UPLOAD_SUCCESS,
    DISCOUNT_UPLOAD_ERROR,
    IMPORT_VIRTUAL_CARDS_REQUEST,
    IMPORT_VIRTUAL_CARDS_SUCCESS,
    IMPORT_VIRTUAL_CARDS_ERROR,
    RESET_UPLOAD_STATUS
} from '../actions/xcom'
import { XCOM_URL, XCOM_USER, XCOM_PASS } from '../../config/env.config'

const state = {
    selectedRegions: null,
    selectedProducts: null,
    uploadStatus: null
}

const getters = {
    selectedRegions: state => state.selectedRegions,
    selectedStore: state => state.selectedStore,
    selectedProducts: state => state.selectedProducts,
    uploadStatus: state => state.uploadStatus
}

const actions = {
    [REMOVE_PRODUCT]: ({ commit }, productId) => {
        commit(REMOVE_PRODUCT, productId)
    },
    [REMOVE_REGION]: ({ commit }, regionId) => {
        commit(REMOVE_REGION, regionId)
    },
    [SELECT_REGIONS]: ({ commit }, selectedRegions) => {
        commit(SELECT_REGIONS, selectedRegions)
    },
    [SELECT_PRODUCTS]: ({ commit }, products) => {
        commit(SELECT_PRODUCTS, products)
    },
    [DISCOUNT_UPLOAD_REQUEST]: async ({ commit }, data) => {
        commit(DISCOUNT_UPLOAD_REQUEST)
        try {
            const response = await axios.post(`${XCOM_URL}/shares`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                auth: {
                    username: XCOM_USER,
                    password: XCOM_PASS
                }
            })
            commit(DISCOUNT_UPLOAD_SUCCESS, response)
        } catch (error) {
            commit(DISCOUNT_UPLOAD_ERROR, error)
        }
    },
    [IMPORT_VIRTUAL_CARDS_REQUEST]: async ({ commit }, data) => {
        commit(IMPORT_VIRTUAL_CARDS_REQUEST)
        try {
            const response = await axios.post(`${XCOM_URL}/cards/importCSV`, data, {
                auth: {
                    username: XCOM_USER,
                    password: XCOM_PASS
                }
            })
            commit(IMPORT_VIRTUAL_CARDS_SUCCESS, response)
        } catch (error) {
            commit(IMPORT_VIRTUAL_CARDS_ERROR, error)
        }
    },
    [RESET_UPLOAD_STATUS]: ({ commit }) => {
        commit(RESET_UPLOAD_STATUS)
    }
}

const mutations = {
    [SELECT_REGIONS]: (state, data) => {
        state.selectedRegions = data
    },
    [SELECT_PRODUCTS]: (state, data) => {
        state.selectedProducts = data
    },
    [REMOVE_REGION]: (state, data) => {
        state.selectedRegions && state.selectedRegions.splice(state.selectedRegions.indexOf(data), 1)
    },
    [REMOVE_PRODUCT]: (state, data) => {
        state.selectedProducts && state.selectedProducts.splice(state.selectedProducts.indexOf(data), 1)
    },
    [DISCOUNT_UPLOAD_REQUEST]: state => {
        state.uploadStatus = 'loading'
    },
    [DISCOUNT_UPLOAD_SUCCESS]: state => {
        state.uploadStatus = 'success'
    },
    [DISCOUNT_UPLOAD_ERROR]: state => {
        state.uploadStatus = 'error'
    },
    [IMPORT_VIRTUAL_CARDS_REQUEST]: state => {
        state.uploadStatus = 'loading'
    },
    [IMPORT_VIRTUAL_CARDS_SUCCESS]: state => {
        state.uploadStatus = 'success'
    },
    [IMPORT_VIRTUAL_CARDS_ERROR]: state => {
        state.uploadStatus = 'error'
    },
    [RESET_UPLOAD_STATUS]: state => {
        state.uploadStatus = null
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
