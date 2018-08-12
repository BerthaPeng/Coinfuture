import React, {Component} from 'react';

export default class RadioGroup extends Component{
  render(){
    var { label } = this.props;
    return(
      <div role="radiogroup" className="fl-radio-group">
        {
          this.props.children
        }
      </div>
      )
  }
}