/*
 * mian.js中引入的公有文件：保存
 * Karl
 */
import Vue from 'vue';
import enumval from './enumval'; // 公共变量 枚举
import globalVariable from './settings.js'; // 公共变量
import publicTool from './utils/common';//公用工具方法
import ipAddress from './utils/request';//公用基础IP

Vue.prototype.GLOBAL = globalVariable;
Vue.prototype.ENUMVAL = enumval;
Vue.prototype.PUBLICTOOL=publicTool;
Vue.prototype.IPADDRESS=ipAddress;