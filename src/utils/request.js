// 封装axios
import axios from 'axios'
import { MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

var isLoading = true;// 是否开启遮罩有关

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})
let ipAddress=service.defaults.baseURL;
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    startLoading();// 开启遮罩
    if (config.method === 'post') {
      //config.data =qs.stringify(config.data);
      console.log('post拦截：' + config.data);
    }

    // 判断是否有token ,有则加token 到头中
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      //config.headers['X-Token'] = getToken()
      // config.headers['Bearer '] = getToken()
      config.headers.Authorization="Bearer "+getToken()
    }
    return config
  },
  error => {
    endLoading();// 关闭遮罩

    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    endLoading();

    const res = response.data
     // if the custom code is not 20000, it is judged as an error.
    if (res.code==20000) {
      return res;
    } else {//其他的都是错误请求  ，可以在 try catch获取
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000,
          showClose: true,
        })


        //以后替换
        // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
          // to re-login
          MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
        }

        return Promise.reject(new Error(res.msg || 'Error'))
    }

  },
  error => {
    endLoading();

    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
      showClose: true,
    })
    return Promise.reject(error)
  }
)

// 遮罩  Start
let loadingC;
function startLoading() {    // 使用Element loading-start 方法

  if (isLoading) {
    loadingC = Loading.service({
      lock: true,
      text: '拼命加载中...',
      background: 'rgba(255,255,255,0)',
    })
  }

}

function endLoading() {    // 使用Element loading-close 方法

  if (isLoading) {
    loadingC.close()
  }
}
// 遮罩 end

export default {service,ipAddress}
