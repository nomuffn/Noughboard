export default JSON.stringify({
    formatName: 'dexie',
    formatVersion: 1,
    data: {
        databaseName: 'database',
        databaseVersion: 5,
        tables: [
            { name: 'blocks', schema: '++id', rowCount: 15 },
            { name: 'tasks', schema: '++id', rowCount: 7 },
            { name: 'tasksState', schema: '[taskId+date]', rowCount: 0 },
            { name: 'dashboards', schema: '++id', rowCount: 2 },
            { name: 'states', schema: '[type+id+date]', rowCount: 1 },
        ],
        data: [
            {
                tableName: 'blocks',
                inbound: true,
                rows: [
                    {
                        type: { name: 'Tasks', code: 'tasks' },
                        inputValues: {
                            category: 'Todos',
                            dailyResetTime: 1683410438352,
                            daily: false,
                        },
                        dashboard: 1,
                        x: 8,
                        y: 12,
                        w: 5,
                        h: 8,
                        i: 3,
                        id: 3,
                        moved: false,
                        showScroll: false,
                        $types: { 'inputValues.dailyResetTime': 'date' },
                    },
                    {
                        type: { name: 'Note', code: 'text' },
                        inputValues: {
                            text: '<p><strong>Twitch live feed in case youre following too many people but youre only interested in like 3 rn</strong></p>',
                        },
                        dashboard: 1,
                        x: 13,
                        y: 2,
                        w: 4,
                        h: 3,
                        i: 6,
                        id: 6,
                        moved: false,
                        transparent: true,
                        hideResizeHandle: true,
                        showScroll: false,
                        noPadding: true,
                    },
                    {
                        type: { name: 'Note', code: 'text' },
                        inputValues: {
                            text: '<p>Notes</p><p>More notes</p><p><br></p><p>List</p><ul><li>yup</li><li>yap</li><li>yep</li></ul>',
                        },
                        dashboard: 1,
                        x: 0,
                        y: 7,
                        w: 3,
                        h: 9,
                        i: 7,
                        id: 7,
                        moved: false,
                        transparent: false,
                        hideResizeHandle: false,
                    },
                    {
                        type: { name: 'Note', code: 'text' },
                        inputValues: { text: '<p>lohl</p>' },
                        dashboard: 1,
                        x: 0,
                        y: 16,
                        w: 1,
                        h: 2,
                        i: 10,
                        id: 10,
                        moved: false,
                    },
                    {
                        type: { name: 'Counter', code: 'counter' },
                        inputValues: { title: 'Coffees today', key: 'coffee' },
                        dashboard: 1,
                        x: 3,
                        y: 7,
                        w: 5,
                        h: 3,
                        i: 12,
                        id: 12,
                        moved: false,
                        transparent: false,
                        hideResizeHandle: false,
                    },
                    {
                        type: { name: 'Note', code: 'text' },
                        inputValues: { text: '<p>Random note</p>' },
                        dashboard: 1,
                        x: 13,
                        y: 15,
                        w: 2,
                        h: 2,
                        i: 15,
                        id: 15,
                        moved: false,
                    },
                    {
                        type: { name: 'Twitch Live Feed', code: 'twitchFeed' },
                        inputValues: { streamers: ['39daph', 'lirik', 'CoolingCloset'] },
                        dashboard: 1,
                        x: 13,
                        y: 5,
                        w: 4,
                        h: 10,
                        i: 21,
                        id: 21,
                        moved: false,
                        transparent: false,
                        showScroll: false,
                        $types: { 'inputValues.streamers': 'arrayNonindexKeys' },
                    },
                    {
                        type: { name: 'Note', code: 'text' },
                        inputValues: {
                            text: '<h1>Awesome header!!!</h1>',
                            fullPage: false,
                        },
                        dashboard: 1,
                        x: 0,
                        y: 0,
                        w: 8,
                        h: 2,
                        i: 22,
                        id: 22,
                        moved: false,
                        transparent: true,
                        hideResizeHandle: true,
                        hideScroll: true,
                    },
                    {
                        type: { name: 'Image', code: 'image' },
                        inputValues: {
                            link: 'https://cdnb.artstation.com/p/assets/images/images/062/056/229/large/_z-ed_-da.jpg',
                        },
                        dashboard: 1,
                        x: 8,
                        y: 2,
                        w: 5,
                        h: 10,
                        i: 23,
                        id: 23,
                        moved: false,
                        transparent: true,
                        hideResizeHandle: true,
                    },
                    {
                        type: { name: 'Note', code: 'text' },
                        inputValues: {
                            text: '<h2>Wow what a cool dashboard holy smokes</h2>',
                        },
                        dashboard: 1,
                        x: 8,
                        y: 0,
                        w: 9,
                        h: 2,
                        i: 25,
                        id: 25,
                        moved: false,
                        transparent: true,
                        hideResizeHandle: true,
                    },
                    {
                        type: { name: 'Tasks', code: 'tasks' },
                        inputValues: {
                            dailyResetTime: 1683410448473,
                            category: 'Daily repeating tasks',
                            daily: true,
                        },
                        dashboard: 1,
                        x: 3,
                        y: 10,
                        w: 5,
                        h: 9,
                        i: 26,
                        id: 26,
                        moved: false,
                        $types: { 'inputValues.dailyResetTime': 'date' },
                    },
                    {
                        type: { name: 'Note', code: 'text' },
                        inputValues: {
                            text: '<p><a href="https://en.wikipedia.org/wiki/Defenestration" rel="noopener noreferrer" target="_blank">https://en.wikipedia.org/wiki/Defenestration</a></p>',
                        },
                        dashboard: 1,
                        x: 3,
                        y: 19,
                        w: 5,
                        h: 2,
                        i: 27,
                        id: 27,
                        moved: false,
                    },
                    {
                        type: { name: 'Note', code: 'text' },
                        inputValues: {
                            text: '<p><strong>Right click blocks to edit them</strong></p><p><br></p><p><strong>Privacy :O</strong></p><p>Everything is only saved in your browsers database and never ever sent anywhere. Check network tab in dev tools if you wanna make sure.</p>',
                        },
                        dashboard: 1,
                        x: 0,
                        y: 2,
                        w: 8,
                        h: 5,
                        i: 28,
                        id: 28,
                        moved: false,
                        showScroll: false,
                    },
                    {
                        type: { name: 'Note', code: 'text' },
                        inputValues: {
                            text: '<p>Create as many dashboards as you need for different projects or topics</p>',
                        },
                        dashboard: 4,
                        x: 6,
                        y: 0,
                        w: 6,
                        h: 4,
                        i: 29,
                        id: 29,
                        moved: false,
                    },
                    {
                        type: { name: 'Lambda', code: 'lambda' },
                        inputValues: {
                            dailyResetTime: 1683410410540,
                            lambda: 'const exampleDate = new Date()\n\nreturn `\n<p>Javascript code that is ran periodically.</p>\n<p>Could do whatever you need. Like fetching the latest votes on your beatsaver maps for example :)))</p>\n</br>\n<p style=\\"font-weight: bold\\" >Date</p>\n<p>${exampleDate}</p>`',
                            repeat: 5,
                        },
                        dashboard: 1,
                        x: 8,
                        y: 20,
                        w: 5,
                        h: 6,
                        i: 30,
                        id: 30,
                        moved: false,
                        $types: { 'inputValues.dailyResetTime': 'date' },
                    },
                ],
            },
            {
                tableName: 'tasks',
                inbound: true,
                rows: [
                    {
                        category: 'todos',
                        content: 'Do your mum lohl',
                        details: '',
                        id: 28,
                        index: 0,
                    },
                    {
                        category: 'todos',
                        content: 'Cleaning (lohl)',
                        details: 'the task that will never be completed',
                        id: 29,
                        index: 1,
                    },
                    {
                        category: 'todos',
                        content: 'A finished task :O',
                        details: '',
                        id: 30,
                        done: true,
                    },
                    {
                        category: 'todos',
                        content: 'drag me to the top',
                        details: '',
                        id: 31,
                        index: 2,
                    },
                    {
                        category: 'daily repeating tasks',
                        content: 'Clean the kitchen',
                        details: '',
                        id: 32,
                    },
                    {
                        category: 'daily repeating tasks',
                        content: 'Pray to muffbert',
                        details: '',
                        id: 33,
                    },
                    {
                        category: 'daily repeating tasks',
                        content: 'Defenestrate someone',
                        details: '',
                        id: 34,
                    },
                ],
            },
            { tableName: 'tasksState', inbound: true, rows: [] },
            {
                tableName: 'dashboards',
                inbound: true,
                rows: [
                    { title: 'Home', id: 1, verticalCompact: true },
                    {
                        title: 'Another :O',
                        id: 4,
                        verticalCompact: false,
                        icon: 'muffin',
                    },
                ],
            },
            {
                tableName: 'states',
                inbound: true,
                rows: [{ type: 'dailytask', id: 33, date: '7.5.2023' }],
            },
        ],
    },
})
