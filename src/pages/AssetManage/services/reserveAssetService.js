import request from '@/utils/request';
import { stringify } from 'qs';

//查询预备资产列表by huan
export async function fetchTableList(params) {
    return request(`${window.config.baseRoute}/sp-assets/api/v1/assetobjectpre`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem("Authorization")
      },
    });
  }
//单个删除by huan
export async function deleteReAssetInfo(params) {
  return request(`${window.config.baseRoute}/sp-assets/api/v1/assetobjectpre/${params}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem("Authorization")
    },
  })
}
//多项删除by huan
export async function deleteMulti(params) {
  return request(`${window.config.baseRoute}/sp-assets/api/v1/assetobjectpre/${params}`, {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem("Authorization")
    },
   // body: params,
  })
}