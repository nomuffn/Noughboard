import Dexie from 'dexie'

export const db = new Dexie('database')

db.version(1).stores({
    blocks: '++id', // Primary key and indexed props
    tasks: '++id',
    tasksState: '++id',
})

db.version(2).stores({
    blocks: '++id',
    tasks: '++id',
    tasksState: '[taskId+date]',
})

db.version(3).stores({
    blocks: '++id',
    dashboards: '++id',
    tasks: '++id',
    tasksState: '[taskId+date]',
})

db.version(4).stores({
    blocks: '++id',
    dashboards: '++id',
    tasks: '++id',
    tasksState: '[taskId+date]',
    states: '[type+id+date]',
})

export function getBlock(index) {
    return db.blocks.toArray()
}
