import React, { Component, Fragment } from "react";
import {
  Button,
  Tree,
  Row,
  Col,
  Upload,
  Icon,
  Table,
  Modal,
  message,
  Popconfirm,
  Input,
  Divider,
  Radio,
  Card,
  Drawer,
  Form
} from "antd";
import AddDrawer from "./components/AddAssetInfo";
import EditAssetInfo from "./components/EditAssetInfo";
import AddAssetGroupInfo from "./components/AddAssetGroupInfo";
import EditAssetGroupInfo from "./components/EditAssetGroupInfo";
import styles from './style.less'


import { connect } from "dva";


const DirectoryTree = Tree.DirectoryTree;
const { TreeNode } = Tree;

@connect(({ TableList, loading }) => ({
  TableList,
  loading: loading.effects["TableList/getData"]
}))
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeKeys: [],
      changeGroup: [],
      changeGroupRows: [],
      tableList: [],
      assetTagtree:[],
      treeList: [],
      moveTreeGroup: [], //值保存为最后一次的移动的资产组ID
      moveAssetIds: [], //需要移动的资产ID    修改之前的移动的资产ID和资产组的ID的拼接
      placement: 'top',
      defaultSelect: '00',
      visible: false,
      exportUrl : `${window.config.baseRoute}/sp-assets/api/v1/assetobject/importExcel/` ,
      exportUrlEnd : ''
    };
  }
 
  

  componentDidMount() {
    this.loadData();
    this.getSourceData();  //资产
    this.loadAssetTypeTree();  //资产所有类型
    this.loadAssetTagTree();  //资产所有类型
    this.loadAssetType();  //资产所有类型
  }


  //获取所有的资产组
  loadData = (pageNum) => {
    const { dispatch } = this.props;
    const vm = this;
    dispatch({
      type: "TableList/fetch",
      payload: {
        _sort: 'asset_name',
        _order: 'asc',
        _page: pageNum,

      },
      callback: res => {

      }
    })

  }
 

  // //获取所有的资产
  getSourceData = (key) => {
    const vm = this;
    const { dispatch } = this.props;
    const typeKey = this.state.typeKeys[0];
    var  assetGroupId = this.state.typeKeys;
   
    dispatch({
      type: "TableList/fetchTable",
      payload: {
        _sort: 'asset_name',
        _order: 'asc',
        _page: 1,
        status: 1,
        id : assetGroupId
      },
      callback: res => {
        vm.setState({
          tableList: res
        });
      }
    });
  };



  //获取所有的资产类型  
  loadAssetTypeTree = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TableList/fetchAssetTypeTree'
    })
  }
  //获取所有的资产类型 数结构  
  loadAssetType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TableList/fetchAllAssetTypeTree',
      callback: res => {
      }
    })
  }


  //获取所有的资产标签类型
  loadAssetTagTree = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TableList/fetchAssetTagTree'
    })
  }

  //新增资产信息  start
  AddDrawerRef = drawer => {
    this.addDrawer = drawer;
  };

  showDrawer = (row) => {
    this.setState(
      () => {
        this.addDrawer.props.form.setFieldsValue({
        });
        this.addDrawer.showDrawer();
      }
    );
  };
  addEventDrawer = () => {
    this.setState(
      () => {
        this.addDrawer.showDrawer();
      }
    );
  };

  //导出资产
  exportAssetObject = (key) => {

    const { dispatch } = this.props;
    this.getSourceData();
    dispatch({
      type: 'TableList/exportAsset',
      payload:key,
      callback: res => {
        message.success("导出成功");
      }
    })
  };
  //导入资产
  importAssetObject = (key) => {
    var fileObj = document.getElementById("file")
    
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'TableList/exportAsset',
    //   payload:key,
    //   callback: res => {
    //     message.success("导出成功");
    //   }
    // })
    this.getSourceData();
    
    };
  //新增资产信息  end
  //新增资产组   start
  AddAssetGroupRef = group => {
    this.AddAssetGroupInfo = group;
  };
  showGroupDrawer = (row) => {

    this.setState(
      () => {
        this.AddAssetGroupInfo.props.form.setFieldsValue({
        });
        this.AddAssetGroupInfo.showGroupDrawer();
      }
    );
  };
  //  num为1  根节点   2  子节点
  addGroupData = (num) => {
    this.setState(
      () => {
        this.AddAssetGroupInfo.showGroupDrawer(num);
      }
    );
  };

  //页码跳转
  tableChange = (pagination) => {
    const { dispatch } = this.props;
    this.setState({
      currentPage: pagination.current,
    })
    this.loadData(pagination.current);
  };

  //新增资产组   end
  //编辑资产组 start
  EditAssetGroupRef = group => {
    this.EditAssetGroupInfo = group;
  };
  editGroupDrawer = (key) => {
    const vm = this;
    const { dispatch } = this.props;
    const typeKey = this.state.typeKeys;
    console.log('修改的key=== :', key);
    dispatch({
      type: "TableList/getAssetGroupData",
      payload: key,
      callback: res => {
        this.setState(
          () => {
            this.EditAssetGroupInfo.props.form.setFieldsValue({
              assetGroupName: res.asset_group_name,
              assetValue: res.value,
              assetlevel: res.grade,
              description: res.description,
              id: res.id
            });
            this.EditAssetGroupInfo.editGroupDrawer();
          }
        );
      }
    });
  };
  editGroupData = () => {
    this.setState(
      () => {
        this.EditAssetGroupInfo.editGroupDrawer();
        this.editGroupDrawer();
      }
    );
  };
  //编辑资产组 end
  //编辑资产 start
  EditDrawerRef = drawer => {
    this.EditAssetInfo = drawer
  }
  showEditDrawer = (row) => {

    this.setState(
      () => {
        this.EditAssetInfo.props.form.setFieldsValue({
          id: row.id,
          name: row.asset_name,
          typeId: row.type_id,
          type_code: row.type_code,
          ip: row.ip,
          mac: row.mac,
          sn: row.sn,
          manufacturer: row.manufacturer,
          location: row.location,
          contact: row.contact,
          description: row.description,
          tagId: {tagId:row.assetTagID},
          confidentiality: row.confidentiality,
          value: row.value,
          availability: row.availability,
          grade: row.grade,
          integrity: row.integrity,
          interfaceIp: row.inter_ip,
          interfaceMac: row.inter_mac
        });
        this.EditAssetInfo.showEditDrawer();
      }
    );
  };
  //编辑  end
  //批量删除
  handleDelete = key => {
    const vm = this;
    const { dispatch } = this.props;
    var param = [];
    const { changeGroupRows } = this.state;
    //批量
    if (changeGroupRows.length > 0) {
      changeGroupRows.forEach((item, index) => {
        param[index] = item;
      });
    } else {
      param[0] = key.id;
    }
    dispatch({
      type: "TableList/DeleteData",
      payload: param,
      callback: res => {
        message.success("删除成功");
        //清空
        vm.setState({
          changeGroupRows: [],
          changeGroup : []
        });

        this.getSourceData();
      }
    });

  };
  //删除组
  handleDeleteGroup = key => {
    const { dispatch } = this.props;
    dispatch({
      type: "TableList/DeleteGroupData",
      payload: key,
      callback: res => {
        message.success("删除成功");
        this.setState({
          typeKeys : [],
          defaultSelect  : '00'
        });
        this.loadData();
        this.getSourceData();
      }
    });
  };

  onExpand = (expandedKeys, { expanded: bool, node }) => { };
  //获取树   不拿ID    直接拿分组级别
  renderTreeNodes = datas =>
    datas.map(item => {
      if (item.children.length > 0) {
        return (
          <TreeNode 
            className={styles.tree_node} 
            title={<span className={styles.tree_node_title_container}>
                    <span>{item.asset_group_name}</span>
                    <span className={styles.tree_node_icon_container}>
                      <Icon   className={styles.tree_node_icon} type='plus-circle' onClick={() => {  this.addGroupData(2);}} />
                      <Icon  className={styles.tree_node_icon} type="edit"        onClick={() => {  this.editGroupDrawer(item.id);}}/>
                      <Icon  className={styles.tree_node_icon} type="delete"      onClick={() => {this.handleDeleteGroup(item.id)}}/>
                    </span>
                  </span>}     
            key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );

      }
      return <TreeNode
                className={styles.tree_node}
                title={<span className={styles.tree_node_title_container}>
                        <span>{item.asset_group_name}</span>
                        <span className={styles.tree_node_icon_container}>
                          <Icon  className={styles.tree_node_icon} type='plus-circle'  onClick={() => {  this.addGroupData(2);}} />
                          <Icon  className={styles.tree_node_icon} type="edit"         onClick={() => {  this.editGroupDrawer(item.id);}}/>
                          <Icon  className={styles.tree_node_icon} type="delete"       onClick={() => this.handleDeleteGroup(item.id)}/>
                        </span>
                      </span>} 
               key={item.id} dataRef={item} 
              />
    
    });


  //点击获取树资产
  onclickTree = (selectedKeys, info) => {


    const vm = this;
    const { dispatch } = this.props;
    var params = selectedKeys[0];
    if (params == "00") {
      params = undefined;
    }
    var  exportUrls = this.state.exportUrl + params;
    dispatch({
      type: "TableList/fetchTable",
      payload: params,
      payload: {
        _sort: 'asset_name, ip',
        _order: 'asc',
        _page: 1,
        id: params,
        status: 1
      },
      callback: res => {
        vm.setState({
          tableList: res,
          typeKeys: selectedKeys[0],
          defaultSelect: selectedKeys[0],
          changeGroup: [],
          changeGroupRows: [],
          exportUrlEnd :exportUrls
        });
      }
    });
  };


  //移动树
  onclickMoveTree = (selectedKeys, info) => {
    //获取
    const assetData = this.state.changeGroup;

    //追加修改后的树id
   // assetData[assetData.length]=selectedKeys[0];
    
    
    var assetGroupID = selectedKeys[0];
    this.setState({
      moveTreeGroup: assetGroupID,
      moveAssetIds: assetData,
    })
  };
  //移动资产组
  moveAssetGroupdata = () => {
    const vm = this;
    const { dispatch } = this.props;
    const assetData = this.state.changeGroup;
    var moveAssetIds = this.state.moveAssetIds;
    moveAssetIds[moveAssetIds.length] = this.state.moveTreeGroup;
    dispatch({
      type: "TableList/moveAssetGroup",
      //payload: this.state.moveTreeGroup   将资产的ID  和资产组分开
      payload: moveAssetIds,
      callback: res => {
        if (res) {
          message.success("移动成功");
          vm.setState(
            {
              moveTreeGroup: [],
              moveAssetIds: [],
              changeGroupRows: [],
              changeGroup : [],
              visible: false
            },
            () => {
              // vm.loadData();
              vm.getSourceData();
            }
          );
        } else {
          message.error("移动失败");
        }
      }
    });

  }

  //移动资产
  moveAssetGroup = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onChange = e => {
    this.setState({
      placement: e.target.value,
    });
  };
  //初始化加载
  render() {
    const rowSelection = {      
      selectedRowKeys:this.state.changeGroup,
      onChange: (selectedRowKeys, selectedRows) => {
        var id = [];
        selectedRows.forEach((item, index) => {
          id[index] = item.id;
        });
        this.setState({
          changeGroup: selectedRowKeys,
          changeGroupRows: id
        });
      },
      getCheckboxProps: record => ({
        disabled: record.name === "Disabled User",
        name: record.name
      }),
    };


    const { typeKeys, changeGroup, changeGroupRows, assetTypedata,currentPage,assetTypedataCopy,allTypeAsset } = this.state;
    const { TableList: { data }, loading } = this.props;
    const {
      TableList: { dataList }
    } = this.props;
    let selectkey = [];
    selectkey[0] = this.state.defaultSelect;
    return (
      <Fragment>
        <Row type="flex" className='main_container'>
          <Col span={4}  className='left_search_container'>
            <DirectoryTree
              onSelect={this.onclickTree}
              selectedKeys={selectkey}
              switcherIcon={<Icon type="plus-square" />}
              className={styles.assets_tree}
            >
              <TreeNode title="全部资产" key="00" icon={<Icon type="home" />} />
              {this.renderTreeNodes(this.props.TableList.treeData)}
            </DirectoryTree>
            
            <Button
              type={"primary"}
              onClick={() => {
                this.addGroupData(0);
              }}
              style={{float:'right'}}
            >
              <Icon type="plus-circle" />
              新增
            </Button>
          </Col>
          
          {/* <Col span={20}   className='right_container'> */}
          <Col span={20}  className='right_container' >
            <Button.Group className='btn_group_container'>
              <Button
                type={"primary"}
                disabled={
                  typeKeys[0] == undefined || typeKeys[0] == "0" ? true : false
                }
                onClick={() => {
                  this.addEventDrawer(0);
                }}
              >
                <Icon type="plus-circle" />
                新增
            </Button>
              <Button
                type="primary"
                disabled={changeGroup.length ? false : true}
                onClick={() => this.handleDelete(changeGroupRows)}
              >
                <Icon type="delete" />
                删除
            </Button>
            <Button
                type="primary"
                disabled={changeGroup.length ? false : true}
              >
                <Icon type="caret-right" />
                设置标签
            </Button>
            <Button
                type="primary"
                disabled={changeGroup.length ? false : true}
                onClick={this.moveAssetGroup}
              >
                <Icon type="pause" />
                移动资产
            </Button>
            <Button
                type={"primary"}
                disabled={
                  typeKeys[0] == undefined || typeKeys[0] == "0" ? true : false
                }
                onClick={() => {
                  this.exportAssetObject(typeKeys);
                }}
              >
                <Icon type="cloud-upload" />
                导出组资产
            </Button>

            <Upload 
                  disabled={
                    typeKeys[0] == undefined || typeKeys[0] == "0" ? true : false
                  }
                  ref = "upload"
                  showUploadList= {false}  //是否显示文件列表
                  action= {this.state.exportUrlEnd}
                  onChange= {this.importAssetObject}
                  enctype="multipart/form-data">
                  <Button 
                      type = "primary" 
                      disabled={
                        typeKeys[0] == undefined || typeKeys[0] == "0" ? true : false
                      }
                      icon="cloud-download">导入组资产
                  </Button>
              </Upload>


            </Button.Group>
            {/* <Button.Group style={{ marginLeft: 10, marginBottom: 10 }}>
              <Button
                type="primary"
                disabled={changeGroup.length ? false : true}
              >
                <Icon type="caret-right" />
                设置标签
            </Button>
              <Button
                type="primary"
                disabled={changeGroup.length ? false : true}
                onClick={this.moveAssetGroup}
              >
                <Icon type="pause" />
                移动资产
            </Button>
            </Button.Group>
            <Button.Group>
              <Button
                type={"primary"}
                disabled={
                  typeKeys[0] == undefined || typeKeys[0] == "0" ? true : false
                }
                onClick={() => {
                  this.exportAssetObject(typeKeys);
                }}
              >
                <Icon type="cloud-upload" />
                导出组资产
            </Button>

            <Button.Group>
              <Upload 
                  disabled={
                    typeKeys[0] == undefined || typeKeys[0] == "0" ? true : false
                  }
                  ref = "upload"
                  showUploadList= {false}  //是否显示文件列表
                  action= {this.state.exportUrlEnd}
                  onChange= {this.importAssetObject}
                  enctype="multipart/form-data">
                  <Button 
                      type = "primary" 
                      disabled={
                        typeKeys[0] == undefined || typeKeys[0] == "0" ? true : false
                      }
                      icon="cloud-download">导入组资产
                  </Button>
              </Upload>
            </Button.Group>
            </Button.Group> */}
          
          {/* <div className='content_table' ref={(content) => {this.content = content}}> */}
            <Table
              dataSource={this.state.tableList ? this.state.tableList : null}
              loading={loading} 
              pagination={{ total: parseInt(localStorage.getItem('ListNumber'), 10), current: currentPage }} 
              onChange={this.tableChange} 
              rowKey={record => record.id}
              rowSelection={rowSelection}
              size='middle'
            >
              <Table.Column
                title="资产名称"
                dataIndex="asset_name"
                sorter={(a, b) => a.asset_name.length - b.asset_name.length}
              

                render={(text, row) => {
                  return <a href='javascript:;' onClick={this.showEditDrawer.bind(this, row)}>{text}</a>
                }}

              />
              <Table.Column
                title="资产IP"
                dataIndex="ip"
                sorter={(a, b) => a.ip.length - b.ip.length}
              />
              <Table.Column
                title="资产类型"
                dataIndex="type_id"
                // sorter={(a, b) => a.member.length - b.member.length}
                render={(text, record) => {
                  var assetTypeName = '';
                  this.props.TableList.assetTypedataCopy.forEach(element => {
                    if (element.id === record.type_id) {
                      assetTypeName = element.asset_type_name;
                    }
                  });
                  return <span>{assetTypeName}</span>
                }}
              />
            
              <Table.Column
                title="资产标签"
                dataIndex="description"
                //   sorter={(a, b) => a.description.length - b.description.length}
                width={260}
                render={(text, record) => {
                  //var assetTagName = '';
                  var assetTagName = [];
                  var   tags = record.assetTagID == null? []: record.assetTagID;
                    tags.forEach(elementTagIDs => {
                      this.props.TableList.assetTagdata.forEach(element => {
                      if (elementTagIDs === element.id) {
                        //assetTagName = element.tag_name;
                        assetTagName.push(element.tag_name+ "  ");
                      }
                      });
                    });
                  
                  return <span>{assetTagName}</span>
                }}
              />
              <Table.Column
                title='操作'
                key='action'
                width={120}
                render={(text, record) => (
                  <span>
                    <a onClick={this.showEditDrawer.bind(this, record)} style={{ color: '#1890FF' }}><Icon type="edit"></Icon></a>
                    <Divider type="vertical" />
                    <Popconfirm title="删除不可恢复，是否确认？" okText="删除" cancelText="取消" okType="danger" onConfirm={() => { this.handleDelete(record) }} icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}>
                      <a style={{ color: '#1890FF' }}><Icon type="delete"></Icon></a>
                    </Popconfirm>
                  </span>
                )}
              />
            </Table>
            {/* </div> */}
          </Col>
        </Row>
        <AddDrawer
          wrappedComponentRef={this.AddDrawerRef}W
          getSourceData={this.getSourceData}
          typeKeys={this.state.typeKeys}
          allTypeAsset={this.state.allTypeAsset}
        />
        <EditAssetInfo
          wrappedComponentRef={this.EditDrawerRef}
          getSourceData={this.getSourceData}
          typeKeys={this.state.typeKeys}
          assetTypedata={this.state.assetTypedata}
        />
        <AddAssetGroupInfo
          wrappedComponentRef={this.AddAssetGroupRef}
          typeKeys={this.state.typeKeys}
        />
        <EditAssetGroupInfo
          wrappedComponentRef={this.EditAssetGroupRef}
        />
        {/** 展示可以移动的资产数据*/}
        <Drawer
          style={{ marginLeft: 1000 }}
          title="移动资产"
          placement={this.state.placement}
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          height='600'
        >
          <Row type="flex" style={{ marginTop: 10 }}>
            <Col span={24}>
              <DirectoryTree
                onSelect={this.onclickMoveTree}
                switcherIcon={<Icon type="plus-square" />}
              >
                {this.renderTreeNodes(this.props.TableList.treeData)}
              </DirectoryTree>
            </Col>
          </Row>

          <Row type="flex" style={{ marginBottom: 10 }}>
            <Col span={24} style={{ marginBottom: 10 }}>
              <Button
                onClick={this.moveAssetGroupdata.bind(this)}
                type="primary"
              //  style={{ marginRight: 8, width: "100%" }}
                loading={loading}
              >
                确定
            </Button>
              <Button
                onClick={this.onClose}
                //style={{ width: "100%" }}
                className="cancel"
              >
                取消
            </Button>
            </Col>
          </Row>
          <div className="drawer_left_btn" onClick={this.onClose}>
            <Icon type="right" />
          </div>
        </Drawer>
      </Fragment>

    );
  }
}