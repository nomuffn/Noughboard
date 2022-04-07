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
                <p class="remaining" v-if="input.repeat > 0">
                    Runs again in {{ getRemainingTime() }}
                </p>
            </div>

            <div v-else>error</div>
            <!-- error icon if smth went wrong -->
            <!-- render lambda result; array of extra blocks to render? text, lists, images whatever -->
        </div>
        <div class="edit" v-else>
            <label for="minmax-buttons"
                >(Optional) Run every x minutes after the initial render</label
            >
            <InputNumber
                id="minmax-buttons"
                v-model="input.repeat"
                mode="decimal"
                showButtons
                :min="0"
                :max="100"
            />

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
import {
    computed,
    onMounted,
    reactive,
    ref,
    watch,
    onBeforeMount,
} from '@vue/runtime-core'
import ScriptEditor from '../ScriptEditor.vue'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import { Lambda, defaultLambda } from '@/lib/lambda'

const props = defineProps({
    edit: Boolean,
    input: Object,
})
const toast = useToast()

const loading = ref(true)
const result = reactive({})
const remainingTime = ref(0)
const getRemainingTime = () => {
    const seconds = 60 * props.input.repeat - remainingTime.value
    const remaining = Math.round(seconds / 60, 0)
    if (remaining <= 1) return `${seconds} s`
    return `${remaining} m`
}

const runCode = async () => {
    if (!props.edit) {
        loading.value = true
        try {
            const res = await new Lambda(props.input.lambda).run()
            Object.assign(result, res)
            console.log(res)
        } catch (e) {
            console.log(e)
        } finally {
            loading.value = false
        }
    }
}

onBeforeMount(() => {})
onMounted(async () => {
    if (!props.input.lambda) props.input.lambda = defaultLambda

    if (!props.edit) {
        await runCode()

        const interval = props.input.repeat
        if (!isNaN(interval) && interval > 0) {
            setInterval(function () {
                remainingTime.value = 0
                runCode()
            }, interval * 1000 * 60)
            setInterval(function () {
                remainingTime.value += 1
            }, 1000)
        }
    }
})

// watch(
//     () => props.input.lambda,
//     () => {
//         runCode()
//     },
// )

const checkCode = async () => {
    try {
        const result = await new Lambda(props.input.lambda).run()
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
            summary: 'Error in code',
            detail: e,
        })
        console.log(e)
    }
}

//exec lambda if not edit
</script>

<style lang="scss">
.lambdaBlock {
    .view {
        .remaining {
            opacity: 0.5;
            position: absolute;
            right: -15px;
            font-size: 80%;
            bottom: -20px;
        }
    }
    .edit {
        display: flex;
        flex-direction: column;
        max-width: 800px;
        width: 100%;
        padding-left: 15px;

        > * {
            margin-bottom: 15px;
        }

        .scripteditor {
            margin-bottom: 20px;
            margin-left: -15px;
        }
        button {
            align-self: flex-end;
        }
        label {
            margin-bottom: 5px;
        }
        .p-inputnumber input {
            max-width: 100px;
        }
    }
}
</style>
