<template>
    <div class="card">
        <Button icon="pi pi-plus" @click="modal.visible = true" />
    </div>

    <div class="list">
        <BlockComponent v-for="block in blocks" :key="block.id" :value="block" />
    </div>

    <p>{{ blocks }}</p>

    <AddBlockModal :modalOptions="modal" />
</template>

<script setup>
//my beatsaver profile https://api.beatsaver.com/maps/uploader/4284309/0
import { ref, reactive } from 'vue' //ref for primitives, reactive for objects
import { db } from '../lib/db'
import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'
import BlockComponent from '../components/BlockComponent.vue'
import AddBlockModal from '../components/AddBlockModal.vue'
import { options as blockOptions } from '../components/blocks'

const modal = reactive({ visible: false })

const blocks = useObservable(liveQuery(() => db.blocks.toArray()))

console.log(blockOptions)
</script>

<style lang="scss"></style>
