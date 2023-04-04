<template>
    <prism-editor
        v-bind="$attrs"
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
    components: {
        PrismEditor,
    },
    methods: {
        highlighter(code) {
            return highlight(code, languages.js) // languages.<insert language> to return html with markup
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
</style>
