<template>
    <div class="imageBlock" v-if="!edit">
        <img :src="input.link" />
    </div>
    <div v-else class="imageBlock">
        <InputText v-model="input.link" label="Direct image link"></InputText>
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
.imageBlock {
   
}
</style>
