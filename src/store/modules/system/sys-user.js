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
    avatar: ''//头像
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
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { UserName, HeadPicUrl } = data

        commit('SET_NAME', UserName)
        commit('SET_avatar', HeadPicUrl)
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
    })
  }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

