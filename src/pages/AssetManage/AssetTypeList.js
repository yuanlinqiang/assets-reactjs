import React, {Fragment} from 'react';
import { Table,message, Divider,Popconfirm,Modal, Icon,Button,Form,Card,Row,Col,Input,Select} from 'antd';
import { connect } from 'dva';
import AddAssetType from './components/AddAssetType';
import AssettypeDetail from './components/AssettypeDetail';
import UpdateAssetType from './components/UpdateAssetType'
// loading 是什么？
const { success, error, info} = message;
const { confirm } = Modal;
const FormItem = Form.Item;
@connect(({ assettype, loading }) => ({
  assettype, loading: loading.models.assettype,
}))
@Form.create()
class AssetTypeList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          account: {},    // 当前查看或编辑的用户详情
          currentPage: 1, // 当前页码
          //defaultParent:null,
          createVisible: false,
          detailVisible: false,
          updateVisible: false,
          changeGroup:[],
        };
    }
   
    //初始获取数据
    componentDidMount() {
      this.getAssetTypeTree();
    }

    //detail 获取ref
    saveDetailFormRef = (formRef) => {
      this.detailFormRef = formRef;
    }
    //detail 打开drawer
    openDetailDrawer = (account) => {
      const { form } = this.detailFormRef.props;
      this.setState({
        detailVisible: true,
      });
      const initValue = this.getInitValue(account);
      form.setFieldsValue({
         ...initValue,
        // name: account.name ? account.name : '',
        // uuid_parent_id: account.uuid_parent_id ? account.uuid_parent_id : '',
        // code: account.code ? account.code : '',
        // icon: account.icon ? account.icon : '',      
        // iconClass: account.iconClass ? account.iconClass : '',
        // levelcode: account.levelcode ? account.levelcode : '',
        // is_builtin: account.is_builtin ? account.is_builtin+"" : '0',
        // is_cvs: account.is_cvs ? account.is_cvs+"" : '0',
        // is_common: account.is_common ? account.is_common+"" : '0',
        // display_index: account.display_index ? account.display_index : '',
        // description: account.description ? account.description : '',
      });
    }
    //detail 窗口取消
    handleDetailCancel = () => {
      const { form } = this.detailFormRef.props;
      this.setState({
        detailVisible: false,
      });
      form.resetFields();
    }

    //create 获取 ref
    saveCreateFormRef = (formRef) => {
      this.createFormRef = formRef;
    }
    //create 打开
    openCreateModal = () => {
      const { form } = this.createFormRef.props;
      this.setState({
        createVisible: true,
      })
      form.setFieldsValue({
        parent:{uuid_id: "0"},
      });
      
    } 
    //create 确认
    handleCreateOk = () => {
      const { form } = this.createFormRef.props;
      const { dispatch } = this.props;
      const pageNum = this.state.currentPage
      const vm = this;
      form.validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'assettype/add',
            payload: values,
            callback: (res) => {
              if (res) {
                success('创建成功！');
                form.resetFields();
                this.setState({
                  createVisible: false,
                  currentPage: 1,
                })
                // vm.loadData(1);
                vm.getAssetTypeTree(pageNum);
              } else {
                error('创建失败！');
              }
            }
          })
        }
      })
    }
    //create 取消
    handleCreateCancel = () => {
      const { form } = this.createFormRef.props;
      form.resetFields();
      this.setState({
        createVisible: false,
      })
    }

    //Update 获取REF
    saveUpdateFormRef = (formRef) => {
      this.updateFormRef = formRef;
    }
    //Update 打开
    openUpdateModal = (account) => {
      const { form } = this.updateFormRef.props;
      this.setState({
        updateVisible: true,
        account:account,
      });
      const initValue = this.getInitValue(account);
      form.setFieldsValue({
      ...initValue
      });
    }
    // Update 保存
    handleUpdateOk = () => {
      const { form } = this.updateFormRef.props;
      const { currentPage,account } = this.state;
      const { dispatch } = this.props;
      const vm=this;
      form.validateFields((err, values) => {
        if (!err) {
          const newAccount ={
            ...account,
            ...values,
          };

          dispatch({
            type: 'assettype/update',
            payload: newAccount,
            callback: (res) => {
              if (res) {
                success('修改成功！');
                form.resetFields();
                this.setState({
                  updateVisible: false,
                })
                vm.getAssetTypeTree(currentPage);
              } else {
                error('修改失败！')
              }
            }
          })
        }
      })
    }
    //Update 取消
    handleUpdateCancel = () => {
      const { form } = this.updateFormRef.props;
      this.setState({
        updateVisible: false,
      });
      form.resetFields();
    }

    //delete 单个处理
    handleDelete = (record) => {
  
      const { dispatch } = this.props;
      const vm = this;
      const pageNum = this.state.currentPage;
      var list = [];
      list.push(record.id);
      // if(record.children==null){
        dispatch({
          type: 'assettype/remove',
          payload: list,
          callback: (response) => {
            if (response.success) {
              success('删除成功!')
              vm.getAssetTypeTree(pageNum);
            } else {
              error(response.description);
            }
          },
        })
      // }else{
      //   error("请先删除大类下的小类!");
      // }      
      
    }
    //delete 多项删除
    deleteMulti =(data)=>{
      const { dispatch } = this.props;
      const vm = this;
      const pageNum = this.state.currentPage;
      var delete_flag = true;
      var list = [];
      for(var id of this.state.changeGroup){
        list.push(id);
        if(!delete_flag){
          break;
        }
        for(var data_idx in data){
          if(id==data[data_idx].id){
            if(data[data_idx].children!=null && data[data_idx].children.length>0){
              delete_flag = false;
            }
            break;
          }
        }
      }
    
      // if(!delete_flag){
      //   info('请先删除子类');
      // }else{
        dispatch({
          type: 'assettype/removeIds',
          payload: list,
          callback: (response) => {    
            if (response.success) {
              success('删除成功!')
              vm.setState({
                changeGroup: '',
              })
              vm.getAssetTypeTree(pageNum);

            } else {
              error(response.description);
            }
          },
        })
      // }
      
    }
    //页码跳转
    tableChange = (pagination) => {
      const { dispatch } = this.props;
      this.setState({
        currentPage: pagination.current,
      })
      this.loadData(pagination.current);
    }

    //获取init value
    getInitValue = (account)=>{
      return {
        ...account,

        asset_type_name: account.attributes.asset_type_name,
        root_id: account.attributes.root_id,
        code: account.attributes.code,
        description: account.attributes.description,
        created: account.attributes.created,
        display_index: account.attributes.display_index,
        icon: account.attributes.icon,
        iconclass: account.attributes.icon_class,
        is_common: account.attributes.is_common,
        is_cvs: account.attributes.is_cvs,
        is_builtin: account.attributes.is_builtin,
        levelcode:account.attributes.levelcode,
        modified: account.attributes.modified,

       parent:{uuid_id: account.attributes.root_id},
      };
      

    }

    //刷新主页面
    getAssetTypeTree=(pageNum)=>{
      const { dispatch } = this.props;
      dispatch({
        type: 'assettype/fetchTables',
        payload: {
          _sort: 'asset_type_name',
          _order: 'asc',
          _page: pageNum,
        },
      })
    }
    
    
    //刷新数据
    loadData=(pageNum)=>{
      const { dispatch } = this.props;
      dispatch({
        type: 'assettype/fetch',
        payload: {
          _sort: 'asset_type_name',
          _order: 'asc',
          _page: pageNum,
        },
      })
      this.loadParentData();
    }

    loadParentData=()=>{
      const { dispatch } = this.props;
      dispatch({
        type: 'assettype/fetchParent',
      })
    }

    render() {
      const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log('发生点击事件===== :', {data});

          // console.log('changeGroup :', changeGroup);
          this.setState({
            changeGroup: selectedRowKeys



          })
        },
      };
      const { currentPage, createVisible, detailVisible, updateVisible,defaultParent,changeGroup ,} = this.state;
      // const { assettype: { data,parent }, loading } = this.props;
      const { assettype: { data }, loading,form } = this.props;
        return (
          <Fragment>
            <Row type="flex" className='main_container'>
              <Col span={24} className='right_container' >
                <Button.Group  className='btn_group_container'>
                  <Button type={'primary'}
                      onClick={ this.openCreateModal }
                      padding-right={'8px'}
                    >
                    <Icon type="plus-circle" />新增
                  </Button>
                  <Button
                      type={'primary'}
                      disabled={changeGroup.length ? false : true}
                      onClick={ this.deleteMulti.bind(this,data)}
                    >
                    <Icon type="delete" />删除
                  </Button>
                </Button.Group>
                <div className='content_table' ref={(content) => {this.content = content}}>
                  <Table
                    dataSource={data}
                    loading={loading} 
                    pagination={{ total: parseInt(localStorage.getItem('ListNumber'), 10), current: currentPage }} 
                    onChange={this.tableChange} 
                    rowKey={record => record.id}
                    rowSelection={rowSelection}
                    size='middle'
                  >
                    <Table.Column
                      title='名称'
                      dataIndex='text'
                      key = 'text'
                      // sorter={(a, b) => a.asset_type_name.length - b.asset_type_name.length}
                      // render={(text, row) => {
                      // 	return <a href='javascript:;' onClick={this.openDetailDrawer.bind(this, row)}>{text}</a>
                      // }}
                    />
                    <Table.Column
                      title='编号'
                      dataIndex='code'
                      key = 'code'
                      // sorter={(a, b) => a.code.length - b.code.length}
                      render ={(text,record)=> {
                        return <span>{ record && record.attributes ? record.attributes.code : ''}</span>
                      }}
                    />
                    <Table.Column
                      title='描述'
                      dataIndex='description'
                      key = 'description'
                      render ={(text,record)=> {
                        return <span>{ record && record.attributes?record.attributes.description : ''}</span>   //需要加Loading    否则就是加判断   后台请求没完成就加载了页面
                      }}
                    />
                    <Table.Column
                      title='操作'
                      key='action'
                      width={120}
                      render={(text, record) => (
                        <span>
                          <a onClick={this.openDetailDrawer.bind(this, record) } style={{ color: '#1890FF' }}><Icon type="eye" /></a>
                          <Divider type="vertical" />
                          <a onClick={this.openUpdateModal.bind(this, record) } style={{ color: '#1890FF' }}><Icon type="edit" /></a>
                          <Divider type="vertical" />
                          <Popconfirm title="删除不可恢复，是否确认？" okText="删除" cancelText="取消" okType="danger" onConfirm={() => { this.handleDelete(record) }} icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}>
                          <Icon type="delete" style={{ color: '#1890FF' }} />
                          </Popconfirm>
                        </span>									
                      )}
                    />
                  </Table>
                </div>
              </Col>
            </Row>
            <AssettypeDetail
              wrappedComponentRef={this.saveDetailFormRef}
              visible={detailVisible}
              onClose={this.handleDetailCancel}
              treeData={data}
            />
            <AddAssetType  
              wrappedComponentRef={this.saveCreateFormRef}
              visible={createVisible}
              onClose={this.handleCreateCancel}
              onOk={this.handleCreateOk}
              treeData={data}
            />   
            <UpdateAssetType
              wrappedComponentRef={this.saveUpdateFormRef}
              visible={updateVisible}
              onClose={this.handleUpdateCancel}
              onOk={this.handleUpdateOk}
              treeData={data}
              //defaultParent={defaultParent}
            />
          </Fragment>
        );
    }
}

export default AssetTypeList;
