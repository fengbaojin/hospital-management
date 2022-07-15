import request from '../utils/request'

export function getAllMenu(params){
    return request({
      url: '/user/getAllMenu',
      method: 'get',
      params: params
    })
}
export function getPidMenu(){
  return request({
    url: '/user/getPidMenu',
    method: 'get'
  })
}

export function addMenu(data){
  return request({
    url: '/user/addMenu',
    method: 'post',
    data
  })
}
  