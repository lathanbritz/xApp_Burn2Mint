<template>
    <!-- <p class="text-light">{{ $store.getters.getAccount }}</p> -->
    <div class="mt-5 pt-5 mb-4 bg-light rounded-3">
        <div class="container-fluid pt-5 pb-2">
            <div class="mo-fire">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="125px" height="189.864px" viewBox="0 0 125 189.864" enable-background="new 0 0 125 189.864" xml:space="preserve">
                    <path class="flame-main" fill="#F36E21" d="M76.553,186.09c0,0-10.178-2.976-15.325-8.226s-9.278-16.82-9.278-16.82s-0.241-6.647-4.136-18.465 c0,0,3.357,4.969,5.103,9.938c0,0-5.305-21.086,1.712-30.418c7.017-9.333,0.571-35.654-2.25-37.534c0,0,13.07,5.64,19.875,47.54 c6.806,41.899,16.831,45.301,6.088,53.985"/>
                    <path class="flame-main one" fill="#F6891F" d="M61.693,122.257c4.117-15.4,12.097-14.487-11.589-60.872c0,0,32.016,10.223,52.601,63.123 c20.585,52.899-19.848,61.045-19.643,61.582c0.206,0.537-19.401-0.269-14.835-18.532S57.576,137.656,61.693,122.257z"/>
                    <path class="flame-main two" fill="#FFD04A" d="M81.657,79.192c0,0,11.549,24.845,3.626,40.02c-7.924,15.175-21.126,41.899-0.425,64.998 C84.858,184.21,125.705,150.905,81.657,79.192z"/>
                    <path class="flame-main three" fill="#FDBA16" d="M99.92,101.754c0,0-23.208,47.027-12.043,80.072c0,0,32.741-16.073,20.108-45.79 C95.354,106.319,99.92,114.108,99.92,101.754z"/>
                    <path class="flame-main four" fill="#F36E21" d="M103.143,105.917c0,0,8.927,30.753-1.043,46.868c-9.969,16.115-14.799,29.041-14.799,29.041 S134.387,164.603,103.143,105.917z"/>
                    <path class="flame-main five" fill="#FDBA16" d="M62.049,104.171c0,0-15.645,67.588,10.529,77.655C98.753,191.894,69.033,130.761,62.049,104.171z"/>
                    <path class="flame" fill="#F36E21" d="M101.011,112.926c0,0,8.973,10.519,4.556,16.543C99.37,129.735,106.752,117.406,101.011,112.926z"/>
                    <path class="flame one" fill="#F36E21" d="M55.592,126.854c0,0-3.819,13.29,2.699,16.945C64.038,141.48,55.907,132.263,55.592,126.854z"/>
                    <path class="flame two" fill="#F36E21" d="M54.918,104.595c0,0-3.959,6.109-1.24,8.949C56.93,113.256,52.228,107.329,54.918,104.595z"/>
                </svg>
            </div>

            <h1 class="display-5 fw-bold"><slot></slot></h1>

            <div class="input-group mb-3">
                <div v-if="isLoaded">
                    <input type="text" class="form-control" placehoder="amount to burn"/>
                    <select class="form-select" aria-label="Disabled select example" disabled>
                        <option value="XRP">XRP</option>
                    </select>
                    <button type="button" class="btn btn-primary">burn</button>
                </div>
                <div v-else>
                    <div class="spinner-border text-light" role="status">
                        <span class="visually-hidden"></span>
                    </div>
                    <span>analyzing accounts...</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { flagNames } from 'flagnames'
    import { XrplClient } from 'xrpl-client'
    import { XummSdkJwt } from 'xumm-sdk'

    const xapp = window.xAppSdk
    export default {
        name: 'Heads',
        data() {
            return {
                Sdk: new XummSdkJwt(import.meta.env.VITE_APP_XAPP_KEY),
                isLoaded: false,
                client: null
            }
        },
        async mounted() {
            console.log('mounting head')
            await this.jwtFlow()
            await this.accountInfo()
            await this.signerList()
            this.isLoaded = true
        },
        methods: {
            async jwtFlow() {
                console.log('jwtFlow', import.meta.env.VITE_APP_XAPP_KEY)
                const tokenData = await this.Sdk.getOttData()
                console.log('tokenData', tokenData)
                this.$store.dispatch('xummTokenData', tokenData)
                console.log('account', tokenData.account)
                this.$store.dispatch('setAccount', tokenData.account)
                this.$store.dispatch('clientConnect', true)
                this.client =  this.$store.getters.getClient
            },
            async accountInfo() {
                const payload = {
                    'id': 1,
                    'command': 'account_info',
                    'account': this.$store.getters.getAccount,
                    'ledger_index': 'validated'
                }
                let res = await this.client.send(payload)
                console.log('accountInfo', res)
                this.$store.dispatch('setAccountData', res.account_data)

                const account_data = this.$store.getters.getAccountData
                console.log('getAccountData', account_data)
                const flags = flagNames(account_data.LedgerEntryType, account_data.Flags)
                console.log('flags', flags)

                // check if master key enabled.
                if (flags.includes('lsfDisableMaster')) {
                    this.masterKey = false
                    console.log('masterkey disabled')
                }
                else {
                    this.masterKey = true
                    console.log('masterkey enabled')
                }

                if ('RegularKey' in account_data) {
                    this.$store.dispatch('setRegularKey', account_data.RegularKey)
                }
                else {
                    this.$store.dispatch('setRegularKey', '')
                }

                const tokenData = this.$store.getters.getXummTokenData
                this.accountAccess = tokenData.accountaccess
                console.log('this.accountAccess', this.accountAccess)
            },
            async signerList(marker = undefined) {
                console.log('searching for signers...')
                this.$store.dispatch('clearSignerList')

                let found = false
                const payload = {
                    'id': 2,
                    'command': 'account_objects',
                    'account': this.$store.getters.getAccount,
                    'ledger_index': 'validated',
                    'limit': 400
                }
                if (marker != undefined) {
                    payload.marker = marker
                }
                let res = await this.client.send(payload)
                console.log('payload signers', res)
                for (let index = 0; index < res.account_objects.length; index++) {
                    const element = res.account_objects[index]
                    if (element.LedgerEntryType === 'SignerList') {
                        console.log('setSignerList element', element)
                        this.$store.dispatch('setSignerList', element)
                        found = true
                    }
                }
                if (res['marker'] !== undefined) {
                    return await this.checkSignerList(res['marker'])
                }

                if (found) {
                    // console.log('signerLists', this.$store.getters.getSignerLists)
                    const signer_lists = this.$store.getters.getSignerLists
                    for (let index = 0; index < signer_lists.length; index++) {
                        const element = signer_lists[index]
                        console.log('signer_list', element)    
                        console.log('flags', flagNames(element.LedgerEntryType, element.Flags))
                    }
                }

                console.log(`${found ? 'found':'no'} signers...`)
                return found
            },
        }
    }
</script>

<style lang="scss" scoped>
    .btn-primary {
        background-color: #9d2dff;
        border-color: #9d2dff;
    }

    h1 {
        text-align: center;
    }

    .mo-fire {
        width: 100px;
        height: auto;
        position: relative;
        left:50%;
        margin-left: -100px;
        margin-top: -150px;
    }
    .mo-fire svg {
        width: 100%;
        height: auto;
        position: relative;
    }
    .flame {
        animation-name: flamefly;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        opacity: 0;
        transform-origin: 50% 50% 0;
    }
    .flame.one {
        animation-delay: 1s;
        animation-duration: 3s;
    }
    .flame3.two{
        animation-duration: 5s;
        animation-delay: 1s;
    }

    .flame-main {
        animation-name: flameWobble;
        animation-duration: 3s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
    }
    .flame-main.one {
        animation-duration: 4s;
        animation-delay: 1s;
    }
    .flame-main.two {
        animation-duration: 3s;
        animation-delay: 2s;
    }
    .flame-main.three {
        animation-duration: 2.1s;
        animation-delay: 3s;
    }
    .flame-main.four {
        animation-duration: 3.2s;
        animation-delay: 4s;
    }
    .flame-main.five {
        animation-duration: 2.5s;
        animation-delay: 5s;
    }
    @keyframes flameWobble {
    50% {
        transform: scale(1,1.2) translate(0, -30px) rotate(-2deg);
    }
    }
    @keyframes flamefly {
        0%{
            transform: translate(0) rotate(180deg);
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: translate(-20px, -100px) rotate(180deg);
            opacity: 0;
        }
    }
</style>