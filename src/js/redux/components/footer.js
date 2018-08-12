import React, {Component} from 'react';
import {Link} from 'react-router';
import { Divider } from 'semantic-ui-react';

export default class extends Component{
  render(){
    return(
      <div className="footer">
        <div className="doc_root_wrap">
          <dl>
            <dt>飞链feilian</dt>
            <dd>The Global Coin Exchange</dd>
            <dd className="icons"></dd>
          </dl>
          <dl>
            <dt><h2>关于</h2></dt>
            <dd><Link to="">关于我们</Link></dd>
            <dd><Link to="">团队介绍</Link></dd>
            <dd><Link to="">费率说明</Link></dd>
          </dl>
          <dl>
            <dt><h2>支持</h2></dt>
            <dd><Link to="">免责说明</Link></dd>
            <dd><Link to="">隐私保护</Link></dd>
            <dd><Link to="">服务协议</Link></dd>
          </dl>
          <dl>
            <dt><h2>声明</h2></dt>
            <dd><Link to="">网站公告</Link></dd>
            <dd><Link to="">上币申请</Link></dd>
            <dd><Link to="">帮助中心</Link></dd>
          </dl>
        </div>
        <Divider className="footer-divider" />
        <div className="year-last">2014-2018 xxxx.com. All Rights Reserved</div>
      </div>
      )
  }
}