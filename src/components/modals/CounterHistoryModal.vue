<template>
    <div class="counterHistoryModal modal-card" style="width: auto; min-width: 400px">
        <header class="modal-card-head">
            <p>History for Counter: {{ id }}</p>
        </header>
        <section class="modal-card-body">
            <div class="flex items-center justify-between">
                <b-button
                    class="m-1"
                    type="is-primary"
                    icon-right="arrow-left"
                    @click="loadValues()"
                />
                <p>
                    <!-- geil -->
                    {{
                        new Date(
                            new Date().setDate(date.getDate() - DAYS + 1),
                        ).toLocaleDateString('de-DE')
                    }}
                    -
                    {{ date.toLocaleDateString('de-DE') }}
                </p>
                <b-button
                    class="m-1"
                    type="is-primary"
                    icon-right="arrow-right"
                    @click="loadValues(false)"
                />
            </div>
            <div>
                <p v-for="value in values" :key="value">
                    {{ value }}
                </p>
            </div>
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
        id: {
            required: true,
            type: String,
        },
        type: {
            required: true,
            type: String,
        },
    },
    data() {
        return {
            values: [],
            date: new Date(),
            DAYS: 14,
        }
    },
    mounted() {
        this.date.setDate(this.date.getDate() + this.DAYS)
        this.loadValues()
    },
    methods: {
        async loadValues(backwards = true) {
            // https://pbs.twimg.com/media/EyHL52LWYAUJBKh?format=jpg&name=900x900

            this.values = []

            if (backwards) {
                this.date.setDate(this.date.getDate() - this.DAYS)
            } else {
                this.date.setDate(this.date.getDate() + 1)
            }

            let tempDate = new Date(this.date)
            for (let i = 0; i < this.DAYS; i++) {
                let dateString = tempDate.toLocaleDateString('de-DE')
                const state = {
                    type: 'counter',
                    id: this.id,
                    date: dateString,
                }

                const counterState = await db.states.get(state)
                this.values.push(`${dateString}: ${counterState?.count || 'n/a'}`)
                tempDate.setDate(tempDate.getDate() + (backwards ? -1 : 1))
            }

            if (!backwards) {
                this.values.reverse()
                tempDate.setDate(tempDate.getDate() - 1)
                this.date = tempDate
            }
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
