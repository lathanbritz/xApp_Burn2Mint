'use strict'
 
import { XrplClient } from 'xrpl-client'

export const AppStore = {
    state: () => ({
        version: '0.0.1',
        xumm: {
            tokenData: {
                nodetype: 'MAINNET'
            }
        },
        client: null,
        account: '',
        regular_key: '',
        user_token: '',
        signer_lists: [],
        account_data: {},
        ledger: 0
    }),
    actions: {
        clientConnect({commit}, force) {
            commit('CONNECT', force)
        },
        clientClose({commit}) {
            commit('CLOSE')
        },
        xummTokenData({commit}, data) {
            commit('TOKEN_DATA', data)
        },
        setUserToken({commit}, user_token) {
            commit('USER_TOKEN', user_token)
        },
        setAccount({commit}, account) {
            commit('ACCOUNT', account)
        },
        clearSignerList({commit}) {
            commit('CLEAR_SIGNER_LIST')
        },
        setSignerList({commit}, data) {
            commit('SIGNER_LIST', data)
        },
        setLedger({commit}, ledger) {
            commit('LEDGER', ledger)
        },
        setAccountData({commit}, data) {
            commit('ACCOUNT_DATA', data)
        },
        setRegularKey({commit}, address) {
            commit('REGULAR_KEY', address)
        }
    },
    mutations: {
        TOKEN_DATA(state, data) {
            state.xumm.tokenData = data
        },
        ACCOUNT(state, account) {
            state.account = account
        },
        CLEAR_SIGNER_LIST(state) {
            state.signer_lists = []
        },
        SIGNER_LIST(state, data) {
            if (!('SignerListID' in data)) { return }
            state.signer_lists[data.SignerListID] = data
        },
        USER_TOKEN(state, user_token) {
            state.user_token = user_token
        },
        LEDGER(state, ledger) {
            state.ledger = ledger
        },
        ACCOUNT_DATA(state, data) {
            state.account_data = data
        },
        REGULAR_KEY(state, address) {
            state.regular_key = address
        },
        CONNECT(state, force) {
            const servers = [state.xumm.tokenData.nodewss]
            if (state.xumm.tokenData.nodetype === 'MAINNET') {
                servers.unshift('wss://node2.panicbot.xyz')
                servers.unshift('wss://node.panicbot.xyz')
            }

            if (force || state.client == null) {
                state.client = new XrplClient(servers)
            }
        },
        CLOSE(state) {
            state.client.close()
            state.client = null
        }
    },
    getters: {
        getVersion: (state) => {
            return state.version
        },
        getXummTokenData: (state) => {
            return state.xumm.tokenData
        },
        getUserToken: (state) => {
            return state.user_token
        },
        getAccount: (state) => {
            return state.account
        },
        getSignerLists: (state) => {
            return state.signer_lists
        },
        getRegularKey: (state) => {
            return state.regular_key
        },
        getSignerList: (state) => (key) => {
            if (key in state.signer_lists) {
                return state.signer_lists[key]
            }
            return []
        },
        getLedger: (state) => {
            return state.ledger
        },
        getAccountData: (state) => {
            return state.account_data
        },
        getClient: state => {
            return state.client
        }
    }
}