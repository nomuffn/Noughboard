<template>
    <Dialog
        v-model:visible="props.modalOptions.visible"
        :dismissableMask="true"
        :style="{ maxWidth: '90vw' }"
        :modal="true"
        :closable="true"
        :draggable="false"
        class="editBlockModal"
    >
        <template #header>
            <h3>Add/Edit block</h3>
        </template>

        <h4>Block</h4>
        <Dropdown
            v-model="block.block"
            :options="allBlocks"
            optionLabel="name"
            placeholder="Select a block"
        />

        <template v-if="block.block">
            <h4>Options</h4>
            <div class="options">
                <component
                    v-if="vueBlock"
                    :is="vueBlock"
                    :input="block.inputValues"
                    :edit="true"
                />
            </div>
        </template>

        <template #footer>
            <Button
                v-if="block.id"
                :label="deleteCounter == 0 ? 'Delete' : 'Really?'"
                icon="pi pi-trash"
                class="p-button-danger flex-start"
                @click="deleteBlock()"
            />
            <Button
                label="Discard"
                icon="pi pi-times"
                class="p-button-text"
                @click="props.modalOptions.visible = false"
            />
            <Button
                label="Save"
                icon="pi pi-check"
                :disabled="showAdd != true"
                @click="$emit('save')"
            />
        </template>
    </Dialog>
</template>

<script setup>
import {
    ref,
    reactive,
    watch,
    toRef,
    shallowRef,
    computed,
    defineAsyncComponent,
} from 'vue' //ref for primitives, reactive for objects
import { db } from '../lib/db'
import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'
import { allBlocks } from './blocks'

const emits = defineEmits(['save', 'delete'])
const props = defineProps({
    modalOptions: Object,
    block: Object,
})

const vueBlock = shallowRef()

const blocks = useObservable(liveQuery(() => db.blocks.toArray()))

const showAdd = computed(() => {
    const keys = Object.keys(props.block.inputValues)
    const values = Object.values(props.block.inputValues)
    if (!keys.length) return false
    if (values.some((value) => !value || !value.length)) return false
    return true
})

let deleteCounter = ref(0)
const deleteBlock = () => {
    if (deleteCounter.value == 0) {
        deleteCounter.value++
    } else {
        this.$emit('delete')
        deleteCounter.value = 0
    }
}

watch(
    () => props.block.block,
    (newval, oldval) => {
        if (!newval) return
        const blockCode = props.block.block.code
        vueBlock.value = defineAsyncComponent(() =>
            import(`../components/blocks/${blockCode}Block.vue`),
        )
    },
)
</script>

<style lang="scss">
.editBlockModal {
    h4 {
        font-weight: bold;
        margin-bottom: 10px;
    }
    .p-dialog-content > * {
        margin-bottom: 10px;
    }
    .options > * {
        margin-bottom: 10px;
    }
}
</style>
