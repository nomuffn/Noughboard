<template>
    <div class="newTaskModal modal-card" style="width: auto; min-width: 400px">
        <header class="modal-card-head">
            <p class="modal-card-title">
                {{ isNew ? `Edit Dashboard` : 'Create new Dashboard' }}
            </p>
        </header>
        <section class="modal-card-body">
            <b-field label="Title">
                <b-input v-model="dashboardData.title"></b-input>
            </b-field>
            <b-checkbox v-model="dashboardData.verticalCompact"
                >Vertically compact</b-checkbox
            >
        </section>
        <footer class="modal-card-foot">
            <b-button 
            v-if="isNew" 
            :label="deleteSure ? 'Sure?' : 'Delete'"
            class="mr-auto"
            type="is-danger"
            @click="deleteDb" />

            <b-button label="Close" @click="$emit('close')" />
            <b-button
                label="Save"
                @click="save"
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
        dashboard: {
            required: false,
            default: {},
        },
    },
    data() {
        return {
            deleteSure: false,
            dashboardData: { ...this.dashboard },
        }
    },
    mounted() {
        console.log(this.dashboard)
    },
    methods: {
        async save() {
            await db.dashboards.put(this.dashboardData)
            this.$emit("close")
        },
        async deleteDb() {
            if (!this.deleteSure) return (this.deleteSure = true)
            await db.dashboards.delete(this.dashboardData.id)
            this.$emit('close')
            this.deleteSure = false
        }
    },
    watch: {},
    computed: {
        submitDisabled() {
            return !this.dashboardData?.title?.length
        },
        isNew() {
            return this.dashboardData.id >= 0
        }
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
