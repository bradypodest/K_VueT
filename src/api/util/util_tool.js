import request from '@/utils/request'

var apiUrl = "/UtilTool";

export const GetLocalData = (ID) => {
    debugger;
    return request({
        url: apiUrl + '/GetLocalData',
        method: 'get',
        params: { RandomParameter:new Date().getTime() }
    })
}

export const GetLocalDataTime = (ID) => {
  debugger;
  return request({
      url: apiUrl + '/GetLocalDataTime',
      method: 'get',
      params: { RandomParameter:new Date().getTime() }
  })
}

