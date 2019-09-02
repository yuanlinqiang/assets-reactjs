import request from '@/utils/request';
import { stringify } from 'qs';



export  async function queryAssetTypeTable(params) {
    //todo edit entrypoint
    return request(`${window.config.baseRoute}/sp-assets/api/v1/assettypes/trees`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Authorization'),
        },
    });
}
export  async function queryAssetType(params) {
    //todo edit entrypoint
    return request(`${window.config.baseRoute}/sp-assets/api/v1/assettypes/typesfortree?${stringify(params)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Authorization'),
        },
    });
}
export  async function queryAssetTypeParent(params) {
    //todo edit entrypoint
    return request(`${window.config.baseRoute}/sp-assets/api/v1/assettypes/parenttypes?${stringify(params)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Authorization'),
        },
    });
}

export  async function removeAssetType(params) {
    return request(`${window.config.baseRoute}/sp-assets/api/v1/assettypes/${params}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Authorization'),
        },
    });
}
//多项删除
export  async function removeAssetTypeByList(params) {
    //return request(`${window.config.baseRoute}/sp-assets/api/v1/assettypes/deletemulti`, {
        return request(`${window.config.baseRoute}/sp-assets/api/v1/assettypes/${params}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem("Authorization")
        },
        body: params,
    });
}
export  async function addAssetType(params) {
    console.log('新增资产类型 =============:', params);
    return request(`${window.config.baseRoute}/sp-assets/api/v1/assettypes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Authorization'),
        },
        body: {
            ...params,
        },
    });
}
export  async function updateAssetType(params) {
    console.log('修改的參數 :', params);
    return request(`${window.config.baseRoute}/sp-assets/api/v1/assettypes/${params.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Authorization'),
        },
        body: {
            ...params,
        },
    });
}
export async function getByParam(params) {
    return request(`${window.config.baseRoute}/sp-assets/api/v1/assettypes/${params}`,{
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('Authorization'),
      },
    });
  }