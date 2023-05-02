import { cloneDeep } from 'lodash'

const allBlocks = [
    {
        name: 'Note',
        code: 'text',
    },
    {
        name: 'Tasks',
        code: 'tasks',
    },
    {
        name: 'Twitch Live Feed',
        code: 'twitchFeed',
    },
    {
        name: 'Bookmark',
        code: 'bookmark',
    },
    {
        name: 'Lambda',
        code: 'lambda',
    },
    {
        name: 'Reminder',
        code: 'reminder',
    },
    {
        name: 'Timer',
        code: 'timer',
    },
    {
        name: 'Counter',
        code: 'counter',
    },
]

let components = {}
allBlocks.forEach(async (block) => {
    const blockName = `${block.code}Block`
    console.log({ blockName })
    components[blockName] = () => import(`@/components/blocks/${blockName}`)
})

// always copy the object
const defaultBlock = {
    type: allBlocks[0],
    inputValues: {},
}
function getDefaultBlock() {
    return cloneDeep(defaultBlock)
}

console.log({ components })
export { allBlocks, components, getDefaultBlock }
