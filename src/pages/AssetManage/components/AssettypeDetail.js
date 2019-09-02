import React, { Component } from 'react';
import { Drawer,Form, Button,Icon, Input, Radio, TreeSelect, Modal, Cascader, Row, Col } from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

@Form.create()
class AssettypeDetail extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { visible, onClose, form, residences, topUnit,treeData } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};

    return (
      <div style={{ display: 'inline' }}>
        <Drawer
          title='查看'
          visible={visible}
          onClose={onClose}
          maskClosable={true}
          width={900}
          className='drawer'
        >
          <div style={{ height: 'auto', overflowY: 'auto', margin: '-24px', padding: '24px' }}>
              {/* <Row>
                <FormItem
                  label="上级单位"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 19 }}
                >{getFieldDecorator('parentId', {
                })(
                  <TreeSelect
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    disabled
                    treeData={topUnit}
                    placeholder="请选择上级单位"
                    treeDefaultExpandAll
                  />
                )}
                </FormItem>
              </Row> */}
             <Form  style={{ margin: 20 }}>
              <Row>              
                <Form.Item label="名称"  {...formItemLayout}>
                  {getFieldDecorator('asset_type_name', {
                    rules: [{ required: true, message: '请输入类型名称!' },{
                      max: 10,
                      message: '不得大于10个字符',
                    }],
                  })(<Input readOnly/>)}
                </Form.Item>
                <Form.Item label="所属类型" {...formItemLayout} >
                    {getFieldDecorator('root_id')(<TreeSelect treeData={treeData} disabled={false}/>)}
                   
                   

                </Form.Item>              
                <Form.Item label="编号" {...formItemLayout}>
                  {getFieldDecorator('code', {
                      rules: [{ required: true, message: '请选择所属类型!' }],
                    })(<Input placeholder="请输入正确编号格式" readOnly/>)}
                </Form.Item> 
                <Form.Item label="图标名称" {...formItemLayout}>
                  {getFieldDecorator('icon')(<Input readOnly/>)}
                </Form.Item>
                <Form.Item label="fonticon显示图标" {...formItemLayout}>
                  {getFieldDecorator('iconclass')(<Input readOnly/>)}
                </Form.Item>
                {/* <Form.Item label="节点级次码" {...formItemLayout}>
                  {getFieldDecorator('levelcode')(<Input readOnly/>)}
                </Form.Item> */}
                {<Form.Item label="是否是内置类型" {...formItemLayout} className="collection-create-form_last-form-item">
                  {getFieldDecorator('is_builtin')(
                    <Radio.Group disabled={true}>
                       <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>}
                {<Form.Item label="是否支持配置核查" {...formItemLayout} className="collection-create-form_last-form-item">
                  {getFieldDecorator('is_cvs')(
                    <Radio.Group disabled={true}>
                      <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>}
                {<Form.Item label="是否为通用类型" {...formItemLayout} className="collection-create-form_last-form-item">
                  {getFieldDecorator('is_common')(
                    <Radio.Group disabled={true}>
                      <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>}
                <Form.Item label="显示顺序" {...formItemLayout}>
                  {getFieldDecorator('display_index')(<Input readOnly/>)}
                </Form.Item>
                <Form.Item label="描述" {...formItemLayout}>
                  {getFieldDecorator('description')(<Input.TextArea rows={4} readOnly/>)}
                </Form.Item>
              </Row>             
            </Form>
          </div>
          <Row type='flex' justify='space-around'>
						{/* <Col span={11}>
							<Button onClick={this.onGroup.bind(this)} type="primary" style={{ marginRight: 8, width: '100%' }} loading={loading}>
								确定
				      </Button>
						</Col> */}
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
      </div>
    );
  }
}

export default AssettypeDetail;
