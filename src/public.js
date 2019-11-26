/*
 * mian.js中引入的公有文件：保存
 */
import Vue from 'vue';
import enumval from './enumval'; // 公共变量 枚举
import globalVariable from './settings.js'; // 公共变量

Vue.prototype.GLOBAL = globalVariable;
Vue.prototype.ENUMVAL = enumval;
