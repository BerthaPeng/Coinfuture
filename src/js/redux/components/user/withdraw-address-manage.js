import React, { Component } from 'react';
import { Button, Dropdown, Icon, Table, Menu, Radio } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as FinanceActions from 'actions/user-finance.js';
import { bindActionCreators } from 'redux';
import {Link} from 'react-router';

import intl from 'react-intl-universal';
import UserMenu from '../common/user-menu.js';
import LazyLoad from 'utils/lazy_load';

class WithdrawAddress extends Component{
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className="fl-block gray-bg">
        <div className="flex-wrapper">
          <div className="item-20-100">
            <div className="item-inner" style={{minHeight: '100%'}}>
              <UserMenu lang="en-US" active="pocket" />
            </div>
          </div>
          <div className="item-80-100" style={{marginLeft: '15px'}}>
            <div className="item-inner" style={{minHeight: '100%'}}>
              <div className="finance-header">
                <div>
                  <span style={{fontSize: '16px'}}>资产</span>
                  <span> > </span>
                  <span>提币地址管理</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )
  }
}

export default WithdrawAddress;