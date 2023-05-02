<template>
    <div
        v-if="!edit"
        class="textBlock prose dark:prose-invert prose-p:mt-0 prose-p:mb-0 prose-ul:m-0 prose-li:m-0"
    >
        <div v-html="input.text" />
    </div>
    <div v-else class="textBlock">
        <b-field label="Content">
            <VueEditor v-model="input.text" />
        </b-field>
    </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'

export default {
    components: { VueEditor },
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

<style lang="scss">
.textBlock {
    p {
        white-space: pre-line;
        min-height: 1.5rem;
    }

    .quillWrapper {
        button svg {
            filter: invert(1);
        }

        .ql-picker-label {
            color: #fff;
        }
    }
}
</style>
