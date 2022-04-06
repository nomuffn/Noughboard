<template>
    <div
        class="card"
        v-for="block in blocks"
        :key="block.id"
        @click.stop="$emit('editBlock', block)"
    >
        <BasicBlock :block="block" />
    </div>
</template>

<script setup>
import { ref, reactive, defineAsyncComponent } from 'vue' //ref for primitives, reactive for objects
import BasicBlock from './blocks/BasicBlock.vue'

defineEmits(['editBlock'])
defineProps({
    blocks: Array,
})
</script>

<style lang="scss"></style>
