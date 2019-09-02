import React from 'react';
import { SwatchesPicker } from 'react-color';
export default class TagColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        value:props.value,
     // key:props.objKey,
        displayColorPicker: false,
    };
    this.handleClick = this.handleClick.bind(this);
    
  }
 
  handleClick = ()=> {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  }
  onChange = (value) =>{
    const {onChange} = this.props;
      this.setState({
        value:value.hex,
      }); 
      onChange(value.hex);
  }

  render() {
    const {value} = this.props;
    return (
      <div onClick={this.handleClick }>
        <button onClick={ this.handleClick } style={{background:value,border:"none",lineHeight:"31px",height:31,width:45,verticalAlign: "middle"}}></button>
        {
        this.state.displayColorPicker?
        <div style={{position:"absolute",zIndex:66}}>
            <SwatchesPicker color={value}  onChangeComplete={this.onChange} />
        </div>
        :
        null
        }
      </div>
    );
  }
}

