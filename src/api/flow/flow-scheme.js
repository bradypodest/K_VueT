import request from '@/utils/request'

var apiUrl = "/FlowScheme";

export const updateOne = (data) => {
  return request({
      url: apiUrl + '/Update',
      method: 'post',
      data: data
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
