<template>
    <span>
        <p class="text-light">ledger: {{ $store.getters.getLedger }}</p>    
    </span>
</template>

<script>
    import { onBeforeUpdate, reactive, ref } from 'vue'

    export default {
        data() {
            return {
                isLoaded: false,
                client: null
            }
        },
        async mounted() {
            setTimeout(() => {
                this.currentLedger()
                this.isLoaded = true
            }, 1000)
        },
        methods: {
            currentLedger() {
                this.client =  this.$store.getters.getClient

                const callback = async (event) => {
                    let request = {
                        'id': 'xrpl-local',
                        'command': 'ledger',
                        'ledger_hash': event.ledger_hash,
                        'ledger_index': 'validated',
                        'transactions': true,
                        'expand': true,
                        'owner_funds': true
                    }
    
                    const ledger_result = await this.client.send(request)
                    if ('error' in ledger_result) {
                        console.log('XRPL error', ledger_result)
                    }
                    
                    if ('ledger' in ledger_result) {
                        
                        this.$store.dispatch('setLedger', ledger_result.ledger.ledger_index)
                        console.log('ledger', this.$store.getters.getLedger)
                    }
                }
                this.client.on('ledger', callback)
            }
        }
    }
</script>
