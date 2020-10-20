import request from '@/utils/request'

var apiUrl = "/SysDictionary";

export const GetDictionary = (data) => {
  return request({
      url: apiUrl + '/GetDictionary',
      method: 'post',
      data: data
  })
}
