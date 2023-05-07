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
        name: 'Counter',
        code: 'counter',
    },
    {
        name: 'Lambda',
        code: 'lambda',
    },
    {
        name: 'Image',
        code: 'image',
    },
    {
        name: 'Diary (WIP, like counter?)',
        code: 'diary',
    },
    {
        name: 'Bookmark (WIP)',
        code: 'bookmark',
    },
    {
        name: 'Reminder (WIP)',
        code: 'reminder',
    },
    {
        name: 'Timer (WIP)',
        code: 'timer',
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
