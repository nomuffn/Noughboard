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
            :class="[!edit && block.blur && 'blur']"
            :edit="edit"
            :is="getBlock()"
            :input="getInputValues()"
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
                <Checkbox v-model="block.blur" label="Blur"> </Checkbox>
            </div>
        </div>
    </div>
</template>

<script>
import { allBlocks, components } from '@/components/blocks'
import { decrypt } from '@/lib/encrypt'

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
        getInputValues() {
            let values
            if (this.$attrs.decryptionPass) {
                values = decrypt(this.block.inputValues, this.$attrs.decryptionPass)
            } else {
                values = this.block.inputValues
            }
            return values
        },
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

    > div.blur {
        &:hover {
            filter: blur(0);
        }
    }
}
</style>
