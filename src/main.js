import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

// import Antd from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.css'
// Vue.use(Antd) //必须放在element 的前面 

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import './public.js';//引入的公有文件,其中是公用方法，全局变量，公用枚举

// import KFormDesign from 'k-form-design'
// //import KFormDesign from 'k-form-design/lib/k-form-design-mini.umd.min'
// import 'k-form-design/lib/k-form-design.css'
// Vue.use(KFormDesign) 

import DialogBox from '@/plug/dialog/dialog_box.js'
Vue.use(DialogBox)

import FormMaking from 'form-making'
import 'form-making/dist/FormMaking.css'

Vue.use(FormMaking)

import EleForm from "vue-ele-form";
import FRender from "f-render";
Vue.use(EleForm);
Vue.component("f-render", FRender);

import '@/components/ef/index.css'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

// set ElementUI lang to EN
//Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
