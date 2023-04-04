<template>
    <div v-if="!edit" class="tasksBlock">
        <div class="flex justify-between items-center">
            <p>{{ input.category }}</p>
            <div class="actions flex">
                <b-button icon-right="archive" type="is-text" @click="openArchive()" />
                <b-button icon-right="plus" type="is-text" @click="newTask()" />
            </div>
        </div>
        <TasksViewer class="my-2" :tasks="tasks" @update="loadTasks()" />
    </div>
    <div v-else>
        <b-field label="Category">
            <b-input v-model="input.category" type="textarea"></b-input>
        </b-field>
    </div>
</template>

<script>
import { db } from '@/lib/db'
import DoneTasksModal from '@/components/modals/DoneTasksModal.vue'
import EditTaskModal from '@/components/modals/EditTaskModal.vue'

export default {
    data() {
        return {
            tasks: [],
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
    mounted() {
        this.loadTasks()
    },
    methods: {
        async loadTasks() {
            // always compare & save category in lowercase
            // TODO implement created_at & updated_at
            this.tasks = await db.tasks
                .filter(
                    (task) =>
                        this.input.category.toLowerCase() ==
                            task.category.toLowerCase() && !task.done,
                )
                .reverse()
                .sortBy('priority')
        },

        newTask() {
            this.$buefy.modal.open({
                parent: this,
                component: EditTaskModal,
                hasModalCard: true,
                trapFocus: true,
                props: { category: this.input.category },
                events: {
                    close: () => {
                        this.loadTasks()
                    },
                },
            })
        },
        async openArchive() {
            this.$buefy.modal.open({
                parent: this,
                component: DoneTasksModal,
                hasModalCard: true,
                trapFocus: true,
                props: {
                    category: this.input.category,
                },
                onCancel: () => {
                    this.loadTasks()
                },
                events: {
                    close: () => {
                        this.loadTasks()
                    },
                },
            })
        },
    },
}
</script>

<style lang="scss"></style>
