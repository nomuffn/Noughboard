<template>
    <div v-if="!edit" class="tasksBlock">
        <div class="flex justify-between items-center">
            <strong>{{ input.category }}</strong>
            <div class="actions flex">
                <b-button
                    v-if="input.daily"
                    icon-right="history"
                    type="is-text"
                    @click="openHistory()"
                />
                <b-button
                    v-if="!input.daily"
                    icon-right="archive"
                    type="is-text"
                    @click="openArchive()"
                />
                <b-button icon-right="plus" type="is-text" @click="newTask()" />
            </div>
        </div>
        <TasksViewer
            v-if="tasks.length"
            class="my-2"
            :tasks="tasks"
            @update="loadTasks()"
            :daily="input.daily"
        />
        <p v-if="input.daily">Tasks reset in {{ dailyResetHoursLeft }}</p>
    </div>
    <div v-else>
        <b-field label="Category">
            <b-input v-model="input.category" type="textarea"></b-input>
        </b-field>
        <b-field label="Daily Tasks">
            <b-checkbox v-model="input.daily"> Active </b-checkbox>
        </b-field>
        <div v-if="input.daily">
            <b-field label="Reset at">
                <b-timepicker
                    v-model="input.dailyResetTime"
                    inline
                    placeholder="Click to select..."
                />
            </b-field>
        </div>
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
        if (!this.edit) this.loadTasks()
    },
    computed: {
        dailyResetHoursLeft() {
            // TODO interval to refresh numbers
            const date = new Date(Date.parse(this.input.dailyResetTime))
            const now = new Date()
            const remHours = 23 - (date.getHours() + now.getHours())
            const remMinutes = 59 - (date.getMinutes() + now.getMinutes())
            return `${remHours}hrs ${remMinutes}m`
        },
    },
    methods: {
        async loadTasks() {
            // always compare & save category in lowercase
            // TODO implement created_at & updated_at
            this.tasks = []
            this.tasks = await db.tasks
                .filter(
                    (task) =>
                        this.input.category.toLowerCase() ==
                            task.category.toLowerCase() && !task.done,
                )
                .sortBy('index')
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
