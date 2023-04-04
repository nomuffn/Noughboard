<template>
    <div class="basicBlock">
        <component :is="getBlock()" :input="block.inputValues" />
    </div>
</template>

<script>
import { allBlocks, components } from '@/components/blocks'

export default {
    components: {
        ...components,
    },
    props: {
        block: {
            required: true,
            type: Object,
        },
    },
    methods: {
        getBlock() {
            const blockCode = this.block?.type?.code
            return `${blockCode}Block`
        },
    },
}
</script>

<style lang="scss">
.basicBlock {
    user-select: none;
}
</style>
