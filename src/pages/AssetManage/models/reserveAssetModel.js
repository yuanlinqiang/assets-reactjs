import {fetchList,deleteReAssetInfo,fetchTableList,deleteMulti,fetchAssetType,GetTableData, PatchTableData } from '../services/reserveAssetService';
import moment from 'moment';
export default {

  namespace: 'reserviceasset',
  state: {
    dataList: [],
    listTable:[],
  },

  effects: {

    /**huan
     * 获取预备资产数据
     * @param {*} param0
     * @param {*} param1
     */
    *fetchTable({ payload, callback }, { call, put }) {
        try {
          const response = yield call(fetchTableList, payload);
          yield put({
            type: 'saveTable',
            payload: response,
          });
          if (callback) callback(response);
        } catch (error) {
          console.log(error);
        }
      },
      

        /**
     * 获取资产组
     * @param {*} param0
     * @param {*} param1
     */
    *fetch({ payload, callback }, { call, put }) {
      try {
        const response = yield call(fetchList, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback) callback(response);
      } catch (error) {
        console.log(error);
      }
    },
    // 删除
    *DeleteData({ payload, callback }, { call, put }) {
      try {
        const response = yield call(deleteReAssetInfo, payload);
        if (callback) callback(response);
      } catch (err) {
        console.log(err)
      }
    },
    //多项删除
    *removeIds({ payload, callback }, { call, put }) {
      const response = yield call(deleteMulti, payload);

      if (callback) callback(response);
    },
   
        /**
     * 获取资产类别
     * @param {*} param0
     * @param {*} param1
     */
    *fetchAssetType({ payload, callback }, { call, put }) {
      try {
        const response = yield call(fetchAssetType, payload);
        yield put({
          type: 'saveType',
          payload: response,
        });
        if (callback) callback(response);
      } catch (error) {
        console.log(error);
      }
    },
    *getData({ payload, callback }, { call, put }) {
      try {
        const response = yield call(GetTableData, payload);
        yield put({
          type: 'saveList',
          payload: response
        })
        if (callback) callback(response);
      } catch (e) {
        console.log(e)
      }
    },
    // 编辑
    *PatchData({ payload, callback }, { call, put }) {
      try {
        const response = yield call(PatchTableData, payload);
        if (callback) callback(response);
      } catch (err) {
        console.log(err)
      }
    },
    
  },
  
  reducers: {
    saveList(state, action) {
      return {
        ...state,
        dataList: action.payload
      }
    },
    saveTable(state, action) {      
      var dataList = [];
      if(action.payload){
        for(let data of action.payload){
          data.create_time = moment(data.create_time).format("YYYY-MM-DD HH:mm:ss");
          dataList.push(data);
        }
      }
      return {
        ...state,
        dataList: dataList,
      };
    },
    saveType(state, action) {
      return {
        ...state,
      };
    },
  }
}