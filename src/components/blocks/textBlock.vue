<template>
    <div class="textBlock" v-if="!edit">
        <div v-html="input.text" />
    </div>
    <div v-else>
        <Editor v-model="input.text" />
    </div>
</template>

<script setup>
import { reactive } from '@vue/reactivity'
import Editor from '../TextEditor.vue'

console.log('setup')

defineProps({
    edit: Boolean,
    input: Object,
})
</script>

<style lang="scss">
.textBlock {
    min-width: 200px;

    p {
        white-space: pre-line;
        min-height: 1.5rem;
    }
}
</style>
