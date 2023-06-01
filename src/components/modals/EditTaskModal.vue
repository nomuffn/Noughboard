<template>
    <div class="newTaskModal modal-card" style="width: auto; min-width: 400px">
        <header class="modal-card-head">
            <p class="modal-card-title">New Task for '{{ category }}'</p>
        </header>
        <section class="modal-card-body">
            <InputText label="Task" v-model="task.content"></InputText>
            <InputText label="Details" v-model="task.details" textarea></InputText>
            <Dropdown v-model="task.color" :options="colors" optionLabel="name" appendTo="body" />

            <!-- <b-field label="Priority">
                <b-numberinput v-model="task.priority"></b-numberinput>
            </b-field> -->
        </section>
        <footer class="modal-card-foot justify-end">
            <Button
                :label="deleteSure ? 'Sure?' : 'Delete'"
                class="mr-auto p-button-danger"
                v-if="task.id"
                @click="deleteTask()"
            />

            <Button label="Close" class="ml-auto mr-2" @click="$emit('close')" />
            <Button
                label="Save"
                @click="saveTask"
                :disabled="submitDisabled"
                type="is-primary"
            />
        </footer>
    </div>
</template>

<script>
import { db } from '@/lib/db'

export default {
    props: {
        category: {
            required: true,
            type: String,
        },
        existingTask: {},
    },
    data() {
        return {
            task: {
                // priority: 5,
                content: '',
                details: '',
            },
            deleteSure: false,
            colors: [
                {
                    name: 'none',
                    hex: null,
                },
                {
                    name: 'green',
                    hex: '#00C853',
                },
                {
                    name: 'yellow',
                    hex: '#FFD600',
                },
                {
                    name: 'red',
                    hex: '#DD2C00',
                },
                {
                    name: 'white',
                    hex: '#fff',
                },
                {
                    name: 'blue',
                    hex: '#0091EA',
                },
                {
                    name: 'black',
                    hex: '#000',
                },
            ],
        }
    },
    mounted() {
        if (this.existingTask) {
            this.task = { ...this.existingTask }
        }
    },
    methods: {
        async saveTask() {
            if (!this.task.color?.hex) this.task.color = null
            await db.tasks.put({
                category: this.category.toLowerCase(),
                ...this.task,
            })
            this.$emit('close')
        },
        async deleteTask() {
            if (!this.deleteSure) return (this.deleteSure = true)

            await db.tasks.delete(this.task.id)
            this.$emit('close')
            this.deleteSure = false
        },
    },
    watch: {},
    computed: {
        submitDisabled() {
            return !this.task.content
        },
    },
}
</script>

<style lang="scss"></style>
