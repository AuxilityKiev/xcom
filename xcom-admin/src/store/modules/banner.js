import axios from 'axios'

import {
    BANNERS_REQUEST,
    BANNERS_SUCCESS,
    BANNERS_ERROR,
    CREATE_BANNER_REQUEST,
    CREATE_BANNER_SUCCESS,
    CREATE_BANNER_ERROR,
    UPDATE_BANNER_REQUEST,
    UPDATE_BANNER_SUCCESS,
    UPDATE_BANNER_ERROR,
    DELETE_BANNER_REQUEST,
    DELETE_BANNER_SUCCESS,
    DELETE_BANNER_ERROR
} from '../actions/banner'

const state = { banners: [], selectedBanner: null, bannerStatus: '' }

const getters = {
    banners: state => state.banners,
    selectedBanner: state => state.selectedBanner
}

const actions = {
    [BANNERS_REQUEST]: async ({ commit }) => {
        commit(BANNERS_REQUEST)
        try {
            const response = await axios.get(`/admin-api/banner`)
            commit(BANNERS_SUCCESS, response)
        } catch (error) {
            commit(BANNERS_ERROR, error)
        }
    },
    [CREATE_BANNER_REQUEST]: async ({ commit }, banner) => {
        commit(CREATE_BANNER_REQUEST)
        if (banner.regionIds[0].toString().toLowerCase() === 'all') {
            banner.regionIds = [-1]
        }
        try {
            const response = await axios.post('/admin-api/banner', banner)
            commit(CREATE_BANNER_SUCCESS, response)
        } catch (error) {
            commit(CREATE_BANNER_ERROR, error)
        }
    },
    [UPDATE_BANNER_REQUEST]: async ({ commit }, { bannerId, banner }) => {
        commit(UPDATE_BANNER_REQUEST)
        if (banner.regionIds[0].toString().toLowerCase() === 'all') {
            banner.regionIds = [-1]
        }
        try {
            const response = await axios.put(`/admin-api/banner/${bannerId}`, banner)
            commit(UPDATE_BANNER_SUCCESS, response)
        } catch (error) {
            commit(UPDATE_BANNER_ERROR, error)
        }
    },
    [DELETE_BANNER_REQUEST]: async ({ commit }, bannerId) => {
        commit(CREATE_BANNER_REQUEST)
        try {
            const response = await axios.delete(`/admin-api/banner/${bannerId}`)
            commit(DELETE_BANNER_SUCCESS, response)
        } catch (error) {
            commit(DELETE_BANNER_ERROR, error)
        }
    }
}

const mutations = {
    [BANNERS_REQUEST]: state => {
        state.bannerStatus = 'loading'
    },
    [BANNERS_SUCCESS]: (state, response) => {
        state.bannerStatus = 'success'
        state.banners = response.data
    },
    [BANNERS_ERROR]: state => {
        state.bannerStatus = 'error'
    },
    [CREATE_BANNER_REQUEST]: state => {
        state.bannerStatus = 'loading'
    },
    [CREATE_BANNER_SUCCESS]: (state, response) => {
        state.bannerStatus = 'success'
        state.selectedBanner = response.data
        state.banners.push(response.data)
    },
    [CREATE_BANNER_ERROR]: state => {
        state.bannerStatus = 'error'
    },
    [UPDATE_BANNER_REQUEST]: state => {
        state.bannerStatus = 'loading'
    },
    [UPDATE_BANNER_SUCCESS]: (state, response) => {
        state.bannerStatus = 'success'
        const updatedBanner = response.data
        const index = state.banners.findIndex(ban => ban._id === updatedBanner._id)
        state.banners[index] = updatedBanner
    },
    [UPDATE_BANNER_ERROR]: state => {
        state.bannerStatus = 'error'
    },
    [DELETE_BANNER_REQUEST]: state => {
        state.bannerStatus = 'loading'
    },
    [DELETE_BANNER_SUCCESS]: (state, response) => {
        state.bannerStatus = 'success'
        const index = state.banners.findIndex(ban => ban._id === response.data)
        state.banners.splice(index, 1)
    },
    [DELETE_BANNER_ERROR]: state => {
        state.bannerStatus = 'error'
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
