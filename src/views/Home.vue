<template>
    <div v-if="selectedDashboard" class="home flex flex-col">
        <div class="flex self-center items-center">
            <Button
                icon="pi pi-angle-left"
                class="m-3 p-button-text"
                @click="selectDashboard(false)"
            />

            <Dropdown
                class="dashboard-selector"
                v-model="selectedDashboard"
                :options="dashboards"
                optionLabel="title"
            />

            <!-- <b-dropdown
                v-model="selectedDashboard"
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
                        <Button
                            class="ml-auto"
                            type="is-text"
                            icon-right="pencil"
                            @click.stop="editDashboard(false, index)"
                        />
                    </div>
                </b-dropdown-item>
                <div class="flex justify-center">
                    <Button
                        @click="editDashboard(true)"
                        type="is-text"
                        icon-right="plus"
                    />
                </div>
            </b-dropdown> -->

            <!-- <div class="flex items-center p-3 rounded-md bg-slate-700">
            </div> -->
            <Button
                icon="pi pi-angle-right"
                class="m-3 p-button-text"
                @click="selectDashboard()"
            />
        </div>
        <div class="buttons flex mt-3 mx-4 p-3 rounded-md max-w-50 self-center">
            <Button
                class="m-3"
                icon="pi pi-plus"
                @click="addBlock"
                :disabled="!this.blocks.length"
            />
            <Button class="m-3" icon="pi pi-file-export" @click="exportDb" />
            <Button class="m-3" icon="pi pi-file-import" @click="importDb" />
            <Button
                class="m-3"
                icon="pi pi-cog"
                @click="editDashboard()"
                :disabled="!this.blocks.length"
            />
            <Button
                class="m-3"
                icon="pi pi-plus"
                @click="editDashboard(true)"
                :disabled="!this.blocks.length"
            />
        </div>

        <div class="flex">
            <div
                class="tree flex flex-col"
                v-if="selectedDashboard.useTree && selectedDashboard.tree"
            >
                <Tree
                    :value="selectedDashboard.tree"
                    selectionMode="single"
                    :selectionKeys.sync="selectedTreeNode"
                    :expandedKeys="selectedDashboard.treeExpandedKeys"
                    @node-expand="saveDashboard"
                    @node-collapse="saveDashboard"
                    @node-select="saveDashboard"
                >
                    <template #default="slotProps">
                        <div
                            class="flex items-center"
                            :style="
                                slotProps.node.children == 0
                                    ? 'margin-left: -35px'
                                    : 'margin-left: -15px'
                            "
                        >
                            <b class="mr-2 mb-1">{{ slotProps.node.label }}</b>
                            <Button
                                class="ml-auto p-button-text p-button-secondary"
                                icon="pi pi-cog"
                                @click.stop="editTreeNode(slotProps.node)"
                            />
                        </div>
                    </template>
                </Tree>
                <Button
                    class="self-center p-button-text"
                    icon="pi pi-plus"
                    @click.stop="editTreeNode()"
                />
            </div>

            <div v-if="this.selectedDashboard.encrypt && !this.blocks.length">
                <InputText
                    :label="
                        selectedDashboard.initialEncrypt
                            ? 'Enter initial password to encrypt all blocks'
                            : 'Enter password to decrypt dashboard'
                    "
                    v-model="temporaryPassword"
                    @keyup.enter.native="loadDashboard"
                ></InputText>
            </div>
            <BlocksWrapper
                v-else
                class="flex-1"
                :dashboard="selectedDashboard"
                :blocks="blocks"
                @update="loadDashboard()"
                :decryptionPass="temporaryPassword"
            />
        </div>
    </div>
    <div v-else>
        <p>Something went wrong while loading a dashboard.</p>
        <p>Try CTRL F5</p>
        <p>If nothing works...</p>
        <Button label="reset and delete EVERYTHING? (on this site)" @click="reset" />
    </div>
</template>

<script>
import { db } from '../lib/db'
// import is needed for db functions: import {importDB, exportDB, importInto, peakImportFile} from "dexie-export-import";
import { importDB, exportDB, importInto, peakImportFile } from 'dexie-export-import'
import twitch from '@/lib/twitch'

import EditBlockModal from '@/components/modals/EditBlockModal.vue'
import EditDashboard from '@/components/modals/EditDashboard.vue'
import EditTreeNode from '@/components/modals/EditTreeNode.vue'

import defaultData from '@/lib/defaultData'

import { encrypt, decrypt } from '@/lib/encrypt'

export default {
    name: 'Home',
    data() {
        return {
            // cant use live query, it would loop the saves, can probably be throttled but this is fine for now. dont need livequeries
            blocks: [],
            dashboards: null,
            selectedDashboard: null,
            temporaryPassword: null,
        }
    },
    watch: {
        selectedDashboard(newval, oldval) {
            console.log('watch selectedDashboard')
            this.loadDashboard()
        },
        selectedTreeNode(newval, oldval) {
            console.log('watch selectedTreeNode')
            this.loadDashboard()
            this.saveDashboard() // for selectedTreeNode
        },
    },
    async created() {
        await import(`@/assets/themes/bootstrap4-dark-blue/theme.css`)
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
    computed: {
        dashboardIndex() {
            return this.selectedDashboard
                ? this.dashboards.findIndex(
                      (item) => item.id == this.selectedDashboard.id,
                  )
                : 0
        },
        selectedTreeNode: {
            get() {
                if (this.selectedDashboard?.useTree)
                    return (
                        this.selectedDashboard?.selectedTreeNode ||
                        this.selectedDashboard.tree[0].key
                    )
                return null
            },
            set(val) {
                this.selectedDashboard.selectedTreeNode = val
            },
        },
    },
    methods: {
        async saveDashboard() {
            console.log('saveDashboard')
            await db.dashboards.put(this.selectedDashboard)
        },
        editTreeNode(treeNode) {
            this.$buefy.modal.open({
                parent: this,
                component: EditTreeNode,
                hasModalCard: true,
                trapFocus: true,
                props: { treeNode },
                events: {
                    create: async (newNode) => {
                        if (treeNode) {
                            treeNode.children.push(newNode)
                        } else {
                            this.selectedDashboard.tree.push(newNode)
                        }
                        await this.saveDashboard()
                    },
                    update: async (newNode) => {
                        treeNode.label = newNode.label
                        await this.saveDashboard()
                    },
                },
            })
        },
        async loadDashboards() {
            this.dashboards = await db.dashboards.toArray()

            if (!this.dashboards.length) {
                await db.import(new Blob([defaultData]))
                return this.loadDashboards()
            }

            this.selectedDashboard = this.dashboards[this.dashboardIndex]
        },
        selectDashboard(forward = true) {
            const index = this.dashboardIndex
            let newIndex = index + (forward ? 1 : -1)
            if (newIndex >= this.dashboards.length) newIndex = 0
            else if (newIndex < 0) newIndex = this.dashboards.length - 1

            this.selectedDashboard = this.dashboards[newIndex]
        },
        async editDashboard(neww = false, index = this.dashboardIndex) {
            this.$buefy.modal.open({
                parent: this,
                component: EditDashboard,
                hasModalCard: true,
                trapFocus: true,
                props: {
                    dashboard: neww ? {} : { ...this.dashboards[index] },
                    decryptionPass: this.temporaryPassword,
                },
                events: {
                    close: async () => {
                        await this.loadDashboards()
                        if (neww || this.selectedDashboard >= this.dashboards.length) {
                            this.selectedDashboard =
                                this.dashboards[this.dashboards.length - 1]
                        } else {
                            this.selectedDashboard = this.dashboards[this.dashboardIndex]
                        }
                    },
                    decrypt: () => {
                        this.temporaryPassword = null
                        this.loadDashboard()
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
                props: {
                    prefire,
                    dashboardId: this.selectedDashboard.id,
                    treeNodeKey: this.selectedDashboard.useTree
                        ? Object.keys(this.selectedTreeNode)[0]
                        : null,
                },
                events: {
                    close: () => {
                        this.loadDashboard()
                    },
                },
            })
        },
        async loadDashboard(switched = false) {
            console.log('loadDashboard')
            // ? might loop with watcher
            // ? redundant? this.selectedDashboard = this.dashboards[this.dashboardIndex]

            if (this.selectedDashboard.useTree) {
                if (!this.selectedDashboard.tree) {
                    await db.dashboards.put({
                        ...this.selectedDashboard,
                        treeExpandedKeys: {},
                        tree: [
                            {
                                key: 'start',
                                label: 'Start',
                                children: [],
                            },
                        ],
                    })
                    return await this.loadDashboards()
                }
            }

            this.blocks = [] // dont reuse components
            let blocks = await db.blocks.filter(
                (block) => block.dashboard == this.selectedDashboard.id,
            )

            if (this.selectedDashboard.useTree) {
                const firstTreeNodeKey = this.selectedDashboard.tree[0].key

                if (!this.selectedTreeNode || switched) {
                    this.selectedTreeNode = { [firstTreeNodeKey]: true }
                }

                const selectedTreeNodeKey = Object.keys(this.selectedTreeNode)[0]
                blocks = blocks.filter((block) => {
                    return (
                        block.treeNode == selectedTreeNodeKey ||
                        (firstTreeNodeKey == selectedTreeNodeKey
                            ? !block.treeNode
                            : false)
                    )
                })
            }

            blocks = await blocks.toArray()

            // encryption enabled
            // TODO clean this up please at some point :)
            if (this.selectedDashboard.encrypt) {
                // initial encrypt, encrypt all blocks inputValues; include treenodes
                if (this.selectedDashboard.initialEncrypt && this.temporaryPassword) {
                    blocks = await db.blocks
                        .filter((block) => block.dashboard == this.selectedDashboard.id)
                        .toArray()

                    await blocks
                        .filter((block) => {
                            return block.inputValues instanceof Object
                        })
                        .forEach(async (block) => {
                            block.inputValues = encrypt(
                                block.inputValues,
                                this.temporaryPassword,
                            )
                            await db.blocks.put(block)
                        })
                    this.selectedDashboard.initialEncrypt = false
                    return this.loadDashboard()
                } else {
                    const unencryptedBlocks = blocks.filter((block) => {
                        return block.inputValues instanceof Object
                    })
                    if (unencryptedBlocks.length == blocks.length) {
                        // all objects are unencrypted, start it again with initialEncrypt
                        this.selectedDashboard.initialEncrypt = true
                        return
                    }
                    if (unencryptedBlocks.length > 0 && this.temporaryPassword) {
                        // encrypt remaining or new blocks
                        blocks
                            .filter((block) => block.inputValues instanceof Object)
                            .forEach(async (block) => {
                                await db.blocks.put({
                                    ...block,
                                    inputValues: encrypt(
                                        block.inputValues,
                                        this.temporaryPassword,
                                    ),
                                })
                            })
                        return this.loadDashboard()
                    }
                }

                if (!this.temporaryPassword) {
                    return
                }

                try {
                    blocks.forEach((block) => {
                        decrypt(block.inputValues, this.temporaryPassword)
                    })
                } catch (e) {
                    this.temporaryPassword = null
                    return this.$toast.open({
                        message: 'wrong password :p',
                        type: 'is-danger',
                    })
                }
            }

            this.blocks = blocks
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
                    this.loadDashboards()
                },
                cancelText: 'pls dont',
                confirmText: 'YES DELETE AND REPLACE EVERYTHING!!!',
            })
        },
        async reset() {
            await db.tables.forEach(async (table) => {
                await table.clear()
            })
            await db.import(new Blob([defaultData]))
            window.history.go()
        },
    },
}
</script>
<style lang="scss">
// @import '@/assets/themes/bootstrap4-dark-blue/theme.css';

@import 'primevue/resources/primevue.min.css';
@import 'primeicons/primeicons.css';

.buttons {
    background-color: var(--surface-a);
}

.dropdown-menu {
    min-width: 0 !important;
}

.p-tree {
    border: none;
    padding: 0;
}
.tree {
    margin-right: 20px;
}
.dashboard-selector.p-dropdown {
    .p-dropdown-label.p-inputtext {
        font-size: 1.5rem;
        font-weight: bold;
    }
}

.p-tree.p-component {
    padding: 0;
    border: none;
    background: none;
    // .p-treenode-content {
    //     padding-right: 30px !important;
    // }

    .p-treenode-label {
        width: 100%;
    }
}
</style>
