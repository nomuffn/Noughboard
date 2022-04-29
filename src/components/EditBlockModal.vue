<template>
    <Dialog
        v-model:visible="props.modalOptions.visible"
        :dismissableMask="true"
        :style="{ maxWidth: '800px', width: '100%' }"
        :modal="true"
        :closable="false"
        :draggable="false"
        class="editBlockModal"
    >
        <template #header>
            <h3>Add/Edit block</h3>
        </template>

        <h4>Block</h4>
        <Dropdown
            v-model="data.block.block"
            :options="allBlocks"
            optionLabel="name"
            placeholder="Select a block"
        />

        <template v-if="data.block.block">
            <div class="options">
                <component
                    v-if="vueBlock"
                    :is="vueBlock"
                    :input="data.block.inputValues"
                    :edit="true"
                />
            </div>
        </template>

        <template #footer>
            <Button
                v-if="data.block.id"
                :label="deleteCounter == 0 ? 'Delete' : 'Really?'"
                icon="pi pi-trash"
                class="delet p-button-danger flex-start"
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
                @click="$emit('save', data.block)"
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
    onMounted,
} from 'vue' //ref for primitives, reactive for objects
import { db } from '../lib/db'
import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'
import { allBlocks } from './blocks'

const emit = defineEmits(['save', 'delete'])
const props = defineProps({
    modalOptions: Object,
    block: Object,
})

const data = reactive({ block: { block: allBlocks[0], inputValues: {} } })

const deleteCounter = ref(false)
const vueBlock = shallowRef()
const blocks = useObservable(liveQuery(() => db.blocks.toArray()))

const showAdd = computed(() => {
    if (!data.block.inputValues) return false
    const keys = Object.keys(data.block.inputValues)
    const values = Object.values(data.block.inputValues)
    if (!keys.length) return false
    return true
})

const deleteBlock = () => {
    if (!deleteCounter.value) {
        deleteCounter.value = true
    } else {
        emit('delete', data.block)
        deleteCounter.value = false
    }
}

const loadBLock = () => {
    const blockCode = data.block.block.code
    vueBlock.value = defineAsyncComponent(() =>
        import(`../components/blocks/${blockCode}Block.vue`),
    )
}

onMounted(() => {
    loadBLock()
})

watch(
    () => props.modalOptions.visible,
    (newval, oldval) => {
        if (newval == true) {
            console.log(props)
            if (props.block != null) {
                data.block = { ...props.block }
            }
        } else {
            console.log(1)

            data.block = { block: {}, inputValues: {} }
            deleteCounter.value = 0
        }
    },
)
watch(
    () => data.block.block,
    (newval, oldval) => {
        if (!newval) return
        loadBLock()
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
    .options {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #3f4b5b;
    }
    .p-dialog-footer {
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;

        .delet {
            margin-right: auto;
        }
    }
}
</style>
