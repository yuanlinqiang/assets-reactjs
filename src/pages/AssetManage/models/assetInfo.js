import {
  fetchList,
  fetchTableList,
  AddAssetData,
  DeleteAssetInfo,
  fetchAssetType,
  fetchAssetTypeTree,
  fetchAssetTagTree,
  AddAssetGroupData,
  GetTableData,
  PatchTableData,
  DeleteTableData,
  UpdateAssetGroupData,
  DeleteAssetGroupInfo,
  moveAssetGroup,
  fetchAllAssetTypeTree,
  exportAssetObject
} from "../services/assetInfo";
import { stringify } from "qs";

export default {
  namespace: "TableList",
  state: {
    dataList: [],
    listTable: [],
    allAssetTypeTree: [],
    treeData:[],
    assetTypedata:[],
    allTypeAsset:[],
    assetTypedataCopy:[],
    assetTagdata:[],
     assetTypetree:[],
     assetTagtree:[],
  },

  effects: {
    /**
     * 获取资产组
     * @param {*} param0
     * @param {*} param1
     */
    *fetch({ payload, callback }, { call, put }) {
      try {
        const response = yield call(fetchList, payload);
        yield put({
          type: "save",
          payload: response
        });
        if (callback) callback(response);
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * 获取资产类型
     * @param {*} param0
     * @param {*} param1
     */
    *fetchAssetType({ payload, callback }, { call, put }) {
      try {
        const response = yield call(fetchAssetType, payload);
        yield put({
          type: "saveAssetType",
        });
        if (callback) callback(response);
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * 获取资产类型  数结构
     */
    *fetchAssetTypeTree({ callback }, { call, put }) {
      try {
        const response = yield call(fetchAssetTypeTree);
        // console.log('查询树结构的回调 :', response);
        yield put({
          type: "saveAssetTypeTree",
          payload: response,
        });
        if (callback) callback(response);
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取新增弹框的资产类型 
     */
    *fetchAllAssetTypeTree({ callback }, { call, put }) {
      try {
        const response = yield call(fetchAllAssetTypeTree);
        yield put({
          type: "allTypeAsset",
          payload: response,
        });
        if (callback) callback(response);
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * 获取资产标签  数结构
     */
    *fetchAssetTagTree({ callback }, { call, put }) {
      try {
        const response = yield call(fetchAssetTagTree);
        yield put({
          type: "saveAssetTag",
          payload: response,
        });
        if (callback) callback(response);
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * 根据数ID获取数的结构
     * @param {*} param0
     * @param {*} param1
     */
    // *fetchOne({ payload, callback }, { call, put }) {
    //   try {
    //     const response = yield call(fetchList, payload);
    //     yield put({
    //       type: "save",
    //       payload: response
    //     });
    //     if (callback) callback(response);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    /**
     *根据id获取资产组
     * @param {*} param0
     * @param {*} param1
     */

    *getAssetGroupData({ payload, callback }, { call, put }) {
      try {
        const response = yield call(GetTableData, payload);
        yield put({
          type: "saveList",
          payload: response
        });
        if (callback) callback(response);
      } catch (e) {
        console.log(e);
      }
    },
    /**
     * 获取资产数据
     * @param {*} param0
     * @param {*} param1
     */
    *fetchTable({ payload, callback }, { call, put }) {
      try {
        const response = yield call(fetchTableList, payload);
        yield put({
          type: "saveTable",
          payload: response
        });
        if (callback) callback(response);
      } catch (error) {
        console.log(error);
      }
    },
    // 添加资产数据
    *AddAssetData({ payload, callback }, { call, put }) {
      try {
        const response = yield call(AddAssetData, payload);
        if (callback) callback(response);
      } catch (err) {
        console.log(err);
      }
    },
   
      // 导出资产数据
      *exportAsset({ payload, callback }, { call, put }) {
        const reqUrl = `${window.config.baseRoute}/sp-assets/api/v1/assetobject/exportExcel/${payload}`;
        fetch(reqUrl).then(resp =>resp.blob())
          .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "资产信息.xls";
            a.click();
            if (callback) callback(reqUrl);
          })
      },

    // 编辑资产信息
    *PtachData({ payload, callback }, { call, put }) {
      try { 
        const response = yield call(PatchTableData, payload);
        if (callback) callback(response);
      } catch (err) {
        console.log(err);
      }
    },
    // 删除资产信息
    *DeleteData({ payload, callback }, { call, put }) {
      try {
        const response = yield call(DeleteAssetInfo, payload);
        if (callback) callback(response);
      } catch (err) {
        console.log(err);
      }
    },
    //删除资产组数据
    *DeleteGroupData({ payload, callback }, { call, put }) {
      try {
        const response = yield call(DeleteAssetGroupInfo, payload);
        if (callback) callback(response);
      } catch (err) {
        console.log(err);
      }
    },
    //新增资产组
    *AddAssetGroupData({ payload, callback }, { call, put }) {
      try {
        const response = yield call(AddAssetGroupData, payload);
        if (callback) callback(response);
      } catch (err) {
        console.log(err);
      }
    },
    //编辑资产组
    *updateAssetGroupData({ payload, callback }, { call, put }) {
        try {
          const response = yield call(UpdateAssetGroupData, payload);
          if (callback) callback(response);
        } catch (err) {
          console.log(err);
        }
    },
    //移动资产组
   *moveAssetGroup({ payload, callback }, { call, put }) {
          try {
            const response = yield call(moveAssetGroup, payload);
            if (callback) callback(response);
          } catch (err) {
            console.log(err);
          }
    }
  },
  reducers: {
    saveAssetType(state, action){
      const datas = action.payload;
      var  allAssetTypes = [];
      datas.forEach(element => {
         element.children.forEach(element => {
           allAssetTypes.push(element);
         });
      });

     
      return {
        ...state,
        assetTypedata : allAssetTypes,
        assetTypetree : datas
      }
    },
    saveAssetTypeTree(state, action){
      const datas = action.payload;
      return {
        ...state,
        assetTypedataCopy: datas
      }
    },
    saveAssetTag(state, action){
      const datas = action.payload;
      var  allAssetTags = [];
      datas.forEach(element => {
         element.children.forEach(element => {
          allAssetTags.push(element);
         });
      });
      return {
        ...state,
        assetTagdata : allAssetTags,
        assetTagtree : datas
      }
    },
    save(state, action){
      const datas = action.payload;
      return {
        ...state,

        treeData:datas
      }
    },

    saveList(state, action) {
      return {
        ...state,
        dataList: action.payload
      };
    },
    saveTable(state, action) {
      return {
        ...state,
        listTable: action.payload
      };
    },
    allTypeAsset(state, action) {
      return {
        ...state,
        allTypeAsset: action.payload
      };
    },
    saveType(state, action) {
      return {
        ...state
      };
    }
  }
};
