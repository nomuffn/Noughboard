<template>
    <div v-if="!edit" class="counterBlock">
        <div class="flex flex-row justify-between">
            <div>
                <p class="font-bold">
                    {{ input.title }}
                </p>
                <p>Count: {{ count }}</p>
            </div>
            <div>
                <b-button
                    class="m-2"
                    type="is-primary"
                    icon-right="plus"
                    @click="add()"
                />
                <b-button
                    class="m-2"
                    type="is-primary"
                    icon-right="minus"
                    @click="add(-1)"
                />
            </div>
        </div>
    </div>
    <div v-else class="counterBlock">
        <b-field label="Title">
            <b-input v-model="input.title"></b-input>
            <!-- <b-input v-model="input.description" type="textarea"></b-input> -->
        </b-field>
        <b-field label="Key">
            <b-input v-model="input.key"></b-input>
            <!-- <b-input v-model="input.description" type="textarea"></b-input> -->
        </b-field>
    </div>
</template>

<script>
import { db } from '@/lib/db'
import slugify from 'slugify'

export default {
    mounted() {
        if (!this.edit) this.load()
    },
    data() {
        return {
            count: 0,
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
    methods: {
        getObject(withCount = true) {
            // only do without Count if you need to get the state
            let date = new Date()
            date.setHours(0, 0, 0, 0)
            const count = withCount ? { count: this.count } : null
            return {
                type: 'counter',
                id: slugify(this.input.key),
                date: date,
                ...count, // lohl
            }
        },
        async load() {
            const counterState = await db.states.get(this.getObject(false))
            if (counterState && !isNaN(counterState.count)) {
                this.count = counterState.count
            }

            // const taskState = await db.tasksState.get(state)
            //     if (taskState) {
            //         await db.tasksState.where(state).delete()
            //     } else {
            //         await db.tasksState.add(state)
            //     }
            //     await db.tasks.update(task.id, { done: !task.done })
        },
        async add(add = 1) {
            this.count += add
            console.log(this.getObject())
            await db.states.put(this.getObject())
            this.load()
        },
    },
}
</script>

<style lang="scss">
.counterBlock {
}
</style>
