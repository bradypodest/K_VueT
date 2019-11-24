import request from '@/utils/request'

//新增
export const addOne=(data)=>{
    return request({
        url: '/SysMenu/Add',
        method: 'post',
        data: data
      })
};

// export function addOne2(data) {
//     return request({
//       url: '/SysMenu/Add',
//       method: 'post',
//       data: data
//     })
//   }

export const getPageData=(data)=>{
    return request({
        url: '/SysMenu/GetPageData',
        method: 'post',
        data: data
      })
}

export const delOne=(ID)=>{
  return request({
    url:'/SysMenu/Delete',  
    method:'get',
    params:{id:ID}
  })
}

export const getOneByID=(ID)=>{
  return request({
    url:'/SysMenu/GetOneByID',  
    method:'get',
    params:{id:ID}
  })
}

export const updateOne=(data)=>{
  return request({
    url: '/SysMenu/Update',
    method: 'post',
    data: data
  })
}

export const getMenuTree=(parentId)=>{
  return request({
    url: '/SysMenu/GetMenuTree',
    method: 'get',
    params: {parentId:parentId}
  })
}