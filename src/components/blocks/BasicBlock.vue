<template>
    <div
        :class="[
            'basicBlock',
            !edit && 'rounded-md h-full w-full overflow-auto',
            !edit && !block.transparent && 'bg-slate-800',
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
            <b-field label="Extra options">
                <b-checkbox v-model="block.transparent">
                    Transparent background
                </b-checkbox>
                <b-checkbox v-model="block.hideResizeHandle">
                    Hide resize handle
                </b-checkbox>
                <b-checkbox v-model="block.showScroll"> Show scrollbar </b-checkbox>
                <b-checkbox v-model="block.noPadding"> No padding </b-checkbox>
            </b-field>
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

    &.hideScroll::-webkit-scrollbar {
        display: none;
    }
}
</style>
