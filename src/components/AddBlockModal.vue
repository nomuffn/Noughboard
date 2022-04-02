<template>
    <Dialog
        v-model:visible="props.modalOptions.visible"
        :dismissableMask="true"
        :style="{ width: '50vw' }"
        :modal="true"
        :closable="true"
        :draggable="false"
    >
        <template #header>
            <h3>Add block</h3>
        </template>

        <Dropdown
            v-model="selectedOption"
            :options="options"
            optionLabel="name"
            placeholder="Select a block"
        />
        <CodeEditor theme="" class="github_dark"></CodeEditor>

        <div v-if="selectedOption != ''"></div>

        <template #footer>
            <Button label="Discard" icon="pi pi-times" class="p-button-text" />
            <Button label="Add" icon="pi pi-check" :disabled="true" />
        </template>
    </Dialog>
</template>

<script setup>
//my beatsaver profile https://api.beatsaver.com/maps/uploader/4284309/0
import { ref, reactive, watch, toRef } from 'vue' //ref for primitives, reactive for objects
import { db } from '../lib/db'
import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'
import BlockComponent from '../components/BlockComponent.vue'
import { options as blockOptions } from '../components/blocks'
import CodeEditor from 'simple-code-editor'

const props = defineProps({
    modalOptions: Object,
})

const selectedOption = ref('')
const options = blockOptions

const blocks = useObservable(liveQuery(() => db.blocks.toArray()))

watch(selectedOption, (newval, oldval) => {})
</script>

<style lang="scss"></style>
