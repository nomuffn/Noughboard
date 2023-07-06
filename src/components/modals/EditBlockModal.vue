<template>
    <div class="editBlockModal modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">
                {{ block.id ? `Edit Block` : 'Add new block' }}
            </p>
        </header>
        <section class="modal-card-body">

            <Dropdown
                v-model="block.type"
                :options="allBlocks"
                optionLabel="name"
            />

            <template v-if="block.type">
                <BasicBlock
                    class="mt-4"
                    :block="block"
                    :edit="true"
                    @submit="saveBlock"
                    :decryptionPass="decryptionPass"
                />
            </template>
        </section>
        <footer class="modal-card-foot justify-end">
            <Button
                v-if="block.id"
                label="Archive"
                class="p-button-warning"
                disabled
            />
            <Button
                v-if="block.id"
                :label="deleteSure ? 'Sure?' : 'Delete'"
                class="p-button-danger mx-2 mr-auto"
                @click="deleteBlock()"
            />

            <!-- TODO 
            <Button disabled label="Import" />
            <Button disabled label="Export" />
            <Button disabled label="Copy" />
            <Button disabled label="Move" />
             -->

            <Button
                label="Close"
                class="mx-2 ml-auto p-button-secondary"
                @click="$emit('close')"
            />
            <Button
                label="Save"
                @click="saveBlock()"
                :disabled="submitDisabled"
            />
        </footer>
    </div>
</template>

<script>
import { db } from '@/lib/db'
import { allBlocks, getDefaultBlock, components } from '@/components/blocks'
import BasicBlock from '@/components/blocks/BasicBlock.vue'

export default {
    components: {
        ...components,
        BasicBlock,
    },
    props: ['value', 'item', 'prefire', 'dashboardId', 'treeNodeKey', 'decryptionPass'],
    data() {
        return {
            allBlocks: allBlocks,
            block: getDefaultBlock(),
            deleteSure: false,
        }
    },
    created() {
        // reset block
        if (this.item) this.block = structuredClone(this.item)
    },
    mounted() {
        console.log(this)
        if (this.prefire) {
            this.block.type =
                allBlocks.find((item) => item.code == this.prefire) || this.block.type
        }
        this.block.dashboard = this.dashboardId || 0 // id of dashboard, first one should always be 0, make sure its undeletable
    },
    methods: {
        async saveBlock() {
            let block = this.block

            // temporary variable to do an action before the block gets updated. Such as deleting running intervals from lambdas
            // if (block.inputValues.beforeUpdate)
            //     block.inputValues.beforeUpdate() && delete block.inputValues.beforeUpdate

            if (!block.id) {
                const colNum = parseInt(localStorage.getItem('colNum'))
                const length = await db.blocks.count()
                block = {
                    ...this.block,
                    x: (length * 2) % (colNum || 12),
                    y: length + (colNum || 12),
                    w: 4,
                    h: 4,
                    i: length + 1,
                }
            }
            if (this.treeNodeKey) {
                block.treeNode = this.treeNodeKey
            }

            // extract into extra file with save & load logic. For encryption
            await db.blocks.put(block).then(async (id) => {
                block.i = block.id
                console.log("saving block", block)
                await db.blocks.put(block)
            })
            this.$emit('close')
        },
        async deleteBlock() {
            if (!this.deleteSure) return (this.deleteSure = true)

            await db.blocks.delete(this.block.id)
            this.$emit('close')
            this.deleteSure = false
        },
    },
    computed: {
        submitDisabled() {
            return !this.block.type
        },
    },
}
</script>

<style lang="scss">
.editBlockModal {
    .modal-card-body {
        min-height: 25vh;
        min-width: 50vh;
        height: auto;
    }
}
</style>
