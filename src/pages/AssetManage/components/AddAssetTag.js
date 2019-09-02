import React, { Component,Fragment } from 'react';
//import { CompactPicker } from 'react-color';
import { InputNumber, Row,TreeSelect } from 'antd';
import {
  Drawer,Button, Modal, Form, Input, Radio,Col,Icon
  } from 'antd';
import TagColorPicker from './TagColorPicker.js';
  @Form.create()
  class AddAssetTag extends Component {
    constructor(props) {
      super(props);
    }
      render() {
        const {
          visible, onClose, onOk, form,title
        } = this.props;
        const { getFieldDecorator } = form;
        const formItemLayout = {
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
        };
        return (
          <Fragment>
          <Drawer
            visible={visible}
            title={title}
            onClose={onClose}
            closable={false}
            onOk={onOk}
            width={900}
            className='drawer'
          > 
          
            <Form  >
              <Row>               
                    <Form.Item label="标签名称" {...formItemLayout} >
                        {getFieldDecorator('tag_name', {
                        rules: [{ required: true, message: '请输入标签姓名!' },{
                            max: 10,
                            message: '不得大于10个字符',
                        }],
                        })(<Input />)}
                    </Form.Item> 
                    <Form.Item label="颜色" {...formItemLayout}>
                    {getFieldDecorator('color', {
                        rules: [{ required: true, message: '请选择颜色!' }],
                        })(<TagColorPicker />)}
                    </Form.Item>
              </Row>             
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
  export default AddAssetTag;
  
  