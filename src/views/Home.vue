<template>
    <div class="home flex flex-col">
        <div class="flex mt-4 mx-4 p-3 rounded-md bg-slate-800 max-w-50 self-center">
            <b-button
                class="m-3"
                type="is-primary"
                icon-right="plus"
                size="is-medium"
                @click="addBlock"
            />
            <b-button
                class="m-3"
                type="is-primary"
                icon-right="export-variant"
                size="is-medium"
                @click="exportDb"
            />
            <b-button
                class="m-3"
                type="is-primary"
                icon-right="import"
                size="is-medium"
                @click="importDb"
            />
        </div>

        <BlocksWrapper :blocks="blocks" @update="loadBlocks()" />
        <!-- <EditBlockModal v-model="showEditModal" @update="loadBlocks()" /> -->
    </div>
</template>

<script>
import { db } from '../lib/db'
import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'
import EditBlockModal from '@/components/modals/EditBlockModal.vue'
// import is needed for db functions
import { importDB, exportDB, importInto, peakImportFile } from 'dexie-export-import'

export default {
    name: 'Home',
    data() {
        return {
            // cant use live query, it would loop the saves, can probably be throttled but this is fine for now. dont need livequeries
            blocks: [],
        }
    },
    async mounted() {
        this.loadBlocks()
        // this.$toast.open({
        //     duration: 5000,
        //     message: `danger toast test, Something's not good, also I'm on <b>bottom</b>`,
        //     position: 'is-bottom',
        //     type: 'is-danger',
        // })

        // hash redirects
        if (this.$route.hash) {
            window.location.href = this.$route.hash.replace('#', '?')
        }
        // twitch auth
        if (this.$route.query?.access_token) {
            // TODO move logic to lib/twitch.js
            localStorage.setItem(
                'twitchToken',
                `Bearer ${this.$route.query.access_token}`,
            )
            const twitchUserData = await this.axios.get(
                'https://api.twitch.tv/helix/users',
                {
                    headers: {
                        Authorization: localStorage.getItem('twitchToken'),
                        'Client-Id': 'vw28o8a3angs5e66bowr9zqqcji9dv',
                    },
                },
            )
            if (twitchUserData?.data?.data.length == 1) {
                localStorage.setItem(
                    'twitchUserData',
                    JSON.stringify(twitchUserData.data.data[0]),
                )
            }
            this.$router.replace('/')
            this.addBlock('twitchFeed')
        }
    },
    methods: {
        addBlock(prefire = null) {
            this.$buefy.modal.open({
                parent: this,
                component: EditBlockModal,
                hasModalCard: true,
                trapFocus: true,
                props: { prefire },
                events: {
                    close: () => {
                        console.log('close')
                        this.loadBlocks()
                    },
                },
            })
        },
        async loadBlocks() {
            console.log('load blocks')
            this.blocks = []
            this.blocks = await db.blocks.toArray()
            console.log(this.blocks)
        },
        async exportDb() {
            let dbBlob = await db.export()
            dbBlob = await dbBlob.text()
            console.log(dbBlob)
            navigator.clipboard.writeText(dbBlob)
            this.$buefy.dialog.alert({
                canCancel: true,
                title: 'DB Blob',
                message: 'copied to clipboard',
                confirmText: 'yay',
            })
        },
        importDb() {
            this.$buefy.dialog.prompt({
                message: `EVERYTHING WILL BE DELETED`,
                message: `Enter db blob:`,
                canCancel: true,
                onConfirm: async (json) => {
                    await db.import(new Blob([json]))
                    this.loadBlocks()
                },
            })
        },
    },
    watch: {},
}
</script>
