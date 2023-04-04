import Dexie from 'dexie'

export const db = new Dexie('database')

db.version(1).stores({
    blocks: '++id', // Primary key and indexed props
})

db.version(2).stores({
    blocks: '++id', // Primary key and indexed props
    tasks: '++id', // Primary key and indexed props
})

db.version(3).stores({
    blocks: '++id', // Primary key and indexed props
    tasks: '++id, category',
})

export function getBlock(index) {
    return db.blocks.toArray()
}
