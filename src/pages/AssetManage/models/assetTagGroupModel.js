import {queryAssetTagGroup,
  removeAssetTagGroup,
  removeAssetTagGroupByList,
  addAssetTagGroup,
  updateAssetTagGroup,
  addAssetTag,
  updateAssetTag,
  removeAssetTag,
} from "../services/assetTagGroupService"

export default {
    namespace: 'assettaggroup',  
    state: {
      data: [],
      tagDict:{},
    },
    effects: {
      *fetch({ payload,callback }, { call, put }) {
        const response = yield call(queryAssetTagGroup, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback) callback(response);
      },
      *add({ payload, callback }, { call, put }) {
        const response = yield call(addAssetTagGroup, payload);
        if (callback) callback(response);
      },
      *addtag({ payload, callback }, { call, put }) {
        const response = yield call(addAssetTag, payload);
        yield put({
          type: 'patchsave',
          payload: response,
        });
        if (callback) callback(response);
      },
      *remove({ payload, callback }, { call, put }) {
        const response = yield call(removeAssetTagGroup, payload);
        if (callback) callback(response);
      },
      *removetag({ payload, callback }, { call, put }) {
        const response = yield call(removeAssetTag, payload);
        if (callback) callback(response);
      },
      *removeIds({ payload, callback }, { call, put }) {
        const response = yield call(removeAssetTagGroupByList, payload);
        if (callback) callback(response);
      },
      *update({ payload, callback }, { call, put }) {
        const response = yield call(updateAssetTagGroup, payload);
 
        if (callback) callback(response);
      },
      *updatetag({ payload, callback }, { call, put }) {
        const response = yield call(updateAssetTag, payload);
        yield put({
          type: 'patchupdate',
          payload: response,
        });
        if (callback) callback(response);
      },
    },
    reducers: {
      patchsave(state,action){
        
        const newdata = action.payload;
        const tagDict = state.tagDict;
       
        // if(!tagDict[newdata.uuid_group_id]){
        //   tagDict[newdata.uuid_group_id]=[];
        // }
        // tagDict[newdata.uuid_group_id].push(newdata);
        if(!tagDict[newdata.group_id]){
          tagDict[newdata.group_id]=[];
        }
        tagDict[newdata.group_id].push(newdata);
        return {
          ...state,
          tagDict:tagDict,
        };
      },
      patchupdate(state,action){
        if(!action.payload){
          return{
            ...state,
          }
        }
        const updatedata = action.payload;
        const tagDict = state.tagDict;
        for(var idx in tagDict[updatedata.uuid_group_id]){
          if(tagDict[updatedata.uuid_group_id][idx].uuid_id == updatedata.uuid_id){
            tagDict[updatedata.uuid_group_id][idx]={
              ...updatedata,
            }
            break;
          }
        }

        return {
          ...state,
          tagDict:tagDict,
        };
      },
      save(state, action) {
        const data = action.payload;
        const tagDict = {};
        for(var tagGroup of data){
          tagDict[tagGroup.id] = tagGroup.assetTagSet
          for(var idx in tagDict[tagGroup.id]){
            tagDict[tagGroup.id][idx].group_id = tagGroup.id;
            //tagDict[tagGroup.id][idx].id = tagGroup.id;
          }
        }
        return {
          ...state,
          tagDict:tagDict,
          data: action.payload,
        };
      },
      
    },
  };
  