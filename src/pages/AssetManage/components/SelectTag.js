import React, { Fragment, Component } from 'react';
import { SwatchesPicker } from 'react-color';
import { Input, Row, Col, Tag } from 'antd';
import styles from './SelectTag.less';

export default class SelectTag extends Component {

	static getDerivedStateFromProps(nextProps,prevState) {
		// Should be a controlled component.
		if ('value' in nextProps) {
			return {
				tagId : nextProps.value && nextProps.value.tagId ? nextProps.value.tagId : [] ,
				assetTagList:nextProps.assetTagList || []
			};
		}
		return null;
	}

  constructor(props) {
    super(props);
    const value = props.value || {};
		this.state = {
			tagId : value.tagId || [],
			assetTagList : props.assetTagList,
			displayTagSelect : false,
			displayColorPicker : false,
			color : '#03a9f4',
			value : '',
		};
		this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  componentDidMount() {
    document.onclick = this.handleDocumentClick
  }

  handleDocumentClick = () => {
  	this.setState({ displayColorPicker: false, displayTagSelect : false, });
  }

  onfocus = () => {
    const {onFocus} = this.props;
    onFocus(this.focusCallback);
  }

  focusCallback = () => {
  	this.setState({
  		displayTagSelect : true
  	})
  }
  
  handleClick = (e) => {
  	e.nativeEvent.stopImmediatePropagation()
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  }

  onColorChange = (color,e) => {
  	this.setState({
  		color:color.hex
  	})
  }

  onInputClick = (e) => {
  	e.nativeEvent.stopImmediatePropagation()
  }

  handleTagClick = (e) => {
  	e.nativeEvent.stopImmediatePropagation()
  	let tags = Array.from(new Set([...this.state.tagId, e.target.dataset.id]))
  	this.setState({
  		tagId:tags
  	})
  	this.triggerChange({tagId:tags})
  }

  handleClose = removedTag => {
  	const tags = this.state.tagId.filter(tag => tag !== removedTag);
    this.setState({ tagId:tags });
    this.triggerChange({tagId:tags})
  }

  getAlltag = () => {
	const {assetTagList} = this.state;
  	let AllTag = [];
  	assetTagList.map( (item) => {
  		if( item.children && item.children.length ){
  			AllTag = [...AllTag,...item.children]
  		}
  	} )
  	return AllTag;
  }

  handleInputChange = (e) => {
  	this.setState({
  		value:e.target.value
  	})
  }

  onPressEnter = (e) => {
  	const { addNewTag } = this.props;
  	let group_id = '';
  	this.state.assetTagList.map( (item) => {
  		if( item.tag_group_name == '默认组' ){
  			group_id =item.id;
  		}
  	} )
  	let obj = {
  		group_id,
  		color:this.state.color,
  		tag_name:e.target.value
  	}
  	addNewTag( obj, this.enterCallBack );
  	this.setState({
  		displayColorPicker: true,//由于enter后会触发拾色器按钮的click事件，故在此将其设置为反状态
  	})
  }

  enterCallBack = (obj) => {
  	let tags = [...this.state.tagId, obj.id]
  	this.setState({
  		tagId:tags,
  		value:'',
  	})
  	this.triggerChange({tagId:tags})
  }

  triggerChange = (changedValue) => {
		// Should provide an event to pass value to Form.
		const onChange = this.props.onChange;
		if (onChange) {
			onChange(Object.assign({}, changedValue));
		}
	}

  render() {
	const {tagId, color, displayTagSelect, assetTagList, displayColorPicker, value} = this.state;
    return (
    	<Fragment>
	    	<Row type='flex'>
	    		<Col>
	    			{ tagId.length ? tagId.map( (item,index) => {
	    				return this.getAlltag().map( (i, ind) => {
	    					if( item == i.id ){
	    						return <Tag key={ind} color={i.color} closable onClose={() => this.handleClose(i.id)}>{i.tag_name}</Tag>
	    					}
	    				} )
	    			} ) : null }
	    			<Input className={styles.tagInput} value={value} onChange={this.handleInputChange} onFocus={this.onfocus} onClick={(e) => this.onInputClick(e)} onPressEnter={this.onPressEnter} placeholder='回车后创建新标签' />
	    		</Col>
	    		<Col onClick={this.handleClick }>
	        	<button onClick={ this.handleClick } className={styles.colorButton} style={{background:color}}></button>
		        <div style={{position:"absolute",zIndex:66, display:displayColorPicker ? 'block' : 'none'}}>
		            <SwatchesPicker color={color} onChangeComplete={this.onColorChange}/>
		        </div>
	      	</Col>
	      	<div className={styles.tagSelect} style={{display:displayTagSelect ? 'block' : 'none'}}>
	    				{
	    					assetTagList.length ? assetTagList.map((item,index) => (
	    						<div key={index}>
	    						{
	    							item.children && item.children.length ? (
	    								<Fragment>
	    									<p className={styles.tag_group}>{item.tag_group_name}</p>
			    							{
			    								item.children.map( (i,ind) => (
			    									<Tag style={{cursor:'pointer'}} key={ind} color={i.color} onClick={this.handleTagClick} data-id={i.id} data-value={i.tag_name}>{i.tag_name}</Tag>
			    								) )
			    							}
	    								</Fragment>
	    							) : null 
	    						}
	    						</div>
	    					)) : '暂无标签'
	    				}
	    			</div>
	    	</Row>
      </Fragment>
    );
  }
}

