import request from '@/utils/request'

// export function login(data) {
//     return request({
//       url: '/Login',
//       method: 'post',
//       data
//     })
//   }

//登陆
export function login(params) {
    return request({
      url: '/Login',
      method: 'get',
      params: params
    })
  }

  export function getInfo(token) {
    return request({
      url: '/SysUser/GetInfoByToken',
      method: 'get',
      params: { token }
    })
  }


  //现在不考虑
  // 注销   思路 : 后台redis保存这些登出的token ,然后后台拦截上做判断,判断该token是否存在，不存在放行，存在则返回前端
  //redis 还可以保存过期时间，然后过期token 删除，防止token 越来越多 
  export function logout() {
    return request({
      url: '/user/logout',
      method: 'post'
    })
  }