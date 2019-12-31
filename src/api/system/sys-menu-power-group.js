//菜单权限组相关api

import request from '@/utils/request'
var apiF="/SysMenuPowerG";


//获取菜单对应的权限组相关数据
export const getMenuPowerGroups=(menuId)=>{
    return request({
        url:apiF+'/GetMenuPowerGroups',  
        method:'get',
        params:{menuId:menuId,RandomParameter:new Date().getTime()}
      })
}

export const updateMenuPowerGroups=(data)=>{
  return request({
    url: apiF+'/UpdateMenuPowerGroups',
    method: 'post',
    data: data
  });
}
