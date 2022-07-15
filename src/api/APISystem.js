import request from '../utils/request'

export function getUserList(params){
    return request({
      url: '/user/getUserList',
      method: 'get',
      params: params
    })
}

export function saveUser(data){
    return request({
      url: '/user/saveUser',
      method: 'post',
      data
    })
}

export function deleteUser(params) {
    return request({
        url: '/user/deleteUser',
        method: 'post',
        params
    });
}
