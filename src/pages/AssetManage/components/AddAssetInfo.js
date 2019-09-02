import React, { Component, Fragment } from "react";
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Tree,
  TreeSelect,
  Input,
  Icon,
  message,
  Select,
  Cascader
} from "antd";
import SelectTag from './SelectTag';
import { connect } from "dva";
const { Option } = Select;
const { TreeNode } = TreeSelect;

@connect(({ TableList, loading, assettaggroup }) => ({
  TableList,
  assettaggroup,
  loading: loading.effects["TableList/PtachData"]
}))
@Form.create()
export default class AddAssetInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value :undefined,
      assetTypeList: [],
      assetTagList: [],
      allTypeAsset:[],
      visible: false,
      count: 1
    };
  }


  //资产标签
  fetchAssetTag=(callback)=>{
    const vm = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'TableList/fetchAssetTagTree',
      callback: res => {
        vm.setState({
          assetTagList: res
        },() => {
          if (callback) callback();
        });
      }
    });
  };

  renderTreeNodes = datas =>
    datas.map(item => {
      if (item.children.length>0) {
        return (
          <TreeNode value={item.id} title={item.text} key={item.id}>>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={item.text} key={item.id}/>
    });

  addNewTag = (obj,callback) => {
    const { dispatch } = this.props;
    dispatch({
      type:'assettaggroup/addtag',
      payload:obj,
      callback:(res) => {
        this.fetchAssetTag();
        callback(res)
      }
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
  
  showDrawer = () => {
    this.setState({
      visible: true,
      allTypeAsset:this.props.TableList.allTypeAsset,
    });
  };

  showNewDrawer = (typeKeys) => {
  };
  onChangeSelect = value => {
    this.setState({ value });
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
  onGroup = () => {
    const { form, dispatch, getSourceData, typeKeys } = this.props;

    form.validateFields((err, val) => {
      if (!err) {
        // var locationInfo = "未知";
        // if (val.location != undefined && val.location.length > 0) {
        //   locationInfo =
        //     val.location[0] + "," + val.location[1] + "," + val.location[2];
        // }
        

       
        var  tags   = val.tagId ? val.tagId.tagId:'';

        let value = {
          asset_name: val.name,
          levelcode:typeKeys, //树节点的ID   取层级几点
          type_id: val.typeId,
          type_code: '/server/linux',
          ip: val.ip,
          mac: val.mac,
          sn: val.sn,
          manufacturer: val.manufacturer,
          location: val.location,
          contact: val.contact,
          description: val.description,
          // assetTagID:val.TagId,
          assetTagID: val.tagId ? val.tagId.tagId:[],
          confidentiality: val.confidentiality,
          value: val.value,
          availability: val.availability,
          grade: val.grade,
          integrity: val.integrity,
          inter_ip: val.interIp,
          inter_mac: val.interMac,
          status : 1
        };
       dispatch({
          type:
              "TableList/AddAssetData",
          payload: value,
          callback: res => {
            if (res) {
              message.success("添加成功");
              this.setState(
                {
                  visible: false
                },
                () => {
                  getSourceData();
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
    const {loading } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
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
      <Row>
       >
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
          title={"新增资产"}
          width={1100}
          onClose={this.onClose}
          closable={false}
          visible={this.state.visible}
          className="drawer"
        >
          <Form>
            <Row style={{justify:'left'}} type="flex">
              <Col span={24}>
                <fieldset>
                  <legend>基本属性</legend>
                </fieldset>
              </Col>
              <Col span={12}>
                <Form.Item label="资产名称" {...formItemLayout}>
                  {getFieldDecorator("name", {
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
                   {getFieldDecorator("typeId", {
                     rules: [{ required: true, message: "请输入具体资产类型" }]
                   })(
                     <TreeSelect
                       placeholder="请输入具体资产类型"
                       treeDefaultExpandAll
                       allowClear
                     >
                       {this.renderTreeNodes(this.state.allTypeAsset)}
                     </TreeSelect>
                   )}
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
                      <Option value="qizhi">齐治</Option>
                      <Option value="ibm">IBM</Option>
                      <Option value="micsoft">微软</Option>
                      <Option value="cisco">思科</Option>
                       <Option value="huawei">华为</Option>
                       <Option value="h3c">H3C</Option>
                       <Option value="venus">启明星辰</Option>
                       <Option value="legendsec">网神</Option>
                       <Option value="dell">戴尔</Option>
                       <Option value="digitalchina">神州数码</Option>
                       <Option value="zte">中兴</Option>
                       <Option value="adt">安达通</Option>
                       <Option value="amaranten">阿姆瑞特</Option>
                       <Option value="anmeng">安盟</Option>
                       <Option value="dptech">迪普</Option>
                       <Option value="founder">方正</Option>
                       <Option value="neteye">东软</Option>
                       <Option value="hp">惠普</Option>
                       <Option value="nsfocus">绿盟</Option>
                       <Option value="topsec">天融信</Option>
                       <Option value="rising">瑞星</Option>
                       <Option value="sangfor">深信服</Option>
                       <Option value="ruijie">锐捷</Option>
                       <Option value="panda">熊猫</Option>
                       <Option value="hb">汉邦</Option>
                   
                    </Select>
                  )}
                </Form.Item>
              </Col>
              {/* <Col span={12}>
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
              </Col> */}
              <Col span={12}>
                <Form.Item label="地址位置" {...formItemLayout}>
                {getFieldDecorator("location", {
                    rules: [
                      {
                        required: false,
                        message: "请输入地址位置"
                      }
                    ]
                  })(<Input placeholder="请输入地址位置" />)}
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
                <Form.Item 
                  label="资产标签" 
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                >
                  {getFieldDecorator("tagId")(<SelectTag onFocus={this.fetchAssetTag} assetTagList={this.state.assetTagList} addNewTag={this.addNewTag} />)}
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
                  {getFieldDecorator("confidentiality", {
                    rules: [
                      {
                        required: true,
                        message: "请输描述信息"
                      }
                    ]
                  })(
                    <Select
                      initialValue="0"
                      style={{ width: "38vh" }}
                      onChange={this.handleChange}
                    >
                      <Option value="0">可忽略</Option>
                      <Option value="1">低</Option>
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
                      style={{ width: "38vh" }}
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
                      style={{ width: "38vh" }}
                      onChange={this.handleChange}
                    >
                      <Option value="0">可忽略</Option>
                      <Option value="1">低</Option>
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
                      style={{ width: "38vh" }}
                      onChange={this.handleChange}
                    >
                      <Option value="0" >不评级</Option>
                      <Option value="111">S1A1G1</Option>
                      <Option value="122">S1A2G2</Option>
                      <Option value="222">S2A2G2</Option>
                      <Option value="212">S2A1G2</Option>
                      <Option value="133">S1A3G3</Option>
                      <Option value="233">S2A3G3</Option>
                      <Option value="333">S3A3G3</Option>
                      <Option value="323">S3A2G3</Option>
                      <Option value="313">S3A1G3</Option>
                      <Option value="144">S1A4G4</Option>
                      <Option value="244">S2A4G4</Option>
                      <Option value="344">S3A4G4</Option>
                      <Option value="444">S4A4G4</Option>
                      <Option value="434">S4A3G4</Option>
                      <Option value="424">S4A2G4</Option>
                      <Option value="414">S4A1G4</Option>

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
                      style={{ width: "38vh" }}
                      onChange={this.handleChange}
                    >
                      <Option value="0">可忽略</Option>
                      <Option value="1">低</Option>
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
            <Row style={{justify:'left'}} type="flex">
              <Col span={12}>
                <Form.Item label="IP" {...formItemLayout}>
                  {getFieldDecorator("interIp")(
                    <Input placeholder="请输入接口IP地址" />
                  )}
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item label="MAC" {...formItemLayout}>
                  {getFieldDecorator("interMac")(
                    <Input placeholder="请输入接口MAC地址" />
                  )}
                </Form.Item>
              </Col>
              <Col span={1}>
                <a onClick={this.addInterface}>
                  <Icon
                    type="plus-circle"
                    style={{ fontSize: "16px", color: "#08c", margin: "1.5vh" }}
                  />
                </a>
              </Col>
            </Row>
            {formItems}
            <Row style={{justify:'left'}} type="flex">
              <Col span={24} hidden={true}>
                <Form.Item label="id" {...formItemLayout}>
                  {getFieldDecorator("id")(<Input />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Row type="flex" style={{justify:'space-around'}}>
            <Col span={11}>
              <Button
                onClick={this.onGroup.bind(this)}
                type="primary"
                style={{ marginRight: 8, width: "100%" }}
                loading={loading}
              >
                确定
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
