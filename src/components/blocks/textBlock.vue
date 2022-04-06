<template>
    <div class="textBlock" v-if="!edit">
        <p><pre>{{ input.text }}</pre></p>
    </div>
    <div v-else>
        <Textarea type="text" v-model="input.text" />
    </div>
</template>

<script setup>
console.log('setup')

defineProps({
    edit: Boolean,
    input: Object,
})
</script>

<style lang="scss">
.textBlock {
    max-width: 500px;
    min-width: 200px;
}
</style>
