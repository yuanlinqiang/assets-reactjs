import React, { Component, Fragment } from "react";
import { TreeSelect,Tag,Button, Input,Icon } from "antd";
import { connect } from "dva";
import TagColorPicker from './TagColorPicker.js';

const {TreeNode} = TreeSelect;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;


@connect(({ assettype,reserviceasset,TableList,assettaggroup, loading }) => ({
	assettype, reserviceasset,TableList,assettaggroup,loading: loading.models.assettype
  }))
class EditAssetTags extends React.Component {
  state = {
    value: this.props.value,
    treeData:[],
    newTags:[],
    inputVisible: false,
    inputValue:'',
    colorValue:'red',
    tempId:10000,
  };

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type: "assettaggroup/fetch",
      callback: this.buildData,
    });
    
  }

  buildData=(data)=>{
    
    const treeData = [];
    for(var taggroup of data){
        var template  = {disabled:true,children:[]};
        template.title = taggroup.name;
        template.key = template.value = taggroup.uuid_id;
        for(var child of taggroup.assetTagSet){
            var ctemplate = {};
            ctemplate.title = <Tag color={child.color}>{child.name}</Tag>;
            ctemplate.key = ctemplate.value = child.uuid_id;
            template.children.push(ctemplate);
        }
        treeData.push(template);
    }
    this.setState({treeData:treeData})
  }
  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };
  showInput = () =>{
    this.setState({ inputVisible: true });
  }

  renderTreeNode = (treeData) =>{
      let treeNode = [];
      treeData.map((ele,index)=>{
        treeNode.push(
            <TreeNode value={ele.value} title = {ele.title} key = {ele.key} disabled = {ele.disabled} selectable = {true} >
                {ele.children && ele.children.length>0?
                    this.renderTreeNode(ele.children):null
                }
            </TreeNode>
        );
      });
      return treeNode;
  }

  handleInputConfirm = () =>{
    const { inputValue,colorValue } = this.state;
    const { value,treeData,newTags,tempId } = this.state;
    const {onChange} = this.props;
    var template = {};
    template.title = <Tag color={colorValue}>{inputValue}</Tag>;
    template.color = colorValue;
    template.name = inputValue;
    template.key=template.value = tempId+"";
    template.newData=true;
    //treeData[0].children.push(template);
    newTags.push(template);
    //value.push({label:template.title,value:template.value});
    if(value){
        var arr = value.concat(newTags);
        onChange(arr);
    }else{
        onChange(newTags);
    }
    
    this.setState({
      value:value,
      treeData:treeData,
      newTags:newTags,
      tempId:tempId+1,
      inputVisible: false,
      inputValue: '',
      colorValue:'red',
    });
  }

  onChange = value => {
    const {onChange} = this.props;
   
    this.setState({ value:value });
    var arr = value.concat(this.state.newTags);
    onChange(arr);
  };

  onColorChange = value => {
  
    this.setState({ colorValue: value });
  };

  render() {
    
    const {treeData,inputVisible,inputValue,colorValue,newTags} = this.state;

    const tProps = {
     // treeData: treeData,
      value: this.state.value,
      onChange: this.onChange,
      treeCheckable: true,
      treeCheckStrictly:true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: 'Please select',
      style: {
        width: 300,
      },
    };

    return (<div>
        <TreeSelect  {...tProps}>
            {this.renderTreeNode(treeData)}
        </TreeSelect>
        {inputVisible && (<div>
            <Input 
             type="text"
             size="small"
             value={inputValue}
             style={{ width: 78 }}
             onChange={this.handleInputChange.bind(this)}
             onPressEnter={this.handleInputConfirm.bind(this)}/> 
        <TagColorPicker value={colorValue} onChange = {(e)=>this.setState({colorValue : e})} /></div>)}
        {!inputVisible &&(<div>{
          newTags.map((tag, index) => {
            const isLongTag = tag.name.length > 5;
            const tagElem = tag.title;
            return isLongTag ? (
              <Tooltip title={tag.name} key={tag.key}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
            );
          })}
          <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
            <Icon type="plus" />新增标签
          </Tag></div>
       )}
        </div>);
  }
}

export default EditAssetTags;