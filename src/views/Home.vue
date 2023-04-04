<template>
    <div class="home flex flex-col">
        <div class="flex mt-4 mx-4 p-5 rounded-md bg-slate-800">
            <b-button
                class="mr-5"
                type="is-primary"
                icon-right="plus"
                size="is-medium"
                @click="addBlock"
            />
            <b-button
                class="mr-5"
                type="is-primary"
                icon-right="export-variant"
                size="is-medium"
                @click="exportDb"
            />
            <b-button
                class="mr-5"
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
    mounted() {
        this.loadBlocks()
        // this.$toast.open({
        //     duration: 5000,
        //     message: `danger toast test, Something's not good, also I'm on <b>bottom</b>`,
        //     position: 'is-bottom',
        //     type: 'is-danger',
        // })
    },
    methods: {
        addBlock() {
            this.$buefy.modal.open({
                parent: this,
                component: EditBlockModal,
                hasModalCard: true,
                trapFocus: true,
                props: { test: true, test2: () => console.log('yay') },
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
            dbBlob = JSON.parse(await dbBlob.text())
            this.$buefy.dialog.alert({
                canCancel: true,
                title: 'DB Blob',
                message: dbBlob,
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
