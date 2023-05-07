<template>
    <div v-if="dashboard" class="home flex flex-col">
        <div class="flex self-center items-center">
            <b-button
                class="m-3"
                type="is-text"
                icon-right="arrow-left"
                :disabled="currentDashboard <= 0"
                @click="currentDashboard--"
            />
            <b-dropdown
                v-model="currentDashboard"
                :triggers="['hover']"
                :scrollable="true"
                :max-height="250"
                aria-role="list"
            >
                <template #trigger>
                    <div class="flex items-center py-3 px-5 rounded-md bg-slate-700">
                        <p class="mr-4 text-2xl font-bold">{{ dashboard.title }}</p>
                        <b-icon icon="menu-down"> </b-icon>
                    </div>
                </template>

                <b-dropdown-item
                    v-for="(item, index) in dashboards"
                    :key="index"
                    :value="index"
                    aria-role="listitem"
                    style="padding-right: 10px"
                >
                    <div class="flex items-center">
                        <b-icon :icon="item.icon || 'home'"></b-icon>
                        <p class="mx-4 text-lg font-bold">{{ item.title }}</p>
                        <b-button
                            class="ml-auto"
                            type="is-text"
                            icon-right="pencil"
                            @click.stop="editDashboard(false, index)"
                        />
                    </div>
                </b-dropdown-item>
                <div class="flex justify-center">
                    <b-button
                        @click="editDashboard(true)"
                        type="is-text"
                        icon-right="plus"
                    />
                </div>
            </b-dropdown>
            <!-- <div class="flex items-center p-3 rounded-md bg-slate-700">
            </div> -->
            <b-button
                class="m-3"
                type="is-text"
                icon-right="arrow-right"
                :disabled="currentDashboard >= dashboards.length - 1"
                @click="currentDashboard++"
            />
        </div>
        <div class="flex mt-3 mx-4 p-3 rounded-md bg-slate-800 max-w-50 self-center">
            <b-tooltip label="Add block" type="is-dark">
                <b-button
                    class="m-3"
                    type="is-primary"
                    icon-right="plus"
                    size="is-medium"
                    @click="addBlock"
                />
            </b-tooltip>

            <b-tooltip label="Export all data" type="is-dark">
                <b-button
                    class="m-3"
                    type="is-primary"
                    icon-right="export-variant"
                    size="is-medium"
                    @click="exportDb"
                />
            </b-tooltip>

            <b-tooltip label="Import all data" type="is-dark">
                <b-button
                    class="m-3"
                    type="is-primary"
                    icon-right="import"
                    size="is-medium"
                    @click="importDb"
                />
            </b-tooltip>
        </div>

        <BlocksWrapper :dashboard="dashboard" :blocks="blocks" @update="loadBlocks()" />
        <!-- <EditBlockModal v-model="showEditModal" @update="loadBlocks()" /> -->
    </div>
    <div v-else>Something went wrong while loading a dashboard</div>
</template>

<script>
import { db } from '../lib/db'
// import is needed for db functions: import {importDB, exportDB, importInto, peakImportFile} from "dexie-export-import";
import { importDB, exportDB, importInto, peakImportFile } from 'dexie-export-import'
import twitch from '@/lib/twitch'

import EditBlockModal from '@/components/modals/EditBlockModal.vue'
import EditDashboard from '@/components/modals/EditDashboard.vue'

import defaultData from '@/lib/defaultData'

export default {
    name: 'Home',
    data() {
        return {
            // cant use live query, it would loop the saves, can probably be throttled but this is fine for now. dont need livequeries
            blocks: [],
            dashboards: null,
            currentDashboard: 0,
            currentMenu: null,
        }
    },
    computed: {
        dashboard() {
            if (!this.dashboards?.length) return null
            return this.dashboards[this.currentDashboard]
        },
    },
    watch: {
        dashboard(newval, oldval) {
            this.loadBlocks()
        },
    },
    async mounted() {
        await this.loadDashboards()
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
        async loadDashboards() {
            this.dashboards = await db.dashboards.toArray()

            if (!this.dashboards.length) {
                await db.import(new Blob([defaultData]))
                return this.loadDashboards()
            }
        },
        async editDashboard(neww = false, index = this.currentDashboard) {
            this.$buefy.modal.open({
                parent: this,
                component: EditDashboard,
                hasModalCard: true,
                trapFocus: true,
                props: { dashboard: neww ? {} : { ...this.dashboards[index] } },
                events: {
                    close: async () => {
                        await this.loadDashboards()
                        if (neww || this.currentDashboard >= this.dashboards.length) {
                            this.currentDashboard = this.dashboards.length - 1
                        }
                    },
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
                        this.loadBlocks()
                    },
                },
            })
        },
        async loadBlocks() {
            console.log('loadblocks')
            this.blocks = [] // dont reuse components
            this.blocks = await db.blocks
                .filter((block) => block.dashboard == this.dashboard.id)
                .toArray()
        },
        async exportDb() {
            let dbBlob = await db.export()
            dbBlob = await dbBlob.text()
            console.log(dbBlob)
            navigator.clipboard.writeText(dbBlob)
            this.$buefy.dialog.alert({
                canCancel: true,
                title: 'Data Export',
                message: 'Copied to your clipboard in JSON format',
                confirmText: 'jupijej',
                canCancel: ['escape', 'outside'],
            })
        },
        importDb() {
            this.$buefy.dialog.prompt({
                title: `EVERYTHING WILL BE DELETED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`,
                message: `Enter json from export:`,
                canCancel: true,
                onConfirm: async (json) => {
                    await db.tables.forEach(async (table) => {
                        await table.clear()
                    })
                    await db.import(new Blob([json]))
                    this.loadBlocks()
                },
                cancelText: 'pls dont',
                confirmText: 'YES DELETE AND REPLACE EVERYTHING!!!',
            })
        },
    },
}
</script>
<style lang="scss" scoped>
.dropdown-menu {
    min-width: 0 !important;
}
</style>
