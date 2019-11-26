/*
 *@functionName:enumAddFn
 *@description:添加枚举项，调用方法this.$enumAddFn('Triages.EArea',{'0':'全部','1':'无'})
 *@author:chenqr
 *@params1:对应枚举的类型值
 *@params2:添加的枚举（不存在则默认添加全部）
 *@return:添加后的新枚举
 *@date:2019-11-07 11:52:21
 */
import enumval from '.';
import Vue from 'vue';
import { IsVarType } from 'js/validata';
Vue.prototype.$enumAddFn = function(enumtype, addData) {
    const enumObj = enumval[enumtype];
    const assignEnum = addObj(enumObj, addData);
    return assignEnum;
};
/*
 *@functionName:addObj
 *@description:添加项
 *@author:chenqr
 *@params1:被添加的数组或对象
 *@params2:添加的项
 *@return:添加后的数组或对象
 *@date:2019-11-21 10:50:04
 */
function addObj(val, addData) {
    let assignVal;
    if (IsVarType(val, 'Array')) {
        if (!addData) {
            addData = [{ key: '0', value: '全部' }];
        }
        assignVal = addData.concat(val);
    } else {
        if (!addData) {
            addData = { '0': '全部' };
        }
        assignVal = Object.assign({}, addData, val);
    }
    return assignVal;
}
/*
 *@functionName:enumArray
 *@description:转为数组this.$enumArray('Triages.EArea')
 *@author:lizy
 *@params1:对应枚举的类型值
 *@params2:数组是否反向排序（1：反向）
 *@return:
 *@date:2019-11-18 11:10:31
 */
Vue.prototype.$enumArray = function(enumtype, reverse) {
    const obj = enumval[enumtype];
    const arr = objChangeArr(obj, reverse);
    return arr;
};
/*
 *@functionName:objChangeArr
 *@description:枚举对象转换数组
 *@author:chenqr
 *@params1:枚举对象
 *@params2:数组是否反向排序（1：反向）
 *@return:枚举数组
 *@date:2019-11-21 10:50:04
 */
function objChangeArr(obj, reverse) {
    const objArr = Object.keys(obj);
    const arr = [];
    if (reverse === 1) {
        objArr.reverse();
    }
    objArr.forEach(key => {
        const o = {};
        o['key'] = key;
        o['value'] = obj[key];
        arr.push(o);
    });
    return arr;
}
/*
 *@functionName:enumAddArr
 *@description:添加枚举项并返回数组this.$enumAddArr('Triages.EArea',{'0':'全部','1':'无'})
 *@author:chenqr
 *@params1:对应枚举的类型值
 *@params2:添加的枚举（不存在则默认添加全部）
 *@params3:数组是否反向排序（1：反向）
 *@return:返回添加项后的数组
 *@date:2019-11-21 11:10:31
 */
Vue.prototype.$enumAddArr = function(enumtype, addData, reverse) {
    const obj = enumval[enumtype];
    const objArr = objChangeArr(obj, reverse);
    const assignObj = addObj(objArr, addData);
    return assignObj;
};
