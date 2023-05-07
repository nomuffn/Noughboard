<template>
    <div class="editBlockModal modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">
                {{ block.id ? `Edit Block` : 'Add new block' }}
            </p>
        </header>
        <section class="modal-card-body">
            <b-field label="Block type">
                <b-dropdown
                    v-model="block.type"
                    aria-role="list"
                    :scrollable="true"
                    :max-height="500"
                >
                    <template #trigger="{ active }">
                        <b-button
                            :label="block.type.name"
                            type="is-primary"
                            :icon-right="active ? 'menu-up' : 'menu-down'"
                        />
                    </template>

                    <b-dropdown-item
                        v-for="block in allBlocks"
                        :key="block.code"
                        :value="block"
                        aria-role="listitem"
                        :disabled="block.name.includes('WIP')"
                        >{{ block.name }}</b-dropdown-item
                    >
                </b-dropdown>
            </b-field>

            <template v-if="block.type">
                <b-field label="Block content">
                    <BasicBlock
                        class="mt-4"
                        :block="block"
                        :edit="true"
                        @submit="saveBlock"
                    />
                </b-field>
            </template>
        </section>
        <footer class="modal-card-foot">
            <b-button disabled label="Archive" type="is-warning" v-if="block.id" />
            <b-button
                :label="deleteSure ? 'Sure?' : 'Delete'"
                type="is-danger"
                class="mr-auto"
                v-if="block.id"
                @click="deleteBlock()"
            />
            <b-button disabled label="Import" />
            <b-button disabled label="Export" />
            <b-button label="Close" @click="$emit('close')" />
            <b-button
                label="Save"
                @click="saveBlock()"
                :disabled="submitDisabled"
                type="is-primary"
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
    props: ['value', 'item', 'prefire', 'dashboardId'],
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
            await db.blocks.put(block).then(async (id) => {
                block.i = block.id
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
    .modal-card-foot {
        justify-content: flex-end;
    }
}
</style>
