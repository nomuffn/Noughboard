<template>
    <div id="list-input">
        <InputText label="Press enter to add streamer" v-model="input" id="new-item" @keyup.enter.native="add" />
        <ul class="my-1">
            <li
                v-for="(valueInput, index) in value"
                :key="index"
                class="flex items-center my-1"
            >
                <p>-</p>
                <Button class="ml-1 p-button-text" icon="pi pi-trash" @click="remove(index)" />
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
    mounted() {},
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
