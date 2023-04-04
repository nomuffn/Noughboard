<template>
    <div class="lambdaBlock">
        <div class="view" v-if="!edit">
            <b-loading v-if="loading" v-model="loading" />
            <div class="result" v-else-if="Object.keys(result).length">
                <p class="remaining" v-if="input.repeat > 0">~{{ getRemainingTime() }}</p>
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
            <label for="minmax-buttons"
                >(Optional) Run every x minutes after the initial render</label
            >
            <b-numberinput v-model="input.repeat" id="minmax-buttons" min="0" ax="100" />

            <ScriptEditor v-model="input.lambda" />
            <b-button
                label="Test run code"
                icon-right="check"
                @click="checkCode()"
                :disabled="!input.lambda || !input.lambda.length"
            />
        </div>
    </div>
</template>

<script>
import ScriptEditor from '@/components/ScriptEditor.vue'
import { Lambda, defaultLambda } from '@/lib/lambda'

export default {
    components: {
        ScriptEditor,
    },
    props: {
        edit: {
            type: Boolean,
        },
        input: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            loading: false,
            result: null,
            remainingTime: 0,
        }
    },
    async mounted() {
        if (!this.input.lambda) this.input.lambda = defaultLambda

        if (!this.edit) {
            await runCode()

            const interval = this.input.repeat
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
    },
    computed: {
        remainingTime() {
            const seconds = 60 * props.input.repeat - remainingTime.value
            const remaining = Math.round(seconds / 60, 0)
            if (remaining <= 1) return `${seconds} s`
            return `${remaining} m`
        },
    },
    methods: {
        async runCode() {
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
        },
        async checkCode() {
            try {
                let result = await new Lambda(props.input.lambda).run()
                let resultJson = JSON.stringify(result)
                let toastMessage = '...too long, check console logs 🤓'
                if (resultJson.length <= 500) {
                    toastMessage = resultJson
                }
                toast.add({
                    severity: 'info',
                    summary: 'Result is:',
                    detail: toastMessage,
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
        },
    },
}
</script>

<style lang="scss" scoped></style>
