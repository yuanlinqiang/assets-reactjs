import React,{ Component, Fragment } from 'react';
import { Table,message, Card,Popconfirm,Modal, Icon,Button,Form ,Row } from 'antd';
import { connect } from 'dva';
import AddAssetTagGroup from './components/AddAssetTagGroup';
import AssetTags from './components/AssetTags';
import Col from 'antd/es/col';
// loading 是什么？
const { success, error, info} = message;
const { confirm } = Modal;
@connect(({ assettaggroup, loading }) => ({
    assettaggroup, loading: loading.models.assettaggroup,
}))
@Form.create()
class AssetTagInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          account: {},    // 当前查看或编辑的用户详情
          createVisible: false,
          updateVisible: false,
          changeGroup:[],
        };
    }
   
    //初始获取数据
    componentDidMount() {
      this.loadData();
    }
    //刷新数据
    loadData=()=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'assettaggroup/fetch',
            payload: {
                _sort: 'display_index',
                _order: 'asc',
            },
        })
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
      const vm = this;
      form.validateFields((err, values) => {
        // if(values.parent_id === undefined){
        //   values.parent_id="0";
        // }
        if (!err) {
          var isTagCreate = (values.tag.tag_name != undefined) && (values.tag.color != undefined);
          dispatch({
            type: 'assettaggroup/add',
            payload: values,
            callback: (res) => {
              if (res) {
                if(isTagCreate){
                  success('创建成功！');
                  form.resetFields();
                  const newTag = {
                    groupTagId:res.id,
                  //group_id:res.uuid_id,
                  group_id:res.id,
                  ...values.tag,
                  };
                  dispatch({
                    type: 'assettaggroup/addtag',
                    payload: newTag,
                    callback: (res) => {
                      if(res){
                        success('创建标签成功！');
                        this.setState({
                          createVisible: false,
                        })
                        vm.loadData();
                      }else{
                        error('创建标签失败！');
                      }
                    }
                  })
                }else{
                  success('创建成功！');
                  form.resetFields();
                  this.setState({
                    createVisible: false,
                  })
                  vm.loadData();
               }
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
      form.setFieldsValue({
      ...account,
      });
    }
    // Update 保存
    handleUpdateOk = () => {
      const { form } = this.updateFormRef.props;
      const { account } = this.state;
      const { dispatch } = this.props;
      const vm=this;
      form.validateFields((err, values) => {
        if (!err) {
          const newAccount ={
            ...account,
            ...values,
          };
          dispatch({ 
            type: 'assettaggroup/update',
            payload: newAccount,
            callback: (res) => {
              if (res) {
                success('新增成功！');
                form.resetFields();
                this.setState({
                  updateVisible: false,
                })
                vm.loadData();
              } else {
                error('新增失败！')
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
        dispatch({
          type: 'assettaggroup/remove',
          payload: record.id,
          callback: (response) => {
            if (response.success) {
              success('删除成功!')
              vm.loadData();
            } else {
              error(response.description);
            }
          },
        })
    }
    //delete 多项删除
    deleteMulti =()=>{
        const { dispatch } = this.props;
        const vm = this;
        var list = this.state.changeGroup;
        dispatch({
            type: 'assettaggroup/removeIds',
            payload: list,
            callback: (response) => {
            if (response.success) {
                success('删除成功!')
                vm.setState({
                    changeGroup:[]
                });
                vm.loadData();
            } else {
                error(response.description);
            }
            },
        })
    }
    //页码跳转
    tableChange = (pagination) => {
      const { dispatch } = this.props;
      this.setState({
        currentPage: pagination.current,
      })
      this.loadData(pagination.current);
    }



    
    render() {
      const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          this.setState({
            changeGroup: selectedRowKeys
          })
        },
        getCheckboxProps: record => ({
          disabled: record.id === '1', // Column configuration not to be checked
          name: record.tag_group_name,
        }),
      };
      const { currentPage, createVisible, updateVisible,changeGroup } = this.state;
      const { assettaggroup: { data }, loading } = this.props;
      const titleAdd = "创建标签组";
      const titleUpdate = "查看|编辑标签组";
        return (
        <Fragment>
          <Row type='flex' className='main_container'>
            <Col span={24}  className='right_container'>
              <Button.Group className='btn_group_container' >
                <Button  type={'primary'}
                onClick={ this.openCreateModal }
                padding-right={'8px'}>
                    <Icon type="plus-circle" />新增
                </Button>
                <Button type='primary'
                    disabled={changeGroup.length ? false : true}
                    onClick={ this.deleteMulti.bind(this)}>
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
                      title='标签组'
                      dataIndex='tag_group_name'
                    

                      sorter={(a, b) => a.tag_group_name.length - b.tag_group_name.length}
                      render={(text, row) => {
                        return <a href='javascript:;' onClick={this.openUpdateModal.bind(this, row)}>{text}</a>
                      }}
                  />
                  <Table.Column
                      title='资产标签'
                      key='tags'
                      render={(text, record) => {
                        return (<span>
                            <AssetTags
                              record={record}
                            />
                        </span>	)
                  }}/>
                  <Table.Column
                      title='操作'
                      key='action'
                      width={120}
                      render={(text, record) => {
                      if(record.id!="1"){
                        return (
                          <span>
                              <Popconfirm title="删除不可恢复，是否确认？" okText="删除" cancelText="取消" okType="danger" onConfirm={() => { this.handleDelete(record) }} icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}>
                                <Icon style={{ color: '#1890FF' }} type="delete" />
                              </Popconfirm>
                          </span>	)
                      }                     								
                  }}/>
                </Table>
              </div>
              <AddAssetTagGroup
                wrappedComponentRef={this.saveUpdateFormRef}
                visible={updateVisible}              
                onOk={this.handleUpdateOk}
                onClose={this.handleUpdateCancel}
                title={titleUpdate}
                isUpdate={true}
              />
              <AddAssetTagGroup  
                wrappedComponentRef={this.saveCreateFormRef}
                visible={createVisible}
                onClose={this.handleCreateCancel}
                onOk={this.handleCreateOk}
                title={titleAdd}
                isUpdate={false}
              />
              </Col>
            </Row>
          </Fragment>
        );
    }
}
export default AssetTagInfo;
