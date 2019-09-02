import React, { Component, Fragment } from "react";
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Icon,
  message,
  Select,
  Cascader,
  TreeSelect, Tag
} from "antd";
import { connect } from "dva";
import TagColorPicker from './TagColorPicker.js';
import EditAssetTags from './EditAssetTags';

const { Option, OptGroup } = Select;

@connect(({ assettype,reserviceasset,TableList,assettaggroup, loading }) => ({
	assettype, reserviceasset,TableList,assettaggroup,loading: loading.models.assettype
  }))
@Form.create()
export default class UpdateReserveAsset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
	    count: 1,
      assetTypeList:[],
      maptags:{},
    };
  }
  componentDidMount(){
    this.getAssetType();
    this.getAssetGroup();
  }
	getAssetType = () => {
		const { dispatch } = this.props;
		dispatch({
			type: "assettype/fetch",
			payload: {
				_sort: 'display_index',
				_order: 'asc',
			},			
		});
  };
  
  //资产组
  getAssetGroup=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: "TableList/fetch",
      callback: res => {
      }
    });
  }
  //点击鼠标显示标签组信息
  chooseTags=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: "assettaggroup/fetch",
    }); 
    const tempTags = this.props.assettaggroup.data;

    const tempmap = {};
    for(var tag of tempTags){
      if(tag.assetTagSet.length==0){
        tempmap[tag.name]=[];
      }else{          
        const listForTags = [];  
        for(var child of tag.assetTagSet){ 
          listForTags.push(<Option value={child.uuid_id}><Tag color={child.color}>{child.name}</Tag></Option>)    
        }
        tempmap[tag.name]=listForTags;  
        
      }     
    }

    this.setState({
      maptags: tempmap,
    })
  }
  
  onChange = value => {};
  onBlur = value => {};
  onFocus = () => {};
  onSearch = val => {};
  onChangeProvince = value => {};
  //新增接口
  addInterface = () => {
    const { form } = this.props;
    const keys = form.getFieldValue("keys");
    const nextKeys = keys.concat(this.state.count);
    form.setFieldsValue({
      keys: nextKeys
    });
    const count = this.state.count;
    this.setState({
      count: count + 1
    });
  };
  //移除接口
  removeInterface = k => {
    const { form } = this.props;
    const keys = form.getFieldValue("keys");
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };
  showEditDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState(
      {
        visible: false
      },
      () => {
        this.props.form.resetFields();
      }
    );
  };
  onSave = () => {
    const { form, dispatch, typeKeys } = this.props;
    form.validateFields((err, val) => {
      if (!err) {
        var locationInfo = "未知";
        if (val.IP != undefined && val.IP.length > 0) {
          val.IP[0] = val.interIp;
          val.MAC[0] = val.interMac;
        } else {
          val.IP = [];
          val.MAC = [];
          val.IP[0] = val.interIp;
          val.MAC[0] = val.interMac;
        }
        if (val.location != undefined && val.location.length > 0) {
          locationInfo =
            val.location[0] + "," + val.location[1] + "," + val.location[2];
        }
        let value = {
          ...val,
         // name: val.name,
         // uuidAssetGroupId: {
         //   uuid_id: typeKeys
         // },
          //uuid_type_id: val.typeId,
          uuid_type_id: val.uuid_type_id,
          type_code: val.uuid_type_id,
          //ip: val.ip,
         // mac: val.mac,
         // sn: val.sn,
          //manufacturer: val.manufacturer,
          location: locationInfo,
          //contact: val.contact,
         // description: val.description,
          //标签 Tagname:val.Tagname,
         // confidentiality: val.confidentiality,
         // value: val.value,
          //availability: val.availability,
         // grade: val.grade,
         // integrity: val.integrity,
        //  interfaceIp: val.IP,
         // interfaceMac: val.MAC
        };
        dispatch({
          type:
           // drawerFlag == "0"
              "TableList/AddAssetData",
              //: "TableList/PtachData",
          payload: value,
          callback: res => {
            if (res) {
              message.success("添加成功");
              this.setState(
                {
                  visible: false
                },
                () => {
                  
                  this.props.form.resetFields();
                }
              );
            } else {
              message.error("添加失败");
            }
          }
        });
      }
    });
  };
  render() {
  const { assettype:{data},loading } = this.props;
  const groupdata = this.props.TableList.treeData;
  const maptags = this.state.maptags;

  if(groupdata!=null && groupdata!=undefined){
    for(let item of groupdata){
      item.title = item.name;
      item.key = item.value = item.uuid_id
      if(item.children!=null && item.children.length>0){
        for(let childidx in item.children){
          item.children[childidx].title = item.children[childidx].name;
          item.children[childidx].key = item.children[childidx].value =item.children[childidx].uuid_id;
        }
      }
    }
  }
  if(data!=null && data!=undefined){
    for(let item of data){
      item.title = item.name;
      item.key = item.value = item.uuid_id
      if(item.children!=null && item.children.length>0){
        for(let childidx in item.children){
          item.children[childidx].title = item.children[childidx].name;
          item.children[childidx].key = item.children[childidx].value =item.children[childidx].uuid_id;
        }
      }
    }
  }
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    };
    const formItemLayoutForGroup = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 }
    };
    const { getFieldValue } = this.props.form;
    //省市区
    const options = [
      {
        value: "浙江",
        label: "浙江",
        children: [
          {
            value: "杭州",
            label: "杭州",
            children: [
              {
                value: "西湖",
                label: "西湖"
              }
            ]
          }
        ]
      },
      {
        value: "江苏",
        label: "江苏",
        children: [
          {
            value: "南京",
            label: "南京",
            children: [
              {
                value: "中华门",
                label: "中华门"
              }
            ]
          }
        ]
      }
    ];
    getFieldDecorator("keys", { initialValue: [] });
    const keys = getFieldValue("keys");
    const formItems = keys.map((k, index) => (
      <Row justify="start" type="flex">
        <Col span={12}>
          <Form.Item label="IP" {...formItemLayout}>
            {getFieldDecorator(`IP[${k}]`, {
              validateTrigger: ["onChange", "onBlur"],
              rules: [
                {
                  required: false,
                  whitespace: true,
                  message: ""
                }
              ]
            })(<Input placeholder="请输入接口IP地址" />)}
          </Form.Item>
        </Col>
        <Col span={11}>
          <Form.Item label="MAC" {...formItemLayout}>
            {getFieldDecorator(`MAC[${k}]`, {
              validateTrigger: ["onChange", "onBlur"],
              rules: [
                {
                  required: false,
                  whitespace: true,
                  message: ""
                }
              ]
            })(<Input placeholder="请输入接口MAC地址" />)}
          </Form.Item>
        </Col>
        <Col span={1}>
          {keys.length >= 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.removeInterface(k)}
              style={{ fontSize: "16px", color: "#08c", margin: "1.5vh" }}
            />
          ) : null}
        </Col>
      </Row>
    ));
 
    return (
      <Fragment>
        <Drawer
          title={"查看|编辑"}
          width={900}
          onClose={this.onClose}
          closable={false}
          visible={this.state.visible}
          className="drawer"
        >
          <Form>
            <Row justify="start" type="flex">
              <Col span={24}>
                <fieldset>
                  <legend>基本属性</legend>
                </fieldset>
              </Col>
              <Col span={24}>
                <Form.Item label="资产组" {...formItemLayoutForGroup}>
                  {getFieldDecorator("uuidAssetGroupId.id", {
                    rules: [
                      { required: true, message: "请选择资产组" }
                    ]
                  })(
                    <TreeSelect treeData={this.props.TableList.treeData}  />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="资产名称" {...formItemLayout}>
                  {getFieldDecorator("asset_name", {
                    rules: [
                      { required: true, message: "资产名称不超过64个字符" }
                    ]
                  })(
                    <Input
                      style={{ width: "100%" }}
                      placeholder="资产名称不超过64个字符"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="资产类型" {...formItemLayout}>
                {getFieldDecorator('type_id', {
                    rules: [
                      { required: true, message: "请选择资产类型" }
                    ]
                  })(<TreeSelect treeData={data} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="管理IP" {...formItemLayout}>
                  {getFieldDecorator("ip", {
                    rules: [{ required: true, message: "请输入管理IP" }]
                  })(
                    <Input
                      style={{ width: "100%" }}
                      placeholder="请输入管理IP"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="MAC地址" {...formItemLayout}>
                  {getFieldDecorator("mac", {
                    // rules: [{ required: true, message: 'Please enter url' }],
                  })(
                    <Input
                      style={{ width: "100%" }}
                      placeholder="请输入MAC地址"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="序列号" {...formItemLayout}>
                  {getFieldDecorator("sn", {
                    rules: [
                      {
                        required: false,
                        message: "请输入序列号"
                      }
                    ]
                  })(<Input placeholder="请输入序列号" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="生产厂商" {...formItemLayout}>
                  {getFieldDecorator("manufacturer", {
                    rules: [
                      {
                        required: false,
                        message: "请输入生产厂商"
                      }
                    ]
                  })(
                    <Select
                      showSearch
                      style={{ width: 300 }}
                      placeholder="选择厂商"
                      optionFilterProp="children"
                      onChange={this.onChange}
                      onFocus={this.onFocus}
                      onBlur={this.onBlur}
                      onSearch={this.onSearch}
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option value="齐治">齐治</Option>
                      <Option value="IBM">IBM</Option>
                      <Option value="戴尔">戴尔</Option>
                      <Option value="中兴">中兴</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="地址位置" {...formItemLayout}>
                  {getFieldDecorator("location", {
                    rules: [
                      {
                        required: false,
                        message: "地址位置"
                      }
                    ]
                  })(
                    <Cascader
                      options={options}
                      onChange={this.onChangeProvince}
                      placeholder="请选择省市区"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="设备联系人" {...formItemLayout}>
                  {getFieldDecorator("contact", {
                    rules: [
                      {
                        required: false,
                        message: "请输入设备联系人"
                      }
                    ]
                  })(<Input placeholder="请输入设备联系人" />)}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="描述"
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                >
                  {getFieldDecorator("description", {
                    rules: [
                      {
                        required: false,
                        message: "请输描述信息"
                      }
                    ]
                  })(
                    <Input.TextArea
                      placeholder="请输入描述信息"
                      style={{ width: "200vh" }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <fieldset>
                  <legend>资产标签</legend>
                </fieldset>
              </Col>
              <Col span={24}>
                <Form.Item label="资产标签" {...formItemLayout}>
                  {getFieldDecorator("Tagname")(
                    <EditAssetTags />
                  )}
                </Form.Item>   
              </Col>
              <Col span={12} />
              <Col span={24}>
                <fieldset>
                  <legend>安全属性</legend>
                </fieldset>
              </Col>
              <Col span={12}>
                <Form.Item label="机密性" {...formItemLayout}>
                  {getFieldDecorator("confidentiality",  {
                    rules: [
                      {
                        required: true,
                        message: "请输描述信息"
                      }
                    ]
                  })(
                    <Select
                      initialValue="可忽略"
                      style={{ width: "33vh" }}
                      onChange={this.handleChange}
                    >
                      <Option value="1">可忽略</Option>
                      <Option value="0">低</Option>
                      <Option value="2">中等</Option>
                      <Option value="3">高</Option>
                      <Option value="4">极高</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="资产价值" {...formItemLayout}>
                  {getFieldDecorator("value", {
                    rules: [
                      {
                        required: true,
                        message: "请输描述信息"
                      }
                    ]
                  })(
                    <Select
                      initialValue="低"
                      style={{ width: "33vh" }}
                      onChange={this.handleChange}
                    >
                      <Option value="0">低</Option>
                      <Option value="1">中低</Option>
                      <Option value="2">中</Option>
                      <Option value="3">中高</Option>
                      <Option value="4">高</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="可用性" {...formItemLayout}>
                  {getFieldDecorator("availability", {
                    rules: [
                      {
                        required: true,
                        message: "请输描述信息"
                      }
                    ]
                  })(
                    <Select
                      initialValue="可忽略"
                      style={{ width: "33vh" }}
                      onChange={this.handleChange}
                    >
                      <Option value="1">可忽略</Option>
                      <Option value="0">低</Option>
                      <Option value="2">中等</Option>
                      <Option value="3">高</Option>
                      <Option value="4">极高</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="等保级别 " {...formItemLayout}>
                  {getFieldDecorator("grade", {
                    rules: [
                      {
                        required: true,
                        message: "请输描述信息"
                      }
                    ]
                  })(
                    <Select
                      style={{ width: "33vh" }}
                      onChange={this.handleChange}
                    >
                      <Option value="0">不评级</Option>
                      <Option value="111">S1A1G1</Option>
                      <Option value="122">S1A2G2</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="完整性" {...formItemLayout}>
                  {getFieldDecorator("integrity", {
                    rules: [
                      {
                        required: true,
                        message: "请输描述信息"
                      }
                    ]
                  })(
                    <Select
                      initialValue="可忽略"
                      style={{ width: "33vh" }}
                      onChange={this.handleChange}
                    >
                      <Option value="1">可忽略</Option>
                      <Option value="0">低</Option>
                      <Option value="2">中等</Option>
                      <Option value="3">高</Option>
                      <Option value="4">极高</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12} />
              <Col span={24}>
                <fieldset>
                  <legend>接口</legend>
                </fieldset>
              </Col>
            </Row>
            <Row justify="start" type="flex">
              <Col span={12}>
                <Form.Item label="IP" {...formItemLayout}>
                  {getFieldDecorator("interfaceIp")(
                    <Input placeholder="请输入接口IP地址" />
                  )}
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item label="MAC" {...formItemLayout}>
                  {getFieldDecorator("interfaceMac")(
                    <Input placeholder="请输入接口MAC地址" />
                  )}
                </Form.Item>
              </Col>
              {/* <Col span={1}>
                <a onClick={this.addInterface}>
                  <Icon
                    type="delete"
                    style={{ fontSize: "16px", color: "#08c", margin: "1.5vh" }}
                  />
                </a>
              </Col> */}
            </Row>
            {/* {formItems} */}
            <Row justify="start" type="flex">
              <Col span={24} hidden={true}>
                <Form.Item label="id" {...formItemLayout}>
                  {getFieldDecorator("id")(<Input  />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Row type="flex" justify="space-around">
            <Col span={11}>
              <Button
                onClick={this.onSave.bind(this)}
                type="primary"
                style={{ marginRight: 8, width: "100%" }}
                loading={loading}
              >
                转正式
              </Button>
            </Col>
            <Col span={11}>
              <Button
                onClick={this.onClose}
                style={{ width: "100%" }}
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
