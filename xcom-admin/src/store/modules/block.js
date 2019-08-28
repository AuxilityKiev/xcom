import axios from 'axios'

import {
    BLOCKS_REQUEST,
    BLOCKS_SUCCESS,
    BLOCKS_ERROR,
    CREATE_BLOCK_REQUEST,
    CREATE_BLOCK_SUCCESS,
    CREATE_BLOCK_ERROR,
    UPDATE_BLOCK_REQUEST,
    UPDATE_BLOCK_SUCCESS,
    UPDATE_BLOCK_ERROR,
    DELETE_BLOCK_REQUEST,
    DELETE_BLOCK_SUCCESS,
    DELETE_BLOCK_ERROR
} from '../actions/block'

const state = { blocks: [], selectedBlock: null, blockStatus: '' }

const getters = {
    blocks: state => state.blocks,
    selectedBlock: state => state.selectedBlock
}

const actions = {
    [BLOCKS_REQUEST]: async ({ commit }) => {
        commit(BLOCKS_REQUEST)
        try {
            const response = await axios.get(`/admin-api/block`)
            commit(BLOCKS_SUCCESS, response)
        } catch (error) {
            commit(BLOCKS_ERROR, error)
        }
    },
    [CREATE_BLOCK_REQUEST]: async ({ commit }, block) => {
        commit(CREATE_BLOCK_REQUEST)
        if (block.regionIds[0].toString().toLowerCase() === 'all') {
            block.regionIds = [-1]
        }
        try {
            const response = await axios.post('/admin-api/block', block)
            commit(CREATE_BLOCK_SUCCESS, response)
        } catch (error) {
            commit(CREATE_BLOCK_ERROR, error)
        }
    },
    [UPDATE_BLOCK_REQUEST]: async ({ commit }, { blockId, block }) => {
        commit(UPDATE_BLOCK_REQUEST)
        if (block.regionIds[0].toString().toLowerCase() === 'all') {
            block.regionIds = [-1]
        }
        try {
            const response = await axios.put(`/admin-api/block/${blockId}`, block)
            commit(UPDATE_BLOCK_SUCCESS, response)
        } catch (error) {
            commit(UPDATE_BLOCK_ERROR, error)
        }
    },
    [DELETE_BLOCK_REQUEST]: async ({ commit }, blockId) => {
        commit(DELETE_BLOCK_REQUEST)
        try {
            const response = await axios.delete(`/admin-api/block/${blockId}`)
            commit(DELETE_BLOCK_SUCCESS, response)
        } catch (error) {
            commit(DELETE_BLOCK_ERROR, error)
        }
    }
}

const mutations = {
    [BLOCKS_REQUEST]: state => {
        state.blockStatus = 'loading'
    },
    [BLOCKS_SUCCESS]: (state, response) => {
        state.blockStatus = 'success'
        state.blocks = response.data
    },
    [BLOCKS_ERROR]: state => {
        state.blockStatus = 'error'
    },
    [CREATE_BLOCK_REQUEST]: state => {
        state.blockStatus = 'loading'
    },
    [CREATE_BLOCK_SUCCESS]: (state, response) => {
        state.blockStatus = 'success'
        state.blocks.push(response.data)
    },
    [CREATE_BLOCK_ERROR]: state => {
        state.blockStatus = 'error'
    },
    [UPDATE_BLOCK_REQUEST]: state => {
        state.blockStatus = 'loading'
    },
    [UPDATE_BLOCK_SUCCESS]: (state, response) => {
        state.blockStatus = 'success'
        const updatedBlock = response.data
        const index = state.blocks.findIndex(bl => bl._id === updatedBlock._id)
        state.blocks[index] = updatedBlock
    },
    [UPDATE_BLOCK_ERROR]: state => {
        state.blockStatus = 'error'
    },
    [DELETE_BLOCK_REQUEST]: state => {
        state.blockStatus = 'loading'
    },
    [DELETE_BLOCK_SUCCESS]: (state, response) => {
        state.blockStatus = 'success'
        const index = state.blocks.findIndex(bl => bl._id === response.data)
        state.blocks.splice(index, 1)
    },
    [DELETE_BLOCK_ERROR]: state => {
        state.blockStatus = 'error'
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
