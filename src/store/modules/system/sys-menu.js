// 初始化数据
const state = {
    sys_menu_routers:[],
}

// 改变state 中的值的方法
const mutations = {
    SET_SYS_MENU_ROUTERS: (state, sys_menu_routers) => {
        state.sys_menu_routers = sys_menu_routers
    },
}

const actions = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
