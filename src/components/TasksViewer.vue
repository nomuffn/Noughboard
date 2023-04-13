<template>
    <div class="tasks flex flex-col">
        <div
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            class="task flex justify-between items-center"
        >
            <div>
                <b-checkbox :value="states[task.id]" @input="toggleComplete(task)">
                    <strong>[ {{ task.priority }} ]</strong>
                    {{ task.content }}
                </b-checkbox>
                <p
                    v-if="task.details"
                    style="
                        margin-left: 30px;
                        font-size: 80%;
                        margin-top: -3px;
                        overflow-wrap: anywhere;
                    "
                >
                    {{ task.details }}
                </p>
            </div>

            <div class="actions flex">
                <b-button
                    v-if="!archive"
                    type="is-text"
                    icon-right="arrow-down-bold"
                    @click="moveTaskUp(task, false)"
                />
                <b-button
                    v-if="!archive"
                    type="is-text"
                    icon-right="arrow-up-bold"
                    @click="moveTaskUp(task)"
                />

                <b-button type="is-text" icon-right="pencil" @click="editTask(task)" />
            </div>
        </div>
    </div>
</template>

<script>
import { db } from '@/lib/db'
import EditTaskModal from '@/components/modals/EditTaskModal.vue'

export default {
    props: {
        tasks: {
            Object: Array,
            required: true,
        },
        archive: {
            Object: Boolean,
            required: false,
        },
        daily: {
            Object: Boolean,
            default: false,
        },
    },
    data() {
        return {
            states: {},
        }
    },
    async created() {
        let states = []
        for (const task of this.tasks) {
            states[task.id] = await this.isDone(task)
        }
        this.states = states
    },
    methods: {
        async moveTaskUp(task, up = true) {
            if (up) {
                task.priority++
            } else {
                task.priority--
            }
            await db.tasks.put(task)
            this.$emit('update')
        },
        editTask(task) {
            this.$buefy.modal.open({
                parent: this,
                component: EditTaskModal,
                hasModalCard: true,
                trapFocus: true,
                props: { category: task.category, existingTask: task },
                events: {
                    close: () => {
                        this.$emit('update')
                    },
                },
            })
        },
        async toggleComplete(task) {
            console.log('completeTask')
            if (this.daily) {
                let date = new Date()
                date.setHours(0, 0, 0, 0)

                const state = { taskId: task.id, date: date }

                const taskState = await db.tasksState.get(state)
                if (taskState) {
                    await db.tasksState.where(state).delete()
                } else {
                    await db.tasksState.add(state)
                }
            } else {
                await db.tasks.update(task.id, { done: !task.done })
                // this.$emit('update')
            }
            this.states[task.id] = !task.done
        },
        async isDone(task) {
            if (this.daily) {
                let date = new Date()
                date.setHours(0, 0, 0, 0)

                const state = { taskId: task.id, date: date }

                const taskState = await db.tasksState.get(state)
                if (taskState) {
                    return true
                } else {
                    return false
                }
            } else {
                return task.done
            }
        },
    },
}
</script>

<style lang="scss"></style>
