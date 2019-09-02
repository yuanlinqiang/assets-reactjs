import { stringify } from "qs";
import request from "@/utils/request";

//查询所有的资产
export async function fetchList(params) {
  return request(`${window.config.baseRoute}/sp-assets/api/v1/assetgroup?${stringify(params)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization")
    }
  });
}

//查询所有资产列表
export async function fetchTableList(params) {
  return request(`${window.config.baseRoute}/sp-assets/api/v1/assetobject?${stringify(params)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization")
    }
  });
}

//新增资产
export async function AddAssetData(params) {
  return request(`${window.config.baseRoute}/sp-assets/api/v1/assetobject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization")
    },
    body: params
  });
}

// //查询资产类型
export async function fetchAssetType(params) {
  return request(`${window.config.baseRoute}/sp-assets/api/v1/assetgroup?${stringify(params)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization")
    }
  });
}


//类型弹窗
export async function fetchAllAssetTypeTree() {
  return request(`${window.config.baseRoute}/sp-assets/api/v1/assettypes/trees`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization")
    }
  });
}

//查询资产类型   
export async function fetchAssetTypeTree() {
  return request(`${window.config.baseRoute}/sp-assets/api/v1/assettypes/typeList`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization")
    }
  });
}


//查询资产标签   树结构
export async function fetchAssetTagTree() {
  return request(`${window.config.baseRoute}/sp-assets/api/v1/assettaggroups/allAssetTags`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization")
    }
  });
}

//编辑资产信息
export async function PatchTableData(params) {
  return request(`${window.config.baseRoute}/sp-assets/api/v1/assetobject/${params.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization")
    },
    body: {
      ...params
    }
  });
}
// 删除资产信息
export async function DeleteAssetInfo(params) {
  return request(`${window.config.baseRoute}/sp-assets/api/v1/assetobject/${params}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization")
    },
  });
}
//删除资产组信息

export async function DeleteAssetGroupInfo(params) {
  return request(`${window.config.baseRoute}/sp-assets/api/v1/assetgroup/${params}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization")
    },
  });
}

// 新增资产组数据
export async function AddAssetGroupData(params) {
  return request(`${window.config.baseRoute}/sp-assets/api/v1/assetgroup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization")
    },
    body: params
  });
}
//编辑资产组
export async function UpdateAssetGroupData(params) {
  return request(`${window.config.baseRoute}/sp-assets/api/v1/assetgroup/${params.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization")
    },
    body: {
      ...params
    }
  });
}
//获取单个资产数据
export async function GetTableData(params) {
  return request(`${window.config.baseRoute}/sp-assets/api/v1/assetgroup/${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization")
    }
  });
}


//移动资产
export async function moveAssetGroup(params) {
  return request(`${window.config.baseRoute}/sp-assets/api/v1/assetobject/moveAssetGroups/${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization")
    }
  });
}