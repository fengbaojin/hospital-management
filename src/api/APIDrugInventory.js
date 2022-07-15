import request from '../utils/request'


export function listDrugRecordPage(params){
    return request({
      url: '/drugInventory/listDrugRecordPage',
      method: 'get',
      params: params
    })
}

export function insetDrugWareHouse(data){
    return request({
      url: '/drugInventory/insetDrugWareHouse',
      method: 'post',
      data
    })
}


export function listDrugPage(params){
  return request({
    url: '/drugInventory/listDrugPage',
    method: 'get',
    params: params
  })
}

export function updateDrug(data){
  return request({
    url: '/drugInventory/updateDrug',
    method: 'post',
    data
  })
}

export function getDrugNoteList(params){
  return request({
    url: '/drugInventory/getDrugNoteList',
    method: 'get',
    params: params
  })
}

export function listDrugSaleRecordPage(params){
  return request({
    url: '/drugInventory/listDrugSaleRecordPage',
    method: 'get',
    params: params
  })
}

export function saleOfDrugs(data){
  return request({
    url: '/drugInventory/saleOfDrugs',
    method: 'post',
    data
  })
}

export function getDrugByName(){
  return request({
    url: '/drugInventory/getDrugByName',
    method: 'get'
  })
}

export function getTurnoverByLastThirtyDay(params){
  return request({
    url: '/drugInventory/getTurnoverByLastThirtyDay',
    method: 'get',
    params: params
  })
}

export function getTurnoverByEveryMonth(params){
  return request({
    url: '/drugInventory/getTurnoverByEveryMonth',
    method: 'get',
    params: params
  })
}

export function getRankingByEveryMonth(params){
  return request({
    url: '/drugInventory/getRankingByEveryMonth',
    method: 'get',
    params: params
  })
}

export function getSalesVolumeByName(params){
  return request({
    url: '/drugInventory/getSalesVolumeByName',
    method: 'get',
    params: params
  })
}

export function getAmountByName(params){
  return request({
    url: '/drugInventory/getAmountByName',
    method: 'get',
    params: params
  })
}

export function getSaleByName(params){
  return request({
    url: '/drugInventory/getSaleByName',
    method: 'get',
    params: params
  })
}

export function updateSellingPrice(data){
  return request({
    url: '/drugInventory/updateSellingPrice',
    method: 'post',
    data
  })
}


export function getNoSellingPrice(){
  return request({
    url: '/drugInventory/getNoSellingPrice',
    method: 'get'
  })
}

export function batchSellingPrice(data){
  return request({
    url: '/drugInventory/batchSellingPrice',
    method: 'post',
    data
  })
}

export function importStore(data){
  return request({
    url: '/drugInventory/importStore',
    method: 'post',
    data
  })
}