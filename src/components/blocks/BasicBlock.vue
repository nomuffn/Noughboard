<template>
    <div
        :class="[
            'basicBlock',
            !edit && 'rounded-md h-full w-full overflow-auto',
            !edit && !block.transparent && 'bg',
            !edit && !block.showScroll && 'hideScroll',
            !edit && block.type.code != 'image' && !block.noPadding && 'p-4',
        ]"
    >
        <component
            :edit="edit"
            :is="getBlock()"
            :input="block.inputValues"
            @submit="$emit('submit')"
        />

        <div v-if="edit" class="mt-4">
            <p>Extra options</p>

            <div class="flex">
                <Checkbox v-model="block.transparent" label="Transparent background" />
                <Checkbox v-model="block.hideResizeHandle" label="Hide resize handle">
                </Checkbox>
                <Checkbox v-model="block.showScroll" label="Show scrollbar"> </Checkbox>
                <Checkbox v-model="block.noPadding" label="No padding"> </Checkbox>
            </div>
        </div>
    </div>
</template>

<script>
import { allBlocks, components } from '@/components/blocks'

export default {
    components: {
        ...components,
    },
    props: {
        edit: {
            Object: Boolean,
            default: false,
        },
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

    &.hideScroll {
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }
    }
}
</style>
