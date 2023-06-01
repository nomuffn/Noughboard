<template>
    <div v-if="!edit" class="twitchFeedBlock">
        <div v-if="!twitchAuthenticated">
            <p>Twitch not authenticated</p>
        </div>
        <div v-else class="flex flex-col">
            <div v-if="!streamers.length">
                <p>No streamers live :(</p>
            </div>
            <div v-else>
                <div v-for="streamer in streamers" :key="streamer.id" class="my-2">
                    <div class="flex">
                        <img
                            :src="streamer.profile_image_url"
                            class="mr-4 h-16 rounded-full object-contain"
                        />
                        <div class="flex-grow min-w-0">
                            <strong>{{
                                streamer.display_name +
                                ' - ' +
                                streamer.viewer_count.toLocaleString() +
                                ' 🙍‍♂️' +
                                ' - ' +
                                hoursAgo(streamer.started_at)
                            }}</strong>
                            <p class="truncate">
                                {{ streamer.title.substring(0, 50) }}
                            </p>
                            <p>{{ streamer.game_name }}</p>
                        </div>
                    </div>

                    <!-- <img
                    :src="streamer.thumbnail_url.replace('{width}x{height}', '320x180')"
                /> -->
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <div v-if="!twitchAuthenticated">
            <Button @click="loginTwitch">Login to twitch</Button>
        </div>
        <p class="mt-2" label="Add streamer by pressing enter">
            <ListInput v-model="editStreamers" />
        </p>
    </div>
</template>

<script>
// implement tiptap
import twitch from '@/lib/twitch'

export default {
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
    timers: {
        loadStreamers: {
            time: 1000 * 60 * 15, // every 15 minutes
            repeat: true,
            immediate: true,
        },
    },
    data() {
        return {
            streamers: [],
            twitchAuthenticated: false,
            editStreamers: [],
        }
    },
    watch: {
        editStreamers(newval, oldval) {
            this.input.streamers = this.editStreamers
        },
    },
    async mounted() {
        this.editStreamers = this.input.streamers || []

        // TODO move logic to lib/twitch.js
        this.twitchAuthenticated = twitch.isAuthenticated()

        if (!this.edit) {
            this.$timer.start('loadStreamers')
        }
    },
    methods: {
        async loadStreamers() {
            // show timer counting down until next refresh
            if (this.twitchAuthenticated) {
                this.streamers = await twitch.getStreamers(this.input.streamers)
            }
        },
        hoursAgo(date) {
            return (
                Math.round(Math.abs((Date.now() - Date.parse(date)) / 36e5), 3) + ' hrs'
            )
        },
        loginTwitch() {
            twitch.login()
        },
    },
}
</script>

<style lang="scss"></style>
