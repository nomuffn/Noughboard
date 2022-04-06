<template>
    <div class="lambdaBlock">
        <div class="view" v-if="!edit">
            <ProgressSpinner v-if="loading" style="height: 3rem" />
            <div class="result" v-else-if="Object.keys(result).length">
                <div v-for="item in result" :key="item.type + item.value">
                    <!-- move all of this to an extra lambda wrapper/render component? -->
                    <template v-if="item.type == 'text'">
                        <p :style="item.style">{{ item.value }}</p>
                    </template>
                </div>
            </div>

            <div v-else>error</div>
            <!-- error icon if smth went wrong -->
            <!-- render lambda result; array of extra blocks to render? text, lists, images whatever -->
        </div>
        <div class="edit" v-else>
            <ScriptEditor v-model="input.lambda" />
            <Button
                label="Test run code"
                icon="pi pi-check"
                class="p-button-outlined"
                @click="checkCode()"
                :disabled="!input.lambda || !input.lambda.length"
            />
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from '@vue/runtime-core'
import ScriptEditor from '../ScriptEditor.vue'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'

const props = defineProps({
    edit: Boolean,
    input: Object,
})
const toast = useToast()

const loading = ref(true)
const result = reactive({})

const runCode = async () => {
    if (!props.edit) {
        loading.value = true
        try {
            const test = new AsyncFunction(props.input.lambda)
            const res = await test()
            Object.assign(result, res)
            console.log(res)
        } catch (e) {
            console.log(e)
        } finally {
            loading.value = false
        }
    }
}

onMounted(async () => {
    runCode()
})

watch(
    () => props.input.lambda,
    () => {
        runCode()
    },
)

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
const checkCode = async () => {
    try {
        const test = new AsyncFunction(props.input.lambda)
        const result = await test()
        toast.add({
            severity: 'info',
            summary: 'Result is:',
            detail: result,
            life: 5000,
        })
        console.log(result)
    } catch (e) {
        toast.add({
            severity: 'error',
            summary: 'Error inc ode',
            detail: e,
        })
        console.log(e)
    }
}

//exec lambda if not edit
</script>

<style lang="scss">
.lambdaBlock {
    .edit {
        width: 80vw;
        .scripteditor {
            margin-bottom: 20px;
        }
        button {
            float: right;
        }
    }
}
</style>
