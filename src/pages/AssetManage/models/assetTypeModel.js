import {queryAssetType,queryAssetTypeTable,queryAssetTypeParent,removeAssetType,removeAssetTypeByList,getByParam,addAssetType,updateAssetType} from "../services/assetTypeService"

export default {
    namespace: 'assettype',
  
    state: {
      data: [],
      parent:[],
      assetType:[]
    },
    effects: {
      
      *fetchTables({ payload }, { call, put }) {
        const response = yield call(queryAssetTypeTable, payload);
        yield put({
          type: 'saveAssetTypeTable',
          payload: response,
        });
      },
      *fetch({ payload }, { call, put }) {
        const response = yield call(queryAssetType, payload);
        yield put({
          type: 'save',
          payload: response,
        });
      },
      *fetchParent({ payload }, { call, put }) {
        const response = yield call(queryAssetTypeParent, payload);
        yield put({
          type: 'saveParent',
          payload: response,
        });
      },
      *add({ payload, callback }, { call, put }) {
        const response = yield call(addAssetType, payload);
        if (callback) callback(response);
      },
      *remove({ payload, callback }, { call, put }) {
        const response = yield call(removeAssetType, payload);
        if (callback) callback(response);
      },
      *removeIds({ payload, callback }, { call, put }) {
        const response = yield call(removeAssetTypeByList, payload);
        if (callback) callback(response);
      },
      *update({ payload, callback }, { call, put }) {
        const response = yield call(updateAssetType, payload);
        if (callback) callback(response);
      },
    },
    *findById({ payload, callback }, { call, put }) {
      try {
        const response = yield call(getByParam, payload);
        yield put({
          type: 'select',
          payload: response,
        })
        if (callback) callback(response);
      } catch (err) {
        console.error(err);
      }
    },
  
    reducers: {
      save(state, action) {
        const data = action.payload;
        const list = [];
        //方法一：重新拼接table tree（不是很好，用删除比较好）
        // for(var con of data){
        //   const map = {};
        //   map.uuid_id = con.uuid_id;
        //   map.name = con.name;
        //   map.parent = con.parent;
        //   map.code = con.code;
        //   map.uuid_parent_id = con.uuid_parent_id;
        //   map.description = con.description;
        //   if(con.children!=null && con.children.length!=0){
        //     const li = [];
        //     for(const ch of con.children){
        //       const c = {};
        //       c.uuid_id = ch.uuid_id;
        //       c.name = ch.name;
        //       c.parent = ch.parent;
        //       c.code = ch.code;
        //       c.description = ch.description;
        //       c.parent_name = ch.name;
        //       c.uuid_parent_id = ch.uuid_parent_id;
        //       li.push(c);
        //     }
        //     map.children = li;
        //   }          
        //   list.push(map);  
        // }
        // con['children'] con.children
        //方法二：删除数据里没有children的chilidren的key和value
        for(var item in data){
          if(data[item].children==null || data[item].children.length==0){
            delete data[item].children;            
          }else{
            //说明有children但是要删除所有children、下面的children、
            for(const child in data[item].children){
              delete data[item].children[child].children;
            }            
          }  
        }
        return {
          ...state,
          data: data,
        };
      },
      saveParent(state,action){
        const parent_list = [];
        if(action.payload){
          var data = action.payload;
          const parent = {
          title: "请选择",
          value:"0",
          key: "0",
          };
          parent_list.push(parent);
          for(var item in data){
            const parent = {
              title: data[item].asset_type_name ,
              value: data[item].id,
              key: data[item].id,
            };
            parent_list.push(parent);
          }
        }
        return{
          ...state,
          parent:parent_list
        }
      },
      saveAssetTypeTable(state,action){
        return {
          ...state,
          data: action.payload,
        };
      },
      
    },
  };
  