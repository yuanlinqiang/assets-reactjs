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
  Cascader
} from "antd";
import { connect } from "dva";
const { Option } = Select;
@connect(({ TableList, loading }) => ({
  TableList,
  loading: loading.effects["TableList/PtachData"]
}))
@Form.create()
export default class EditAssetGroupInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
     // count: 1
    };
  }
  onChange = value => {};
  onBlur = value => {};
  onFocus = () => {};
  onSearch = val => {};
  //设置
  editGroupDrawer = () => {
    this.setState({
      visible: true
    });

    //this.props.fun();
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
    const { form, dispatch} = this.props;
    var typeKeys = this.props.typeKeys;
    if(typeKeys!=undefined&&typeKeys.length <=0){
       typeKeys=undefined;
    }
    form.validateFields((err, val) => {
      if (!err) {
        let value = {
          id:val.id,
          asset_group_name: val.assetGroupName,
         // id:typeKeys,
          value:val.assetValue,
          grade:val.assetlevel,
          description:val.description,
        };
        dispatch({
          type:
              "TableList/updateAssetGroupData",
          payload: value,
          callback: res => {
            if(res){
              message.success('编辑成功');
              dispatch({
                type:"TableList/fetch"
              })
              this.setState({
                visible:false
              })
              this.props.form.resetFields();
            } else {
              message.error('编辑失败');
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
      labelCol: { span: 3 },
      wrapperCol: { span: 21 }
    };
    const { getFieldValue } = this.props.form;
    getFieldDecorator("keys", { initialValue: [] });
   

    const keys = getFieldValue("keys");
    return (
      <Fragment>
        <Drawer
          title={"编辑资产组"}
          width={900}
          onClose={this.onClose}
          closable={false}
          visible={this.state.visible}
          className="drawer"
        >
          <Form>
            <Row>
              <Col span={24}>
                <Form.Item label="资产组名称" {...formItemLayout}>
                  {getFieldDecorator("assetGroupName", {
                    rules: [
                      { required: true, message: "请输入资产组名称" }
                    ]
                  })(
                    <Input
                      style={{ width: "100%" }}
                      placeholder="请输入资产组名称"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="资产组价值" {...formItemLayout}>
                  {getFieldDecorator("assetValue", {
                    rules: [
                      {
                        required: true,
                        message: "请选择资产组价值"
                      }
                    ]
                  })(
                    <Select
                      showSearch
                     // style={{ width: 300 }}
                      placeholder="选择资产组价值"
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
                      <Option value={1}>低</Option>
                      <Option value={2}>中低</Option>
                      <Option value={3}>中</Option>
                      <Option value={4}>中高</Option>
                      <Option value={5}>高</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="等保级别" {...formItemLayout}>
                  {getFieldDecorator("assetlevel", {
                    rules: [
                      {
                        required: true,
                        message: "请选择等保级别"
                      }
                    ]
                  })(
                    <Select
                      //style={{ width: "38vh" }}
                      onChange={this.handleChange}
                    >
                      {/* <Option value={1}>不评级</Option>
                      <Option value={0}>S1A1G1</Option>
                      <Option value={2}>S1A2G2</Option>
                      <Option value={3}>S3A3G3</Option>
                      <Option value={4}>S4A$G4</Option>
 */}
                      <Option value={0} >不评级</Option>
                      <Option value={111}>S1A1G1</Option>
                      <Option value={122}>S1A2G2</Option>
                      <Option value={222}>S2A2G2</Option>
                      <Option value={212}>S2A1G2</Option>
                      <Option value={133}>S1A3G3</Option>
                      <Option value={233}>S2A3G3</Option>
                      <Option value={333}>S3A3G3</Option>
                      <Option value={323}>S3A2G3</Option>
                      <Option value={313}>S3A1G3</Option>
                      <Option value={144}>S1A4G4</Option>
                      <Option value={244}>S2A4G4</Option>
                      <Option value={344}>S3A4G4</Option>
                      <Option value={444}>S4A4G4</Option>
                      <Option value={434}>S4A3G4</Option>
                      <Option value={424}>S4A2G4</Option>
                      <Option value={414}>S4A1G4</Option>
                    </Select>
                  )}
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
                        message: "请输入资产组描述信息"
                      }
                    ]
                  })(
                    <Input.TextArea
                      placeholder="请输入资产组描述信息"
                      //style={{ width: "200vh" }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row style={{justify:'left'}} type="flex">
              <Col span={24} hidden={true}>
                {/* <Form.Item label="id" {...formItemLayout}>
                {getFieldDecorator('id', {
                        })(<Input hidden />)}
                </Form.Item> */}

                 <Form.Item>
                    {getFieldDecorator('id', {})(<Input hidden />)}
                </Form.Item>

              </Col>
            </Row>
          </Form>
          <Row>
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
