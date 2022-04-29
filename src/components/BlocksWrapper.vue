<template>
    <grid-layout
        v-model:layout="blocks"
        ref="gridlayout"
        :col-num="10"
        :row-height="30"
        :margin="[10, 10]"
        :use-css-transforms="true"
        :vertical-compact="false"
        :is-draggable="true"
        :is-resizable="true"
        @layout-updated="(i) => layoutUpdatedEvent()"
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
                class="card"
                :key="item.id"
                @contextmenu.prevent="$emit('editBlock', item)"
            >
                <BasicBlock :block="item" />
            </div>
        </grid-item>
    </grid-layout>
</template>

<script setup>
import { ref, reactive, defineAsyncComponent } from 'vue' //ref for primitives, reactive for objects
import BasicBlock from './blocks/BasicBlock.vue'
import { db } from '../lib/db'
import Dexie from 'dexie'
import { throttle } from 'lodash'
import { useToast } from 'primevue/usetoast'

defineEmits(['editBlock'])
const props = defineProps({
    blocks: Array,
})
const toast = useToast()

const layoutUpdatedEvent = throttle(() => {
    console.log('save')
    db.blocks.bulkPut(Dexie.deepClone(props.blocks))
    // toast.add({
    //     severity: 'info',
    //     summary: 'Saving...',
    //     life: 2000,
    // })
}, 1000 * 1)

const layout = reactive([
    { x: 0, y: 0, w: 2, h: 2, i: '0' },
    { x: 2, y: 0, w: 2, h: 4, i: '1' },
    { x: 4, y: 0, w: 2, h: 5, i: '2' },
    { x: 6, y: 0, w: 2, h: 3, i: '3' },
    { x: 8, y: 0, w: 2, h: 3, i: '4' },
])
</script>

<style lang="scss">
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
