import axios from 'axios'

import { IMAGE_UPLOAD_REQUEST, IMAGE_UPLOAD_SUCCESS, IMAGE_UPLOAD_ERROR, SELECT_IMAGE } from '../actions/image'

const state = {
    imageUploadStatus: null,
    image: {
        url: null,
        data: null
    }
}

const getters = {
    imageUploadStatus: state => state.imageUploadStatus,
    imageUrl: state => state.image.url,
    imageData: state => state.image.data
}

const actions = {
    [IMAGE_UPLOAD_REQUEST]: async ({ commit }, { bannerId, image }) => {
        commit(IMAGE_UPLOAD_REQUEST)
        try {
            const response = await axios.post(`/admin-api/banner/${bannerId}/image`, image, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            commit(IMAGE_UPLOAD_SUCCESS, response)
            console.log(response.data.url)
            commit(SELECT_IMAGE, { url: response.data.url })
        } catch (error) {
            commit(IMAGE_UPLOAD_ERROR, error)
        }
    },
    [SELECT_IMAGE]: ({ commit }, data) => {
        commit(SELECT_IMAGE, data)
    }
}

const mutations = {
    [IMAGE_UPLOAD_REQUEST]: state => {
        state.imageUploadStatus = 'loading'
    },
    [IMAGE_UPLOAD_SUCCESS]: state => {
        state.imageUploadStatus = 'success'
    },
    [IMAGE_UPLOAD_ERROR]: state => {
        state.imageUploadStatus = 'error'
    },
    [SELECT_IMAGE]: (state, data) => {
        state.image = { ...state.image, ...data }
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
