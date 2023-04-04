<template>
    <div v-if="!edit" class="textBlock prose dark:prose-invert" style="margin-top: -20px">
        <div v-html="input.text" />
    </div>
    <div v-else>
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
}
</style>
