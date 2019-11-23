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