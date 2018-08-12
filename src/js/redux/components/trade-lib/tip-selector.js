import React, {Component} from 'react';
import { Dropdown } from 'semantic-ui-react'

export default class TipSelector extends Component{
  constructor(props){
    super(props);
    this.state = {
      open: false,
      value: '',
    }
  }
  render(){
    var { value, placeholder, options } = this.props;
    var { open} = this.state;
    return(<div role="listbox" aria-expanded={open} className={`ui fluid selection dropdown ${ open ? 'active visible': ''}` } tabIndex="0" onClick={this.onOpen.bind(this)}>
        <span>{placeholder}</span>
        <div className="text" role="alert" aria-live="polite" style={{float: 'right'}}>{value}</div>
        <i aria-hidden="true" className="dropdown icon"></i>
        <div className={`menu transition ${ open ? 'visible' : ''}`}>
          {
            options || [].map( item => <div onClick={this.onSelect.bind(this, item)} key={item+'_tipselector_option'} role="option" aria-checked="false" aria-selected="true" className="selected item" style={{pointerEvents: 'all'}}>
            <span className="text">{item}</span>
          </div>
          )
          }
        </div>
      </div>
      )
  }
  onOpen(){
    this.setState({ open: !this.state.open });
  }
  onSelect(value){
    this.props.onChange(value);
  }
}
