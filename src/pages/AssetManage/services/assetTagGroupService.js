import request from '@/utils/request';
import { stringify } from 'qs';
//标签组的数据查询
export  async function queryAssetTagGroup(params) {
    return request(`${window.config.baseRoute}/sp-assets/api/v1/assettaggroups`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem("Authorization")
        },
    });
}
//标签组的数据单项删除
export  async function removeAssetTagGroup(params) {
    return request(`${window.config.baseRoute}/sp-assets/api/v1/assettaggroups/${params}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem("Authorization")
        },
    });
}
//标签的数据单项删除
export  async function removeAssetTag(params) {
    return request(`${window.config.baseRoute}/sp-assets/api/v1/assettag/${params}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem("Authorization")
        },
    });
}

//多项删除
export  async function removeAssetTagGroupByList(params) {
    return request(`${window.config.baseRoute}/sp-assets/api/v1/assettaggroups/${params}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem("Authorization")
        },
        //body: params,
    });
}
//新增标签组
export  async function addAssetTagGroup(params) {
    return request(`${window.config.baseRoute}/sp-assets/api/v1/assettaggroups`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem("Authorization")
        },
        body: {
            ...params,
        },
    });
}
//新增标签
export  async function addAssetTag(params) {
    return request(`${window.config.baseRoute}/sp-assets/api/v1/assettaggroups/newtag`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem("Authorization")
        },
        body: {
            ...params,
        },
    });
}
//编辑标签组
export  async function updateAssetTagGroup(params) {
    return request(`${window.config.baseRoute}/sp-assets/api/v1/assettaggroups/${params.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem("Authorization")
        },
        body: {
            ...params,
        },
    });
}
//编辑标签
export  async function updateAssetTag(params) {
    return request(`${window.config.baseRoute}/sp-assets/api/v1/assettaggroups/tags/${params.uuid_id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem("Authorization")
        },
        body: {
            ...params,
        },
    });
}