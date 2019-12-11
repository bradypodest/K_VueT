import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
//import user from './modules/user'
import sysUser from './modules/system/sys-user'
import sysMenu from './modules/system/sys-menu'

import tagsView from './modules/tagsView'

Vue.use(Vuex)

const store = new Vuex.Store({
  //将各个状态单独管理 ：modules
  modules: {
    app,
    settings,
    //user,
    sysUser,
    sysMenu,

    tagsView,
  },
  getters//vuex是单页面的 缓存只是保存在单页面  除了一些默认赋值，cookie可有值   可采用 其他方式保存数据，如localstorage、sessionstorage或cookie中   https://www.cnblogs.com/chenhuichao/p/11359097.html
})

//vuex 范例
// const store = new Vuex.Store({
//   // 初始化的数据
//   state: {
//     formDatas: null//定义一个变量 formDatas
//   },
//   // 改变state里面的值得方法
//   mutations: {
//     getFormData(state, data) {
//       state.formDatas = data;
//     }
//   }
// });

// 输出模块
export default store
