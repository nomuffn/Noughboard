<template>
    <div
        v-if="!edit"
        class="textBlock prose dark:prose-invert prose-p:mt-0 prose-p:mb-0 prose-ul:m-0 prose-li:m-0"
    >
        <div v-html="input.text" />
    </div>
    <div v-else class="textBlock">
        <!-- 
            full page would require to emit a new event back to Blockswrapper and/or Home. In there you need to reopen the modal in fullscreen. Reutizilize the prefire var to also save the block options & inputvalues and reload the modal in fullscreen with previous values
         -->
        <Checkbox v-model="input.fullPage" label="Use full page (WIP)" :disabled="true"/>
        <Editor v-model="input.text" ref="editor" class="my-2" editorStyle="height: 320px"/>
        <div class="opacity-50">
            <p>Save: ctrl + s</p>
            <p>Undo: ctrl + z</p>
        </div>
    </div>
</template>

<script>
export default {
    mounted() {
        if (this.edit) {
            setTimeout(() => {
                this.$refs.editor.quill.focus()
                this.$refs.editor.quill.keyboard.addBinding({
                    key: 's',
                    ctrlKey: true,
                    handler: (range, context) => {
                        console.log('ctrl enter')
                        this.$emit('submit')
                    },
                })
            }, 200)
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
}
</script>

<style lang="scss">
.textBlock {
    p {
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

    .ql-align-right {
        text-align: right;
    }

    .ql-align-left {
        text-align: left;
    }
    .ql-align-center {
        text-align: center;
    }

    h1,
    h2,
    h3 {
        margin: 0 !important;
    }
}
</style>
