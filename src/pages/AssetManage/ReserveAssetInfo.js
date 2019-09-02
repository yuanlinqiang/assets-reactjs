import React, { Component, Fragment } from 'react';
import {Button,Tree,Row,Col,Icon,Table,Card,message,Popconfirm,Input,Form,Divider} from 'antd';
import { connect } from 'dva';
import UpdateReserveAsset from './components/UpdateReserveAsset';

const { success, error, info} = message;

@connect(({ reserviceasset, loading }) => ({
	reserviceasset,
	loading: loading.models.reserviceasset,
}))
@Form.create()
class ReserveAssetInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			groupId: [],
			changeGroup: [],
			tableList:[],
			typeList:[]
		}
  }
	//初始获取数据
	componentDidMount() {
			this.loadData();
			this.loadAssetTypeTree();  //资产所有类型
	}
	//刷新数据
	loadData=()=>{
			const { dispatch } = this.props;
			dispatch({
					type: 'reserviceasset/fetchTable',
					payload: {
					_sort: 'created',
					_order: 'asc',
					},
			})
	}


	 toDate(number) {
		//如果是毫秒的时间戳就不需要这一步，直接下一步就可以
			var date = new Date(number);
			var Y = date.getFullYear() + '-';
			var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
			var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
			var h = date.getHours() + ':';
			var m = date.getMinutes() + ':';
			var s = date.getSeconds();
			return (Y + M + D + " " + h + m + s);
		}
	
	// 追条删除--删除完成刷新数据
	handleDelete = key => {
		const vm = this;
		const { dispatch } = this.props;
		dispatch({
			type:'reserviceasset/DeleteData',
			payload:key.id,
			callback:(res)=>{
					vm.loadData();
					message.success('删除成功')
			}
		})
	};
	 //获取所有的资产类型 数结构
	 loadAssetTypeTree = () => {
		const { dispatch } = this.props;
		dispatch({
		  type: 'TableList/fetchAssetTypeTree',
		  callback:(res)=>{
			  this.setState({
				typeList : res
			  })
     	}
		})
	  };

	//delete 多项删除
	deleteMulti =(data)=>{
		const { dispatch } = this.props;
		const vm = this;
		var list = this.state.changeGroup;	
		dispatch({
			type: 'reserviceasset/removeIds',
			payload: list,
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
	//获取Ref
	getUpdateDrawerRef = drawer => {
		this.updateDrawer = drawer
	}

	showUpdateDrawer = (row, flag) => {
		this.updateDrawer.props.form.setFieldsValue({
			...row,
			uuidAssetGroupId: {
				id: this.state.groupId
			},
		});
		this.updateDrawer.showEditDrawer();
	}

	//初始化加载
	render() {
		const rowSelection = {
			onChange: (selectedRowKeys, selectedRows) => {
				var id='';
				this.setState({
					changeGroup: selectedRowKeys,
				})
			},
		};
		const { groupId, changeGroup, drawerFlag } = this.state;
		const { reserviceasset: { dataList }, loading } = this.props;
		return (
			<Fragment>
				<Row type='flex'  className='main_container'>					
					<Col span={24}  className='right_container'>
						<Button.Group className='btn_group_container'>
							<Button
								type='primary'
								disabled={changeGroup.length ? false : true}
								onClick={ this.deleteMulti.bind(this,dataList)}
							><Icon type="delete"></Icon>删除
							</Button>
						</Button.Group>
						<div className='content_table' ref={(content) => {this.content = content}}>
						<Table
							dataSource={dataList}
							loading={loading}
							rowKey={record => record.id}
							rowSelection={rowSelection}
							size='middle'
						>
							<Table.Column
								title='名称'
								dataIndex='asset_name'
								sorter={(a, b) => a.asset_name.length - b.asset_name.length}
							/>
							<Table.Column
								title='IP'
								dataIndex='ip'
								sorter={(a, b) => a.ip.length - b.ip.length}
							/>
							<Table.Column
								title='类型'
								dataIndex='type_id'
								sorter={(a, b) => a.uuid_type_id.length - b.uuid_type_id.length}
								render={(text, record) => {
									var assetTypeName = '';
									this.state.typeList.forEach(element => {
									  if (element.id === record.type_id) {
										assetTypeName = element.asset_type_name;
									  }
									});
									return <span>{assetTypeName}</span>
								  }}
							/>
							<Table.Column
								title='来源'
								dataIndex='third_type'
								// sorter={(a, b) => a.third_type.length - b.third_type.length}
							/>
							<Table.Column
								title='发现时间'
								dataIndex='created'
								render={(text, record) => {
                                     var   times = this.toDate(text)
									return <span>{times}</span>
								  }}

							/>
							<Table.Column
								title='操作'
								key='action'
								width={120}
								render={(text, record) => (
									<span>
                    {/* <a onClick={this.showUpdateDrawer.bind(this,record)} style={{ color: '#1890FF' }}><Icon type="edit"></Icon></a> */}
                    <Divider type="vertical" />
                    <Popconfirm title="删除不可恢复，是否确认？" okText="删除" cancelText="取消" okType="danger" onConfirm={() => { this.handleDelete(record) }} icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}>
                    <a  style={{ color: 'DodgerBlue' }}><Icon type="delete"></Icon></a>
                    </Popconfirm>
                  </span>
								)}
							/>
						</Table>
						</div>
					</Col>
				</Row>
				<UpdateReserveAsset
					wrappedComponentRef={this.getUpdateDrawerRef}
					loadData={this.loadData}
					groupId={groupId}
				/>
			</Fragment>
		)
	}
}
export default ReserveAssetInfo;
