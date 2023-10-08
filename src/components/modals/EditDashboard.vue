<template>
    <div class="newTaskModal modal-card" style="width: auto; min-width: 400px">
        <header class="modal-card-head">
            <p class="modal-card-title">
                {{ isNew ? `Edit Dashboard` : 'Create new Dashboard' }}
            </p>
        </header>
        <section class="modal-card-body">
            <InputText label="Title" v-model="dashboardData.title"></InputText>
            <InputText
                label="Icon key (https://pictogrammers.com/library/mdi/)"
                v-model="dashboardData.icon"
            ></InputText>
            <Checkbox
                label="Vertically compact"
                v-model="dashboardData.verticalCompact"
            />
            <Checkbox label="Enable tree (WIP)" v-model="dashboardData.useTree" />
            <Checkbox label="Encrypted" v-model="dashboardData.encrypt" />
        </section>
        <footer class="modal-card-foot">
            <Button
                v-if="isNew"
                :label="deleteSure ? 'Sure?' : 'Delete'"
                class="mr-auto"
                type="is-danger"
                @click="deleteDb"
            />

            <Button label="Close" class="ml-auto" @click="$emit('close')" />
            <Button label="Save" class="ml-2" @click="save" :disabled="submitDisabled" />
        </footer>
    </div>
</template>

<script>
import { db } from '@/lib/db'
import { decrypt } from '@/lib/encrypt'

export default {
    props: {
        dashboard: {
            required: false,
            default: {},
        },
        decryptionPass: {},
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
            // decrypt blocks
            if (this.dashboardData.encrypt != this.dashboard.encrypt) {
                let blocks = await db.blocks
                    .filter((block) => block.dashboard == this.dashboard.id)
                    .toArray()
                blocks = blocks.filter((block) => {
                    return typeof block.inputValues === 'string' // dont use instanceof
                })
                blocks.forEach(async (block) => {
                    block.inputValues = decrypt(block.inputValues, this.decryptionPass)
                    await db.blocks.put(block)
                })
                this.$emit('decrypt')
            }

            await db.dashboards.put(this.dashboardData)
            this.$emit('close')
        },
        async deleteDb() {
            if (!this.deleteSure) return (this.deleteSure = true)
            await db.dashboards.delete(this.dashboardData.id)
            this.$emit('close')
            this.deleteSure = false
        },
    },
    watch: {},
    computed: {
        submitDisabled() {
            return !this.dashboardData?.title?.length
        },
        isNew() {
            return this.dashboardData.id >= 0
        },
    },
}
</script>

<style lang="scss"></style>
