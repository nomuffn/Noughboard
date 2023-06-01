<template>
    <div v-if="uniqueId" class="field-inputtext flex flex-col my-2">
        <label class="mr-4 mb-2 font-bold" :for="uniqueId">{{ label }}</label>
        
        <Textarea v-if="isTextArea" label="Details" v-model="wrappedValue" ></Textarea>
        <PInputText v-else v-model="wrappedValue" :id="uniqueId" />
    </div>
</template>

<script>
export default {
    props: ['label', 'value', 'textarea'],
    data() {
        return {
            uniqueId: null,
        }
    },
    created() {
        this.uniqueId = (Math.random() + 1).toString(36).substring(2)
    },
    computed: {
        isTextArea() {
            return this.textarea !== undefined
        },
        wrappedValue: {
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

<style></style>
