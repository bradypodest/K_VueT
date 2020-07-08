///进入路由判断 （其中判断token）

import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist//白名单，就是不需要登陆的

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  debugger;
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      //await store.dispatch('sysUser/getInfo')

      next({ path: '/' })
      NProgress.done()
    } else {
      //获取当前用户名
      debugger;
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {//单页面 当前路由地址变化
        //await store.dispatch('sysUser/getInfo')

        next()
      } else {//刷新时，没有vuex内容了
        try {
          // get user info   用于 页面显示用户信息
          await store.dispatch('sysUser/getInfo')

          //通过token来获取对应的路由设置 ：执行 store/modules中的方法
          const accessRoutes = await store.dispatch('sysMenu/getUserMenu', hasToken)

          console.log(accessRoutes);
          router.addRoutes(accessRoutes);//动态添加路由

          //获取权限设置

          next({ ...to, replace: true });

        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('sysUser/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }

      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly   //在免费登录白名单中，直接进入
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})







