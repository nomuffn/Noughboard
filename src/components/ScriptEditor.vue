<template>
    <prism-editor
        v-model="inputVal"
        class="scripteditor"
        :highlight="highlighter"
        line-numbers
    />
</template>

<script>
// import Prism Editor
import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css' // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism-tomorrow.css' // import syntax highlighting styles

export default {
    data() {
        return {
            code: '',
        }
    },
    components: {
        PrismEditor,
    },
    methods: {
        highlighter(code) {
            return highlight(code, languages.js) // languages.<insert language> to return html with markup
        },
    },
    props: ['value'],
    computed: {
        inputVal: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            },
        },
    },
}
</script>

<style lang="scss">
.prism-editor__textarea {
    background-color: #212121 !important;
    &:focus {
        outline: none;
    }
}
.scripteditor {
    .number {
        min-width: inherit;
        padding: inherit;
        margin: 0;
        vertical-align: inherit;
        text-align: inherit;
        justify-content: inherit;
        height: inherit;
        font-size: inherit;
        border-radius: inherit;
        background-color: inherit;
        align-items: inherit;
    }
}
</style>
