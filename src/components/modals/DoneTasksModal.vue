<template>
    <div class="doneTasksModal modal-card" style="width: auto; min-width: 400px">
        <header class="modal-card-head">
            <p class="modal-card-title">Done'd tasks for '{{ category }}'</p>
        </header>
        <section class="modal-card-body">
            <TasksViewer v-if="tasks.length" :tasks="tasks" :archive="true" />
        </section>
        <footer class="modal-card-foot">
            <Button label="Close" @click="$emit('close')" />
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
    },
    data() {
        return {
            tasks: [],
        }
    },
    created() {
        this.loadTasks()
    },
    methods: {
        async loadTasks() {
            this.tasks = await db.tasks
                .filter(
                    (task) =>
                        this.category.toLowerCase() == task.category.toLowerCase() &&
                        task.done,
                )
                .toArray()
        },
    },
}
</script>

<style lang="scss">

</style>
