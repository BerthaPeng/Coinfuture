import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Breadcrumb } from 'semantic-ui-react';

export default class Charge extends Component{
  render(){
    return (
      <div>
        <div className="fl-block">
          <p className="fl-hd">币种介绍</p>
        </div>
        <div className="fl-breadcrumb-wrapper">
          <Breadcrumb>
            <Breadcrumb.Section link>个人中心</Breadcrumb.Section>
            <Breadcrumb.Divider icon='right angle'/>
            <Breadcrumb.Section link>账户资产</Breadcrumb.Section>
            <Breadcrumb.Divider icon='right angle'/>
            <Breadcrumb.Section active>购买USDT</Breadcrumb.Section>
          </Breadcrumb>
        </div>
      </div>
      )
  }
}