import App from '@/main'

let twitch = {}

const TWITCH_TOKEN = 'twitchToken'
const TWITCH_USERDATA = 'twitchUserData'

twitch.isAuthenticated = () => {
    return localStorage.getItem(TWITCH_TOKEN) && localStorage.getItem(TWITCH_USERDATA)
        ? true
        : false
}

twitch.login = () => {
    window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=vw28o8a3angs5e66bowr9zqqcji9dv&redirect_uri=${location.origin}&response_type=token&scope=user:read:follows`
}

twitch.handleToken = async (callback = null) => {
    if (
        localStorage.getItem(TWITCH_TOKEN) == 'null' ||
        localStorage.getItem(TWITCH_USERDATA) == 'null'
    )
        twitch.reset()

    if (App.$route.query?.access_token) {
        localStorage.setItem(TWITCH_TOKEN, `Bearer ${App.$route.query.access_token}`)
        const twitchUserData = await App.axios.get('https://api.twitch.tv/helix/users', {
            headers: {
                Authorization: localStorage.getItem(TWITCH_TOKEN),
                'Client-Id': 'vw28o8a3angs5e66bowr9zqqcji9dv',
            },
        })
        if (twitchUserData?.data?.data.length == 1) {
            localStorage.setItem(
                TWITCH_USERDATA,
                JSON.stringify(twitchUserData.data.data[0]),
            )
        }
        App.$router.replace('/')
        if (callback) callback()
    }
}

twitch.reset = () => {
    localStorage.removeItem(TWITCH_TOKEN)
    localStorage.removeItem(TWITCH_USERDATA)
}

twitch.getStreamers = async (streamersArray) => {
    // TODO caps at 100, implement pagination?
    // TODO clean up axios calls
    if (!streamersArray.length) return []

    try {
        const userData = JSON.parse(localStorage.getItem(TWITCH_USERDATA))
        let followedStreamers = await App.axios.get(
            `https://api.twitch.tv/helix/streams/followed?user_id=${userData.id}`,
            {
                headers: {
                    Authorization: localStorage.getItem(TWITCH_TOKEN),
                    'Client-Id': 'vw28o8a3angs5e66bowr9zqqcji9dv',
                },
            },
        )

        // filter by given streamers, lowercased
        let streamers = followedStreamers.data.data.filter((streamer) => {
            return streamersArray.find(
                (string) => string.toLowerCase() == streamer.user_name.toLowerCase(),
            )
        })

        // extract ids
        const streamerIds = streamers.map((item) => item.user_id)

        if (streamerIds.length > 0) {
            // get data for ids
            let streamersInfo = await App.axios.get(
                `https://api.twitch.tv/helix/users?id=${streamerIds.join('&id=')}`,
                {
                    headers: {
                        Authorization: localStorage.getItem(TWITCH_TOKEN),
                        'Client-Id': 'vw28o8a3angs5e66bowr9zqqcji9dv',
                    },
                },
            )
            return streamers.map((streamer) => {
                return {
                    ...streamer,
                    ...streamersInfo.data.data.find(
                        (item) => item.login == streamer.user_login,
                    ),
                }
            })
        } else {
            return []
        }
    } catch (e) {
        twitch.reset()
    }
}

export default twitch
