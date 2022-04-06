<template>
    <header>
        <div class="card">
            <Button icon="pi pi-plus" @click="editBlock()" />
        </div>
    </header>

    <div class="list">
        <!-- wrapper -->
        <BlocksWrapper :blocks="blocks" @edit-block="(event) => editBlock(event)" />
    </div>

    <!-- <p style="margin-top: 200px">{{ blocks }}</p> -->

    <EditBlockModal
        :modalOptions="modal"
        :block="blockToEdit"
        @save="() => saveBlock()"
        @delete="() => deleteBlock()"
    />
    <Toast position="top-right" />
</template>

<script setup>
//my beatsaver profile https://api.beatsaver.com/maps/uploader/4284309/0
import { ref, reactive, watch } from 'vue' //ref for primitives, reactive for objects
import { db } from '../lib/db'
import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'
import BlocksWrapper from '../components/BlocksWrapper.vue'
import EditBlockModal from '../components/EditBlockModal.vue'
import { allBlocks } from '../components/blocks'

const modal = reactive({ visible: false })

const blockToEdit = reactive({ block: null, inputValues: {} })

const blocks = useObservable(liveQuery(() => db.blocks.toArray()))

const resetBlock = () => {
    blockToEdit.block = null
    blockToEdit.inputValues = {}
}

// Edit Modal
watch(
    () => modal.visible,
    (newval, oldval) => {
        if (newval === false) {
            Object.assign(blockToEdit, {})
        }
    },
)
const editBlock = (event = {}) => {
    Object.assign(blockToEdit, event)
    modal.visible = true
}
const saveBlock = () => {
    //cringe proxies
    let newBlock = {
        block: { ...blockToEdit.block },
        inputValues: { ...blockToEdit.inputValues },
    }
    if (blockToEdit.id) newBlock.id = blockToEdit.id
    db.blocks.put(newBlock)
    resetBlock()

    modal.visible = false
}
const deleteBlock = () => {
    db.blocks.delete(blockToEdit.id)
    resetBlock()
    modal.visible = false
}
//  <grid-layout
//         :value="layout"
//         :col-num="4"
//         :row-height="30"
//         :is-draggable="true"
//         :is-resizable="true"
//         :is-mirrored="false"
//         :vertical-compact="true"
//         :margin="[10, 10]"
//         :use-css-transforms="true"
//     >
//         <grid-item
//             v-for="item in layout"
//             :x="item.x"
//             :y="item.y"
//             :w="item.w"
//             :h="item.h"
//             :i="item.i"
//             :key="item.i"
//         >
//             {{ item.i }}
//         </grid-item>
//     </grid-layout>
// const layout = [
//     { x: 0, y: 0, w: 2, h: 2, i: '0' },
//     { x: 2, y: 0, w: 2, h: 4, i: '1' },
//     { x: 4, y: 0, w: 2, h: 5, i: '2' },
//     { x: 6, y: 0, w: 2, h: 3, i: '3' },
//     { x: 8, y: 0, w: 2, h: 3, i: '4' },
//     { x: 10, y: 0, w: 2, h: 3, i: '5' },
//     { x: 0, y: 5, w: 2, h: 5, i: '6' },
//     { x: 2, y: 5, w: 2, h: 5, i: '7' },
//     { x: 4, y: 5, w: 2, h: 5, i: '8' },
//     { x: 6, y: 3, w: 2, h: 4, i: '9' },
//     { x: 8, y: 4, w: 2, h: 4, i: '10' },
//     { x: 10, y: 4, w: 2, h: 4, i: '11' },
//     { x: 0, y: 10, w: 2, h: 5, i: '12' },
//     { x: 2, y: 10, w: 2, h: 5, i: '13' },
//     { x: 4, y: 8, w: 2, h: 4, i: '14' },
//     { x: 6, y: 8, w: 2, h: 4, i: '15' },
//     { x: 8, y: 10, w: 2, h: 5, i: '16' },
//     { x: 10, y: 4, w: 2, h: 2, i: '17' },
//     { x: 0, y: 9, w: 2, h: 3, i: '18' },
//     { x: 2, y: 6, w: 2, h: 2, i: '19' },
// ]
</script>
<style lang="scss"></style>
