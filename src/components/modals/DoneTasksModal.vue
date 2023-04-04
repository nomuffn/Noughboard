<template>
    <div class="newTaskModal modal-card" style="width: auto; min-width: 400px">
        <header class="modal-card-head">
            <p class="modal-card-title">Done'd tasks for '{{ category }}'</p>
        </header>
        <section class="modal-card-body">
            <TasksViewer :tasks="tasks" :archive="true" />
        </section>
        <footer class="modal-card-foot">
            <b-button label="Close" @click="$emit('close')" />
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
.editBlockModal {
    .modal-card-body {
        min-height: 25vh;
        min-width: 50vh;
        height: auto;
    }
    .modal-card-foot {
        justify-content: flex-end;
    }
}
</style>
