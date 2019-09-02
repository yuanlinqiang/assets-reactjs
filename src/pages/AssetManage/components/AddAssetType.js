import React, { Component,Fragment } from 'react';
import { InputNumber, Row,TreeSelect } from 'antd';
import {
  Drawer,Button, Modal, Form, Input, Radio,Col,Icon
  } from 'antd';
  

  

  @Form.create()
  class AddAssetType extends Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }
      render() {
        const {
          visible, onClose, onOk, form,treeData,data
        } = this.props;

        const { getFieldDecorator } = form;
        const formItemLayout = {
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
        };
        //style={{ margin: 20 }}
        return (
          <Fragment>
          <Drawer
            visible={visible}
            title="新增资产类型"
            onClose={onClose}
            closable={false}
            onOk={onOk}
            width={900}
            className='drawer'
          > 
            <Form  >
              <Row >            
                  <Form.Item label="名称" {...formItemLayout} >
                    {getFieldDecorator('asset_type_name', {
                      rules: [{ required: true, message: '请输入类型名称!' },{
                        max: 10,
                        message: '不得大于10个字符',
                      }],
                    })(<Input />)}
                  </Form.Item> 

                  {/* <Form.Item label="所属类型" {...formItemLayout} >
                    {getFieldDecorator('root_id',{
                      
                    })(<TreeSelect treeData={treeData} />)}
                  </Form.Item>   */}
                  <Form.Item label="所属类型" {...formItemLayout} >
                    {getFieldDecorator('root_id',{
                      
                    })( 
                    <TreeSelect
                    onClick = {this.chooseAssetType}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={treeData}
                      placeholder="请选择上级菜单(默认创建父节点)"
                      treeDefaultExpandAll
                      allowClear
                    >
                    </TreeSelect>)}
                  </Form.Item>  




                  {/* <FormItem
                  label="上级菜单名称"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 19 }}
                >{getFieldDecorator('parentId', {
                })(
                  <TreeSelect
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={this.props.resource.menu}
                    placeholder="请选择上级菜单"
                    treeDefaultExpandAll
                    allowClear
                  >
                  </TreeSelect>
                )}</FormItem> */}




                  <Form.Item label="编号" {...formItemLayout} >
                    {getFieldDecorator('code', {
                      rules: [{ required: true, message: '请输入编号!' }],
                    })(<Input placeholder="请输入正确编号格式"/>)}
                  </Form.Item>                  
                <Form.Item label="图标名称" {...formItemLayout} >
                  {getFieldDecorator('icon')(<Input />)}
              </Form.Item> 
                <Form.Item label="fonticon显示图标" {...formItemLayout}>
                  {getFieldDecorator('iconclass')(<Input />)}
                </Form.Item>
                {/* <Form.Item label="节点级次码" {...formItemLayout}>
                  {getFieldDecorator('levelcode')(<Input />)}
                </Form.Item> */}
                <Form.Item label="是否是内置类型" {...formItemLayout} className="collection-create-form_last-form-item">
                  {getFieldDecorator('is_builtin',{
                     initialValue: '0',
                  })(
                    <Radio.Group>
                      <Radio value="1">是</Radio>
                      <Radio value="0">否</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
                <Form.Item label="是否支持配置核查" {...formItemLayout} className="collection-create-form_last-form-item">
                  {getFieldDecorator('is_cvs',{
                     initialValue: '0',
                  })(
                    <Radio.Group>
                      <Radio value="1">是</Radio>
                      <Radio value="0">否</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
                <Form.Item label="是否为通用类型" {...formItemLayout} className="collection-create-form_last-form-item">
                  {getFieldDecorator('is_common',{
                     initialValue: '0',
                  })(
                    <Radio.Group>
                      <Radio value="1">是</Radio>
                      <Radio value="0">否</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
                <Form.Item label="显示顺序" {...formItemLayout}>
                  {getFieldDecorator('display_index')(<Input />)}
                </Form.Item>
                <Form.Item label="描述" {...formItemLayout}>
                  {getFieldDecorator('description')(<Input.TextArea rows={4} />)}
                </Form.Item>
              </Row>       
              {/* <Row justify="left" type="flex">
              <Col span={24} hidden={true}>
                 <Form.Item>
                    {getFieldDecorator('parent.id', {})(<Input hidden />)}
                </Form.Item>

              </Col>
            </Row>       */}
            </Form>
            <Row type='flex' justify='space-around'>
						<Col span={11}>
							<Button onClick={onOk} type="primary" style={{ marginRight: 8, width: '100%' }} >
								确定
				      </Button>
						</Col>
						<Col span={11}>
							<Button onClick={onClose} style={{ width: '100%' }} className='cancel'>
								取消
				      </Button>
						</Col>
					</Row>
					<div className='drawer_left_btn' onClick={onClose}>
						<Icon type="right" />
					</div>
          </Drawer>
          </Fragment>
        );
      }
    }


  export default AddAssetType;
  
  