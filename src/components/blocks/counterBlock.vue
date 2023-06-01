<template>
    <div v-if="!edit" class="counterBlock">
        <div class="flex flex-row justify-between flex-wrap items-center">
            <div class="mb-1">
                <p class="font-bold">
                    {{ input.title }}
                </p>
                <p>Count: {{ count }}</p>
            </div>
            <div>
                <Button class="mx-1" icon="pi pi-plus" @click="add()" />
                <Button class="mx-1" icon="pi pi-minus" @click="add(-1)" />
                <Button class="mx-1" icon="pi pi-history" @click="history" />
            </div>
        </div>
    </div>
    <div v-else class="counterBlock">
        <p class="mb-2">Resets every day</p>

        <InputText label="Title" v-model="input.title"></InputText>
        <InputText label="Unique identifier for database" v-model="input.key"></InputText>
    </div>
</template>

<script>
import { db } from '@/lib/db'
import slugify from 'slugify'
import CounterHistoryModal from '@/components/modals/CounterHistoryModal.vue'

export default {
    mounted() {
        if (!this.edit) this.load()
    },
    data() {
        return {
            count: 0,
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
    methods: {
        getObject(withCount = true) {
            // only do without Count if you need to get the state
            const count = withCount ? { count: this.count } : null
            return {
                type: 'counter',
                id: slugify(this.input.key),
                date: new Date().toLocaleDateString(),
                ...count, // lohl
            }
        },
        async load() {
            const counterState = await db.states.get(this.getObject(false))
            if (counterState && !isNaN(counterState.count)) {
                this.count = counterState.count
            }
        },
        async add(add = 1) {
            this.count += add
            await db.states.put(this.getObject())
            this.load()
        },
        history() {
            this.$buefy.modal.open({
                parent: this,
                component: CounterHistoryModal,
                hasModalCard: true,
                trapFocus: true,
                props: { type: 'counter', id: slugify(this.input.key) },
            })
        },
    },
}
</script>

<style lang="scss">
.counterBlock {
}
</style>
