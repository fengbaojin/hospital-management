import request from '../utils/request'

export function getRoleList(){
    return request({
      url: '/user/getRoleList',
      method: 'get'
    })
}

export function getRoleListPage(params){
  return request({
    url: '/user/getRoleListPage',
    method: 'get',
    params: params
  })
}