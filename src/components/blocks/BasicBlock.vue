<template>
    <div class="basicBlock">
        <component :is="getBlock()" :input="block.inputValues" />
    </div>
</template>

<script setup>
import { ref, reactive, defineAsyncComponent } from 'vue' //ref for primitives, reactive for objects

const props = defineProps({
    block: Object,
})

const blockName = () => {
    const code = props.block.block.code
    return `${code}Block`
}

const getBlock = () => {
    return defineAsyncComponent(() => import(`../blocks/${blockName()}.vue`))
}
</script>

<style lang="scss">
.basicBlock {
    user-select: none;
}
</style>
