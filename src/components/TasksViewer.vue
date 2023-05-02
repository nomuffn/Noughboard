<template>
    <div class="tasks flex flex-col">
        <draggable
            class="draggable"
            v-model="mutableTasks"
            @change="updateTasks"
            animation="200"
        >
            <transition-group>
                <div
                    v-for="task in mutableTasks"
                    :key="task.id"
                    class="flex justify-between items-center"
                >
                    <div>
                        <b-checkbox
                            :value="states[task.id]"
                            @input="toggleComplete(task)"
                        >
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
                            type="is-text"
                            icon-right="pencil"
                            @click="editTask(task)"
                        />
                    </div>
                </div>
            </transition-group>
        </draggable>
    </div>
</template>

<script>
import EditTaskModal from '@/components/modals/EditTaskModal.vue'
import { db } from '@/lib/db'
import draggable from 'vuedraggable'

export default {
    components: {
        draggable,
    },
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
            mutableTasks: this.tasks,
        }
    },
    async created() {
        let states = []
        for (const task of this.tasks) {
            states[task.id] = await this.isDone(task)
        }
        this.states = states
    },
    watch: {
        tasks(newval, oldval) {
            this.mutableTasks = newval
        },
    },
    methods: {
        async updateTasks() {
            // await db.tasks.put({ ...item.moved.element, index: item.moved.newIndex })
            await db.tasks.bulkPut(
                this.mutableTasks.map((item, index) => {
                    return {
                        ...item,
                        index,
                    }
                }),
            )
            console.log('update')
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
                await db.tasks.update(task.id, { done: !this.states[task.id] })
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
