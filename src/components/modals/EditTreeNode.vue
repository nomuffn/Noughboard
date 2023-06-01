<template>
    <div class="newTaskModal modal-card" style="width: auto; min-width: 400px">
        <header class="modal-card-head">
            <p class="modal-card-title">
                {{ treeNode ? `Edit Tree Node ${treeNode.label}` : 'New Tree Node' }}
            </p>
        </header>
        <section class="modal-card-body">
            <InputText label="Title" v-model="newNode.label"></InputText>
            <Checkbox label="New Node" v-model="createNew" :disabled="!treeNode" />
        </section>
        <footer class="modal-card-foot">
            <Button
                :label="deleteSure ? 'Sure?' : 'Delete'"
                class="mr-auto"
                type="is-danger"
                @click="deleteNode"
            />

            <Button label="Close" class="ml-auto" @click="$emit('close')" />
            <Button label="Save" class="ml-2" @click="save" :disabled="submitDisabled" />
        </footer>
    </div>
</template>

<script>
import { db } from '@/lib/db'

export default {
    props: {
        treeNode: {
            required: true,
        },
    },
    data() {
        return {
            deleteSure: false,
            createNew: false,
            newNode: structuredClone(this.treeNode),
        }
    },
    created() {
        if (!this.newNode) {
            this.newNode = {}
            this.createNew = true
        }
    },
    methods: {
        async save() {
            // await db.dashboards.put(this.dashboardData)
            let emit = 'update'
            if (this.createNew) {
                emit = 'create'
                this.newNode.key = (Math.random() + 1).toString(36).substring(2)
                this.newNode.children = []
            }
            this.$emit(emit, this.newNode)
            this.$emit('close')
        },
        async deleteNode() {
            if (!this.deleteSure) return (this.deleteSure = true)
            // await db.dashboards.delete(this.dashboardData.id)
            this.$emit('close')
            this.deleteSure = false
        },
    },
    watch: {},
    computed: {
        submitDisabled() {
            return false
        },
    },
}
</script>

<style lang="scss"></style>
