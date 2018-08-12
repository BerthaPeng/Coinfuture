import React, {Component} from 'react';

export default class RadioButton extends Component{
  render(){
    var { label } = this.props;
    return(
      <label role="radio" tabIndex="-1" className="fl-radio-button">
        <input type="radio" tabIndex="-1" className="fl-radio-button__orig-radio" value={label} />
        <span className="fl-radio-button__inner">{label}</span>
      </label>
      )
  }
}