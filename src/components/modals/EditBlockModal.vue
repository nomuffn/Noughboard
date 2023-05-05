<template>
    <div class="editBlockModal modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">
                {{ block.id ? `Edit Block` : 'Add new block' }}
            </p>
        </header>
        <section class="modal-card-body">
            <b-dropdown v-model="block.type" aria-role="list">
                <template #trigger="{ active }" class="shadow">
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
                    >{{ block.name }}</b-dropdown-item
                >
            </b-dropdown>

            <template v-if="block.type">
                <div class="options mt-4">
                    <component
                        v-if="blockComponent"
                        :is="blockComponent"
                        :input="block.inputValues"
                        :edit="true"
                    />
                </div>
            </template>
        </section>
        <footer class="modal-card-foot">
            <b-button label="Archive" type="is-warning" v-if="block.id" />
            <b-button
                :label="deleteSure ? 'Sure?' : 'Delete'"
                type="is-danger"
                class="mr-auto"
                v-if="block.id"
                @click="deleteBlock()"
            />
            <b-button label="Import" />
            <b-button label="Export" />
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

export default {
    components: {
        ...components,
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
        blockComponent() {
            const blockCode = this.block?.type?.code
            return `${blockCode}Block`
        },
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
