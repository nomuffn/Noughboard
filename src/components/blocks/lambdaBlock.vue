<template>
    <div class="lambdaBlock">
        <div class="view" v-if="!edit">
            <b-loading v-if="loading" v-model="loading" />
            <div class="result" v-else-if="result">
                <p class="remaining" v-if="input.repeat > 0">~{{ getRemainingTime }}</p>
                <div class="my-2 result-html" v-html="result"></div>
            </div>

            <div v-else>error</div>
            <!-- error icon if smth went wrong -->
            <!-- render lambda result; array of extra blocks to render? text, lists, images whatever -->
        </div>
        <div class="edit" v-else>
            <p>Code is ran on page load</p>
            <p>After you can repeat it after X minutes</p>
            <p>0 means never</p>
            <b-numberinput
                class="my-2"
                v-model="input.repeat"
                id="minmax-buttons"
                min="0"
                ax="100"
            />

            <ScriptEditor
                v-model="inputLambda"
                class="my-2"
            />
            <b-button
                class="my-2"
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
            inputLambda: this.input.lambda
        }
    },
    timers: {
        lambdaTimer: {
            time: 1000,
            repeat: true,
            immediate: true,
        },
    },
    created() {
        // if (this.edit) {
        //     if (!this.inputLambda) this.inputLambda = defaultLambda
        // }
    },
    async mounted() {
        if (!this.edit) {
            await this.runCode()

            if (!isNaN(this.input.repeat) && this.input.repeat > 0) {
                this.remainingTime = this.input.repeat * 60
                this.$timer.start('lambdaTimer')
            }
        } else {
            if (!this.inputLambda) this.inputLambda = defaultLambda
        }
    },
    watch: {
        inputLambda(newval, oldval) {
            // TODO use emits properly
            this.input.lambda = this.inputLambda
        }
    },
    computed: {
        // inputLambda: {
        //     get() {
        //         return this.input.lambda
        //     },
        //     set(val) {
        //         this.input.lambda = val
        //     },
        // },
        getRemainingTime() {
            const seconds = this.remainingTime
            const minutes = Math.round(seconds / 60, 0)
            if (minutes <= 1) return `${seconds} s`
            return `${minutes} m`
        },
    },
    methods: {
        async lambdaTimer() {
            if (this.remainingTime == 0) {
                await this.runCode()
                this.remainingTime = this.input.repeat * 60
            } else {
                this.remainingTime--
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

<style lang="scss" scoped>
.result {
    position: relative;
    display: flex;
    flex-direction: column;
}
.remaining {
    position: absolute;
    top: -5px;
    right: -5px;
    font-size: 85%;
    opacity: 50%;
}
</style>
