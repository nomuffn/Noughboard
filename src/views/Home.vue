<template>
    <header>
        <div class="card">
            <Button icon="pi pi-plus" @click="addBlock()" />
        </div>
    </header>

    <BlocksWrapper
        v-if="data.blocks && data.blocks.length"
        :blocks="data.blocks"
        @edit-block="(e) => editBlock(e)"
    />

    <EditBlockModal
        :modalOptions="modal"
        :block="data.blockToEdit"
        @save="(b) => saveBlock(b)"
        @delete="(b) => deleteBlock(b)"
    />
    <Toast position="top-right" />
</template>

<script setup>
//my beatsaver profile https://api.beatsaver.com/maps/uploader/4284309/0
import { ref, reactive, watch, nextTick, onMounted } from 'vue' //ref for primitives, reactive for objects
import { db } from '../lib/db'
import { liveQuery, Dexie } from 'dexie'
import { useObservable } from '@vueuse/rxjs'
import BlocksWrapper from '../components/BlocksWrapper.vue'
import EditBlockModal from '../components/EditBlockModal.vue'
import { allBlocks } from '../components/blocks'

const data = reactive({
    blocks: [],
    blockToEdit: null,
})

const modal = reactive({ visible: false })

const loadBlocks = async () => {
    data.blocks = await db.blocks.toArray()
}

onMounted(() => {
    loadBlocks()
})

// Edit Modal
watch(
    () => modal.visible,
    (newval, oldval) => {
        if (newval === false) {
            data.blockToEdit = null
        }
    },
)
const addBlock = () => {
    modal.visible = true
}
const editBlock = (event) => {
    data.blockToEdit = event
    console.log(event)
    console.log(data.blockToEdit)
    nextTick(() => {
        modal.visible = true
    })
}
const saveBlock = async (block) => {
    const lastBlock = data.blocks[data.blocks.length - 1]

    block = Dexie.deepClone(block)
    console.log(block)
    if (!block.id) {
        if (lastBlock) {
            if (lastBlock.x < 8) {
                block.x = lastBlock.x + 2
                block.y = lastBlock.y
            } else {
                block.x = 0
                block.y = lastBlock.y + 5
            }
        } else {
            block.x = 0
            block.y = 0
        }
        block.w = 2
        block.h = 2
        block.i = JSON.stringify(block)
    }
    db.blocks.put(block)
    data.blockToEdit = null
    modal.visible = false
    loadBlocks()
}
const deleteBlock = (block) => {
    db.blocks.delete(block.id)
    modal.visible = false
}
</script>
<style lang="scss"></style>
