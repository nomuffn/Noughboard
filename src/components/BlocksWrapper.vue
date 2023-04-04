<template>
    <grid-layout
        :layout.sync="blocks"
        :col-num="colNum"
        :row-height="30"
        :is-draggable="true"
        :is-resizable="true"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
        @layout-updated="layoutUpdatedEvent"
    >
        <grid-item
            v-for="item in blocks"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            :key="item.i"
        >
            <div
                class="bg-slate-800 rounded-md h-full w-full p-4 overflow-auto"
                @contextmenu.prevent="() => editBlock(item)"
            >
                <BasicBlock :block="item" />
            </div>
        </grid-item>
    </grid-layout>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import { db } from '@/lib/db'
import BasicBlock from '@/components/blocks/BasicBlock.vue'
import EditBlockModal from '@/components/modals/EditBlockModal.vue'

export default {
    components: {
        GridLayout: VueGridLayout.GridLayout,
        GridItem: VueGridLayout.GridItem,
        BasicBlock,
    },
    props: {
        blocks: {
            required: true,
            type: Array,
        },
    },
    created() {
        if (!localStorage.getItem('colNum')) {
            localStorage.setItem('colNum', 20)
        }

        this.colNum = parseInt(localStorage.getItem('colNum'))
    },
    data() {
        return {
            colNum: 20,
        }
    },
    methods: {
        layoutUpdatedEvent() {
            console.log('save')
            db.blocks.bulkPut(this.blocks)
        },
        editBlock(item) {
            this.$buefy.modal.open({
                parent: this,
                component: EditBlockModal,
                hasModalCard: true,
                trapFocus: true,
                props: { item },
                events: {
                    close: () => {
                        this.$emit('update')
                    },
                },
            })
        },
    },
}
</script>

<style lang="scss">
.vue-grid-layout {
    margin: 0px 5px;
}
.vue-grid-item {
    touch-action: none;
}
.vue-resizable-handle {
    background: none !important;
    border: solid grey;
    border-width: 0 2px 2px 0;
    display: inline-block;
    margin: 5px;
    width: 10px !important;
    height: 10px !important;
    border-radius: 1px;
}
</style>
