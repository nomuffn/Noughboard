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
        <b-field label="Content">
            <b-input v-model="input.streamers" type="textarea"></b-input>
        </b-field>
        <div v-if="!twitchAuthenticated">
            <b-button @click="loginTwitch">Login to twitch</b-button>
        </div>
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
    data() {
        return {
            streamers: [],
            twitchAuthenticated: false,
        }
    },
    async mounted() {
        // TODO move logic to lib/twitch.js
        this.twitchAuthenticated = twitch.isAuthenticated()

        if (!this.edit) {
            this.streamers = await twitch.getStreamers(this.input.streamers.split(','))
        }
    },
    methods: {
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