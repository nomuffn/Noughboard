<template>
    <div class="flex">
        <div class="flex flex-col">
            <p>Hours</p>
            <Dropdown
                v-model="hours"
                @input="updateValue"
                :options="getUnits(24)"
                appendTo="body"
                optionValue="value"
                optionLabel="value"
                style="width: 90px"
            />
        </div>
        <div class="flex flex-col">
            <p>Minutes</p>
            <Dropdown
                v-model="minutes"
                @input="updateValue"
                :options="getUnits(60)"
                appendTo="body"
                optionValue="value"
                optionLabel="value"
                style="width: 90px"
            />
        </div>
        <div v-if="showSeconds !== undefined" class="flex flex-col">
            <p>Seconds</p>
            <Dropdown
                v-model="seconds"
                @input="updateValue"
                :options="getUnits(60)"
                appendTo="body"
                optionValue="value"
                optionLabel="value"
            />
        </div>
    </div>
</template>

<script>
export default {
    props: ['showSeconds', 'value'],
    data() {
        return {
            hours: 0,
            minutes: 0,
            seconds: 0,
        }
    },
    created() {
        let date = new Date(Date.parse(this.value))
        this.hours = date.getHours() + '' // 🧑‍🦼👨‍🦼👩‍🦼🧑‍🦽👨‍🦽👩‍🦽♿
        this.minutes = date.getMinutes() + '' // 🧑‍🦼👨‍🦼👩‍🦼🧑‍🦽👨‍🦽👩‍🦽♿
        this.seconds = date.getSeconds() + '' // 🧑‍🦼👨‍🦼👩‍🦼🧑‍🦽👨‍🦽👩‍🦽♿
    },
    computed: {},
    methods: {
        updateValue() {
            let date = new Date(Date.parse(this.value))
            date.setHours(this.hours)
            date.setMinutes(this.minutes)
            if (this.showSeconds) {
                date.setSeconds(this.seconds)
            } else {
                date.setSeconds(0)
            }
            this.$emit('input', date)
        },
        getUnits(val) {
            return [...Array(val).keys()].map((item) => {
                return { value: item + '' }
            })
        },
    },
}
</script>

<style></style>
