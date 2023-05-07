<template>
    <div v-if="!edit">
        <img :src="input.link" />
    </div>
    <div v-else class="textBlock">
        <b-field label="Direct image link">
            <b-input v-model="input.link"></b-input>
        </b-field>
    </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'

export default {
    components: { VueEditor },
    mounted() {
        if (!this.edit) {
            // load iamge
        }
    },
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
    computed: {
        image() {
            return null
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
