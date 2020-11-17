import request from '@/utils/request'

var apiUrl = "/FlowInstance";

//发起流程
export const AddInstance = (data) => {
  return request({
      url: apiUrl + '/AddInstance',
      method: 'post',
      data: data
  })
};
