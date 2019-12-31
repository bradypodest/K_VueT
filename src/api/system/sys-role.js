import request from '@/utils/request'

var apiUrl = "/SysRole";

//新增
export const addOne = (data) => {
    return request({
        url: apiUrl + '/Add',
        method: 'post',
        data: data
    })
};

export const getPageData = (data) => {
    return request({
        url: apiUrl + '/GetPageData',
        method: 'post',
        data: data
    })
}

export const delOne = (ID) => {
    return request({
        url: apiUrl + '/Delete',
        method: 'get',
        params: { id: ID }
    })
}

export const getOneByID = (ID) => {
    debugger;
    return request({
        url: apiUrl + '/GetOneByID',
        method: 'get',
        params: { id: ID,RandomParameter:new Date().getTime() }
    })
}

export const updateOne = (data) => {
    return request({
        url: apiUrl + '/Update',
        method: 'post',
        data: data
    })
}

