<template>
    <div v-if="state.editor">
        <menu-bar class="editor__header" :editor="state.editor" />
        <editor-content :editor="state.editor" />
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, watch } from '@vue/runtime-core'

import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
// import TaskList from '@tiptap/extension-task-list'
// import TaskItem from '@tiptap/extension-task-item'
// import Highlight from '@tiptap/extension-highlight'
// import CharacterCount from '@tiptap/extension-character-count'
import MenuBar from './tiptap/MenuBar.vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    modelValue: { type: String, required: true, default: '' },
})

const state = reactive({
    editor: null,
})

state.editor = useEditor({
    autofocus: true,
    extensions: [StarterKit],
    content: props.modelValue,
    onUpdate: ({ editor }) => {
        console.log('update')
        emit('update:modelValue', editor.getHTML())
    },
})

onBeforeUnmount(() => {
    state.editor?.destroy()
})
</script>

<style lang="scss">
.editor {
    display: flex;
    flex-direction: column;
    max-height: 26rem;
    color: #0d0d0d;
    background-color: #fff;
    border: 3px solid #0d0d0d;
    border-radius: 0.75rem;

    &__header {
        display: flex;
        align-items: center;
        flex: 0 0 auto;
        flex-wrap: wrap;
        margin-bottom: 10px; // border-bottom: 3px solid #0d0d0d;
    }

    &__content {
        padding: 1.25rem 1rem;
        flex: 1 1 auto;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    &__footer {
        display: flex;
        flex: 0 0 auto;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        white-space: nowrap;
        border-top: 3px solid #0d0d0d;
        font-size: 12px;
        font-weight: 600;
        color: #0d0d0d;
        white-space: nowrap;
        padding: 0.25rem 0.75rem;
    }

    /* Some information about the status */
    &__status {
        display: flex;
        align-items: center;
        border-radius: 5px;

        &::before {
            content: ' ';
            flex: 0 0 auto;
            display: inline-block;
            width: 0.5rem;
            height: 0.5rem;
            background: rgba(#0d0d0d, 0.5);
            border-radius: 50%;
            margin-right: 0.5rem;
        }

        &--connecting::before {
            background: #616161;
        }

        &--connected::before {
            background: #b9f18d;
        }
    }

    &__name {
        button {
            background: none;
            border: none;
            font: inherit;
            font-size: 12px;
            font-weight: 600;
            color: #0d0d0d;
            border-radius: 0.4rem;
            padding: 0.25rem 0.5rem;

            &:hover {
                color: #fff;
                background-color: #0d0d0d;
            }
        }
    }
}

/* Basic editor styles */
.ProseMirror {
    // > * + * {
    //     margin-top: 0.75em;
    // }

    padding: 15px;

    ul,
    ol {
        padding: 0 1rem;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        line-height: 1.1;
    }

    code {
        background-color: rgba(#616161, 0.1);
        color: #616161;
    }

    pre {
        background: #0d0d0d;
        color: #fff;
        font-family: 'JetBrainsMono', monospace;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;

        code {
            color: inherit;
            padding: 0;
            background: none;
            font-size: 0.8rem;
        }
    }

    mark {
        background-color: #faf594;
    }

    img {
        max-width: 100%;
        height: auto;
    }

    hr {
        margin: 1rem 0;
    }

    blockquote {
        padding-left: 1rem;
        border-left: 2px solid rgba(#0d0d0d, 0.1);
    }

    hr {
        border: none;
        border-top: 2px solid rgba(#0d0d0d, 0.1);
        margin: 2rem 0;
    }

    ul[data-type='taskList'] {
        list-style: none;
        padding: 0;

        li {
            display: flex;
            align-items: center;

            > label {
                flex: 0 0 auto;
                margin-right: 0.5rem;
                user-select: none;
            }

            > div {
                flex: 1 1 auto;
            }
        }
    }

    &:focus-visible {
        outline: #3f4b5b solid 1px;
    }
}
</style>
