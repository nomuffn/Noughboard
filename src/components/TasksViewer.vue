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
                    class="flex justify-between items-center mb-1"
                    :style="getStyle(task)"
                >
                    <div>
                        <Checkbox
                            v-model="states[task.id]"
                            @input="toggleComplete(task)"
                            :label="task.content"
                        />
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
                        <Button
                            class="p-button-text"
                            icon="pi pi-pencil"
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
        dailyResetTime: {
            default: false,
        },
    },
    data() {
        return {
            states: {},
            mutableTasks: this.tasks,
        }
    },
    async mounted() {
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
        getStyle(task) {
            if (task.color) {
                return `border-left: 5px; border-color: ${task.color.hex}; border-style: solid; padding-left: 10px;`
            }
            return ''
        },
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
        getDailyDate() {
            let resetTime = new Date(Date.parse(this.dailyResetTime))
            // ?? resetTime.setDate(resetTime.getDate() - 7)

            let date = new Date()
            date.setHours(resetTime.getHours(), resetTime.getMinutes(), 0)

            const now = new Date()

            if (date - now > 0) {
                now.setDate(now.getDate() - 1)
            }
            return now
        },
        async toggleComplete(task) {
            if (this.dailyResetTime) {
                const state = {
                    type: 'dailytask',
                    id: task.id,
                    date: this.getDailyDate().toLocaleDateString(),
                }

                const taskState = await db.states.get(state)
                if (taskState) {
                    await db.states.where(state).delete()
                } else {
                    await db.states.add(state)
                }
            } else {
                await db.tasks.update(task.id, { done: this.states[task.id] })
                // this.$emit('update')
            }
        },
        async isDone(task) {
            if (this.dailyResetTime) {
                const state = {
                    type: 'dailytask',
                    id: task.id,
                    date: this.getDailyDate().toLocaleDateString(),
                }

                const taskState = await db.states.get(state)

                if (taskState) return true
                else return false
            } else {
                return task.done != null ? task.done : false
            }
        },
    },
}
</script>

<style lang="scss"></style>
