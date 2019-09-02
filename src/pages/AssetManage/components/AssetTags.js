import { Tag,message,Modal, Input, Tooltip, Icon } from 'antd';
import AddAssetTag from './AddAssetTag';
import { connect } from 'dva';
const { success, error, info} = message;
const { confirm } = Modal;
@connect(({ assettaggroup, loading }) => ({
  assettaggroup, loading: loading.models.assettaggroup,
}))
class AssetTags extends React.Component {
  state = {
    tagFormVisible: false,
    tagUpdateFormVisible:false,
    currentTag:{},
  };

  saveTagFormRef = (ref)=>{
    this.tagFormRef = ref;
  }
  updateTagFormRef = (ref)=>{
    this.tagUpdateFormRef = ref;
  }

  //删除标签
  handleRemove = (removedTag) => {
    const { dispatch } = this.props;
    const vm = this;
    dispatch({
      type: 'assettaggroup/removetag',
      payload: removedTag.id,
      callback: (response) => {
        if (response.success) {
          success('删除成功!')
        } else {
          error(response.description);
        }
      vm.loadData();
      },
    })
  };

  showTagForm = ()=>{
    this.setState({
      tagFormVisible: true
    })
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

  showUpdateTagForm = (tag)=>{
    const { form } = this.tagUpdateFormRef.props;
    this.setState({
      tagUpdateFormVisible: true,
      currentTag:tag,
    })
    form.setFieldsValue({
      ...tag,
    });
  }

  

  handleOk = () =>{
    const { form } = this.tagFormRef.props;
    const {record,dispatch } = this.props;
    const vm=this;

    form.validateFields((err, values) => {
      if (!err) {
        const newAccount ={
          groupTagId:record.id,
          uuid_group_id:record.uuid_id,
          group_id:record.id,
          ...values,
          
        }; 
        dispatch({ 
          type: 'assettaggroup/addtag',
          payload: newAccount,
          callback: (res) => {
            if (res) {             
              success('修改成功！');
              form.resetFields();
              this.setState({
                tagFormVisible: false,
               
              })
              this.loadData();
            } else {
              error('修改失败！')
            }
          }
        })
      }
    })
    
  }
  handleUpdateOk = () =>{
    const { form } = this.tagUpdateFormRef.props;
    const {dispatch } = this.props;
    const {currentTag} = this.state;
    const vm=this;

    form.validateFields((err, values) => {
      if (!err) {
        const updateAccount ={
          ...currentTag,
          ...values,
        }; 
        dispatch({ 
          type: 'assettaggroup/updatetag',
          payload: updateAccount,
          callback: (res) => {
            if (res) {             
              success('修改成功！');
              form.resetFields();
              this.setState({
                tagUpdateFormVisible: false,
                currentTag:{},
              })
            } else {
              error('修改失败！')
            }
          }
        })
      }
    })
    
  }

  handleCancel = () =>{
    const { form } = this.tagFormRef.props;
    form.resetFields();
    this.setState({
      tagFormVisible: false
    })
  }
  handleUpdateCancel = () =>{
    const { form } = this.tagUpdateFormRef.props;
    form.resetFields();
    this.setState({
      tagUpdateFormVisible: false
    })
  }





  render() {
    const {record} = this.props;
    const {tagFormVisible,tagUpdateFormVisible } = this.state;
    const { assettaggroup: { tagDict } } = this.props;
    const id = record.id;
    const tags = tagDict[id];
    const title = "新增标签";
    const titleUpdate = "修改标签";

    return (
      
      <div>
        {tags.map((tag, index) => {
          const isLongTag = tag.tag_name.length > 5;
          const tagElem = (
            
              <Tag key={tag.id} color={tag.color}  closable={true} onClose={() => this.handleRemove(tag)}>
                <div onClick={()=>{this.showUpdateTagForm(tag)}} style={{display:'inline'}}>
                  {isLongTag ? `${tag.tag_name.slice(0, 5)}...` : tag.tag_name}
                </div>
              </Tag>
            
          );
          return isLongTag ? (
            <Tooltip title={tag.tag_group_name} key={tag.id}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}

          <AddAssetTag
              wrappedComponentRef={this.saveTagFormRef}
              visible={tagFormVisible}              
              onOk={this.handleOk}
              onClose={this.handleCancel}
              title={title}
          />
          <AddAssetTag
              wrappedComponentRef={this.updateTagFormRef}
              visible={tagUpdateFormVisible}              
              onOk={this.handleUpdateOk}
              onClose={this.handleUpdateCancel}
              title={titleUpdate}
          />
        
          <Tag onClick={this.showTagForm} style={{ background: '#fff', borderStyle: 'dashed', cursor:'pointer' }}>
            <Icon type="plus" /> 新增
          </Tag>
        
      </div>
    );
  }
}
export default AssetTags;
