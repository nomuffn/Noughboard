<template>
    <div class="lambdaBlock">
        <div class="view" v-if="!edit">
            <b-loading v-if="loading" v-model="loading" />
            <div class="result" v-else-if="result">
                <p class="remaining" v-if="input.repeat > 0">~{{ getRemainingTime }}</p>
                <div v-for="item in result" :key="item.type + item.value">
                    <!-- move all of this to an extra lambda wrapper/render component? -->
                    <template v-if="item.type == 'text'">
                        <p :style="item.style" v-html="item.value" />
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
        if (!this.edit) {
            await this.runCode()

            this.startIntervals()
        } else {
            if (!this.inputLambda) this.inputLambda = defaultLambda
        }
    },
    updated() {
        this.startIntervals()
    },
    computed: {
        inputLambda: {
            get() {
                return this.input.lambda
            },
            set(val) {
                this.input.lambda = val
            },
        },
        getRemainingTime() {
            const seconds = 60 * this.input.repeat - this.remainingTime
            const remaining = Math.round(seconds / 60, 0)
            if (remaining <= 1) return `${seconds} s`
            return `${remaining} m`
        },
    },
    methods: {
        async startIntervals() {
            // TODO find a way to properly clear old intervals. beforeUnmount doesnt work cause component is not correctly unmounted? Maybe store all intervals in a global object or vuex storage? This only works the way it does cause in Home i set this.blocks = [] so no components are reused. Question if thats better this way or if components should be reused. Furthermore the intervals wouldnt be cleared if the block was deleted
            // keep in mind that it should work with multiple lambda blocks and each having their own intervals
            // clearInterval(window.repeat)
            // clearInterval(window.counter)

            const interval = this.input.repeat
            if (!isNaN(interval) && interval > 0) {
                // TODO combine both intervals to one that counts the seconds and just checks when it should run by dividing
                const repeat = setInterval(async () => {
                    this.remainingTime = 0
                    await this.runCode()
                }, interval * 1000 * 60)
                const counter = setInterval(() => {
                    this.remainingTime += 1
                    console.log('remainingTime', this.remainingTime)
                }, 1000)
            }
        },
        async runCode() {
            if (!this.edit) {
                this.loading = true
                try {
                    const res = await new Lambda(this.input.lambda).run()
                    this.result = res
                } catch (e) {
                    console.log(e)
                } finally {
                    this.loading = false
                }
            }
        },
        async checkCode() {
            try {
                let result = await new Lambda(this.input.lambda).run()
                let resultJson = JSON.stringify(result)
                let toastMessage = '...too long, check console logs 🤓'
                if (resultJson.length <= 500) {
                    toastMessage = resultJson
                }
                this.$toast.open({
                    duration: 5000,
                    message: 'Result is: ' + toastMessage,
                    position: 'is-bottom',
                    type: 'is-success',
                })
                console.log(result)
            } catch (e) {
                this.$toast.open({
                    type: 'is-error',
                    message: 'Error in code: ' + e,
                })

                console.log(e)
            }
        },
    },
}
</script>

<style lang="scss" scoped></style>
