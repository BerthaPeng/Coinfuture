import React, {Component} from 'react';
import { Divider } from 'semantic-ui-react';

export default class extends Component{
  render(){
    return(
      <div className="footer">
        <Divider className="footer-divider" />
        <div className="year-last">2014-2018 xxxx.com. All Rights Reserved</div>
      </div>
      )
  }
}