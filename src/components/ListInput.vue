<template>
    <div id="list-input">
        <b-input v-model="input" id="new-item" @keyup.enter.native="add" />
        <ul class="my-1">
            <li
                v-for="(valueInput, index) in value"
                :key="index"
                class="flex items-center my-2"
            >
                <p>-</p>
                <b-button
                    class="ml-2"
                    type="is-primary"
                    icon-right="close"
                    @click="remove(index)"
                />
                <p class="ml-2">{{ valueInput }}</p>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: ['value'],
    data() {
        return {
            input: null,
        }
    },
    mounted() {
        console.log(this.value)
    },
    methods: {
        add() {
            this.$emit('input', [...this.value, this.input])
            this.input = ''
        },
        remove(index) {
            this.value.splice(index, 1)
            this.$emit('input', this.value)
        },
    },
}
</script>

<style></style>
