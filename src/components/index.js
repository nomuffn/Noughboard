import Vue from 'vue'

function asyncComponent(path, name = null) {
    if (!name) name = path.split('/').pop()
    Vue.component(name, () => import(`@/components/${path}.vue`))
}

asyncComponent('basic/Checkbox')
asyncComponent('basic/InputText')
asyncComponent('basic/TimePicker')
asyncComponent('modals/EditBlockModal')
asyncComponent('modals/NewTaskModal')
asyncComponent('BlocksWrapper')
asyncComponent('TasksViewer')
asyncComponent('ListInput')
