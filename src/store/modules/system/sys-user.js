/*
    sysUser  store
*/

import { login,getInfo} from '@/api/system/sys-user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'


// 初始化数据
const state = {
    token: getToken(),
    name: '',
    avatar: '',//头像
    roleId: ''//角色
}


// 改变state 中的值的方法
const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_avatar: (state, avatar) => {
        state.avatar = avatar
    },

    SET_RoleId: (state, roleId) => {
        state.roleId = roleId
    }
}

const actions = {
    // user login
    login({ commit }, userInfo) {
        const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            login({ username: username.trim(), password: password }).then(response => {
                const { data } = response
                commit('SET_TOKEN', data.token)//保存dao vuex
                setToken(data.token)//保存到cook
                resolve()
            }).catch(error => {
                reject(error)
            })
        })

    },

    // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
    
      var cookieToken=getToken();  
      if(!cookieToken) reject('Verification failed, please Login again.')
      
      //getInfo(state.token).then(response => {
       getInfo(cookieToken).then(response => {
        const { data } = response
        console.log("获取用户信息:")
        console.log(response);
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { UserName, HeadPicUrl,RoleId } = data

        commit('SET_NAME', UserName)
        commit('SET_avatar', HeadPicUrl)
        commit('SET_RoleId', RoleId)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    commit('SET_TOKEN', '')
    removeToken()
    resetRouter()

    dispatch('tagsView/delAllViews', null, { root: true })
    // return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     commit('SET_TOKEN', '')
    //     removeToken()
    //     resetRouter()
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resetRouter()
      resolve()

      //重置store sysUser里面的name,  就可以在permission.js中当前路由地址变化还是刷新页面了
      //commit('SET_NAME', '')
    })
  }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

