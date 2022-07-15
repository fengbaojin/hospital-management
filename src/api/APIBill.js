import request from '../utils/request'


export function getMenuList(params){
    return request({
      url: '/user/getMenuList',
      method: 'get',
      params: params
    })
}

export function getMenuListByRoleId(params){
  return request({
    url: '/user/getMenuListByRoleId',
    method: 'get',
    params: params
  })
}

export function updateMenu(data){
  return request({
    url: '/user/updateMenu',
    method: 'post',
    data
  })
}

export function addRoleMenu(data){
  return request({
    url: '/user/addRoleMenu',
    method: 'post',
    data
  })
}

