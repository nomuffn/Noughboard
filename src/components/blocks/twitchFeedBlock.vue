<template>
    <div v-if="!edit" class="textBlock">
        <div v-html="input.text" />
    </div>
    <div v-else>
        <b-field label="Content">
            <b-input v-model="input.text" type="textarea"></b-input>
        </b-field>
    </div>
</template>

<script>
// implement tiptap

export default {
    mounted() {},
    props: {
        input: {
            Object: Object,
            required: true,
        },
        edit: {
            Object: Boolean,
            default: false,
        },
    },
}
</script>

<style lang="scss"></style>
