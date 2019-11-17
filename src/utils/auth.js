/*
  tokne  存放、删除与cookies有关（认证相关信息）
*/


import Cookies from 'js-cookie'

const TokenKey = 'K_VUE_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
