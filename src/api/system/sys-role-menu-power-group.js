//角色-菜单权限组相关api

import request from '@/utils/request'
var apiF="/SysRoleMenuPowerG";


//获取角色-菜单-对应的权限组相关数据
export const getRoleMenuPowerGroups=(menuId)=>{
    return request({
        url:apiF+'/GetMenuPowerGroups',  
        method:'get',
        params:{menuId:menuId,RandomParameter:new Date().getTime()}
      })
}

export const updateRoleMenuPowerG=(data)=>{
  return request({
    url: apiF+'/UpdateRoleMenuPowerG',
    method: 'post',
    data: data
  });
}