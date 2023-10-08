<template>
    <div v-if="!edit" class="tasksBlock">
        <div class="flex justify-between items-center">
            <strong>{{ input.category }}</strong>
            <div class="actions flex">
                <Button
                    v-if="input.daily"
                    class="p-button-text"
                    icon="pi pi-history"
                    @click="openHistory()"
                    :disabled="true"
                />
                <Button
                    v-if="!input.daily"
                    class="p-button-text"
                    icon="pi pi-folder"
                    @click="openArchive()"
                />
                <Button class="p-button-text" icon="pi pi-plus" @click="newTask()" />
            </div>
        </div>
        <TasksViewer
            v-if="tasks.length"
            class="my-2"
            :tasks="tasks"
            @update="loadTasks()"
            :dailyResetTime="input.daily ? input.dailyResetTime : null"
        />
        <p v-if="input.daily">Resets in {{ dailyResetTimeLeft }}</p>
    </div>
    <div v-else>
        <InputText
            v-model="input.category"
            label="Category (also the identifier in the database rn)"
        ></InputText>
        <Checkbox v-model="input.daily" label="Daily Tasks"> Active </Checkbox>
        <div v-if="input.daily" class="flex mt-2 items-center">
            <p class="font-bold mr-4">Reset at</p>
            <TimePicker v-model="input.dailyResetTime" />
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
            dailyResetTimeLeft: '...',
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
    timers: {
        dailyTimer: {
            time: 1000,
            repeat: true,
            immediate: true,
        },
    },
    mounted() {
        if (!this.edit) {
            this.loadTasks()

            if (this.input.daily) this.$timer.start('dailyTimer')
        } else {
            if (!this.input.dailyResetTime) {
                this.input.dailyResetTime = new Date()
                this.input.dailyResetTime.setHours(0, 0)
            }
        }
    },
    methods: {
        dailyTimer() {
            console.log('task timer')

            // only yoink hours & minutes from resetTime
            let resetTime = new Date(Date.parse(this.input.dailyResetTime))
            resetTime.setDate(resetTime.getDate() - 7)

            let date = new Date()
            date.setHours(resetTime.getHours(), resetTime.getMinutes(), 0)

            const now = new Date()
            if (date - now < 0) {
                date.setDate(date.getDate() + 1)
            }
            const delta = date - now

            var seconds = Math.floor((delta / 1000) % 60),
                minutes = Math.floor((delta / (1000 * 60)) % 60),
                hours = Math.floor((delta / (1000 * 60 * 60)) % 24)

            this.dailyResetTimeLeft = `${hours}hrs ${minutes}m ${seconds}s`

            // daily reset
            if (hours == 0 && minutes == 0 && seconds == 0) {
                this.loadTasks()
            }
        },
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
