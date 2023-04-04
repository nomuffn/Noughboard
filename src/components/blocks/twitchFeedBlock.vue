<template>
    <div v-if="!edit" class="twitchFeedBlock">
        <div class="flex flex-col">
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
    <div v-else>
        <b-field label="Content">
            <b-input v-model="input.streamers" type="textarea"></b-input>
        </b-field>
    </div>
</template>

<script>
// implement tiptap

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
        }
    },
    async mounted() {
        // TODO move logic to lib/twitch.js
        if (!localStorage.getItem('twitchToken')) {
            window.location.href =
                'https://id.twitch.tv/oauth2/authorize?client_id=vw28o8a3angs5e66bowr9zqqcji9dv&redirect_uri=http://localhost:8086&response_type=token&scope=user:read:follows'
        }

        if (!this.edit) {
            // TODO caps at 100, implement pagination?
            // TODO clean up axios calls
            const twitchUserData = JSON.parse(localStorage.getItem('twitchUserData'))
            let data = await this.axios.get(
                `https://api.twitch.tv/helix/streams/followed?user_id=${twitchUserData.id}`,
                {
                    headers: {
                        Authorization: localStorage.getItem('twitchToken'),
                        'Client-Id': 'vw28o8a3angs5e66bowr9zqqcji9dv',
                    },
                },
            )
            let streamers = data.data.data.filter((streamer) => {
                return this.input.streamers
                    .split(',')
                    .find(
                        (string) =>
                            string.toLowerCase() == streamer.user_name.toLowerCase(),
                    )
            })

            const streamerIds = streamers.map((item) => item.user_id)

            data = await this.axios.get(
                `https://api.twitch.tv/helix/users?id=${streamerIds.join('&id=')}`,
                {
                    headers: {
                        Authorization: localStorage.getItem('twitchToken'),
                        'Client-Id': 'vw28o8a3angs5e66bowr9zqqcji9dv',
                    },
                },
            )
            this.streamers = streamers.map((streamer) => {
                return {
                    ...streamer,
                    ...data.data.data.find((item) => item.login == streamer.user_login),
                }
            })
            console.log(this.streamers)
        }
    },
    methods: {
        hoursAgo(date) {
            return (
                Math.round(Math.abs((Date.now() - Date.parse(date)) / 36e5), 3) + ' hrs'
            )
        },
    },
}
</script>

<style lang="scss"></style>
