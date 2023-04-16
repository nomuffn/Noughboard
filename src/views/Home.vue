<template>
    <div v-if="dashboard" class="home flex flex-col">
        <div class="flex self-center items-center">
            <b-button
                class="m-3"
                type="is-text"
                icon-right="arrow-left"
                @click="loadDashboard(-1)"
            />
            <p>{{ dashboard.title }}</p>
            <b-button type="is-text" icon-right="pencil" @click="editDashboard()" />
            <b-button
                class="m-3"
                type="is-text"
                icon-right="plus"
                @click="editDashboard(true)"
            />
            <b-button
                class="m-3"
                type="is-text"
                icon-right="arrow-right"
                @click="loadDashboard(1)"
            />
        </div>
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

        <BlocksWrapper
            :dashboardId="dashboard.id"
            :blocks="blocks"
            @update="loadBlocks()"
        />
        <!-- <EditBlockModal v-model="showEditModal" @update="loadBlocks()" /> -->
    </div>
    <div v-else>Something went wrong while loading a dashboard</div>
</template>

<script>
import { db } from '../lib/db'
import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'
import EditBlockModal from '@/components/modals/EditBlockModal.vue'
// import is needed for db functions
import { importDB, exportDB, importInto, peakImportFile } from 'dexie-export-import'
import twitch from '@/lib/twitch'

export default {
    name: 'Home',
    data() {
        return {
            // cant use live query, it would loop the saves, can probably be throttled but this is fine for now. dont need livequeries
            blocks: [],
            dashboard: null,
        }
    },
    async mounted() {
        await this.loadDashboard()
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

        twitch.handleToken()
    },
    methods: {
        async loadDashboard(indexAdd = 0) {
            const dashboards = await db.dashboards.toArray()

            if (!dashboards.length) {
                await db.dashboards.add({ title: 'Home' })
                return this.loadDashboard()
            }

            if (indexAdd == 0) {
                this.dashboard = dashboards[0]
            } else {
                const index =
                    indexAdd + dashboards.map((i) => i.id).indexOf(this.dashboard.id)
                this.dashboard = dashboards[index]
            }
            this.loadBlocks()
        },
        async editDashboard(neww = false) {
            this.$buefy.dialog.prompt({
                message: `Dashboard title`,
                inputAttrs: {
                    value: neww ? '' : this.dashboard.title,
                    maxlength: 15,
                },
                trapFocus: true,
                onConfirm: async (title) => {
                    if (neww) {
                        await db.dashboards.add({ title })
                        this.loadDashboard((await db.dashboards.count()) - 1)
                    } else {
                        await db.dashboards.put({ ...this.dashboard, title })
                        this.dashboard = { ...this.dashboard, title }
                        this.loadDashboard(0)
                    }
                },
            })
        },
        addBlock(prefire = null) {
            this.$buefy.modal.open({
                parent: this,
                component: EditBlockModal,
                hasModalCard: true,
                trapFocus: true,
                props: { prefire, dashboardId: this.dashboard.id },
                events: {
                    close: () => {
                        console.log('close')
                        this.loadBlocks()
                    },
                },
            })
        },
        async loadBlocks() {
            this.blocks = [] // dont reuse components
            console.log(this.dashboard)
            this.blocks = await db.blocks
                .filter((block) => block.dashboard == this.dashboard.id)
                .toArray()

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
