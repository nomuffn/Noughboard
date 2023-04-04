<template>
    <div class="newTaskModal modal-card" style="width: auto; min-width: 400px">
        <header class="modal-card-head">
            <p class="modal-card-title">New Task for '{{ category }}'</p>
        </header>
        <section class="modal-card-body">
            <b-field label="Task">
                <b-input v-model="task.content"></b-input>
            </b-field>
            <b-field label="Details">
                <b-input v-model="task.details" type="textarea"></b-input>
            </b-field>

            <b-field label="Priority">
                <b-numberinput v-model="task.priority"></b-numberinput>
            </b-field>
        </section>
        <footer class="modal-card-foot">
            <b-button label="Close" @click="$emit('close')" />
            <b-button
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
                priority: 5,
                content: '',
                details: '',
            },
        }
    },
    mounted() {
        if (this.existingTask) {
            this.task = { ...this.existingTask }
        }
    },
    methods: {
        async saveTask() {
            await db.tasks.put({
                category: this.category.toLowerCase(),
                ...this.task,
            })
            this.$emit('close')
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
