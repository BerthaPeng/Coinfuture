import React, {Component} from 'react';
import { Menu } from 'semantic-ui-react';
import history from 'history_instance';

export default class UserMenu extends Component{
  constructor(props){
    super(props);
    this.state = {
      activeMenu: 'order-record',
    }
  }
  render(){
    var { activeMenu } = this.state;
    return (
      <Menu text vertical>
        <Menu.Item
          name="userCenter"
          active={activeMenu == 'userCenter'}>用户中心</Menu.Item>
        <Menu.Item
          name="pocket"
          active = {activeMenu == 'pocket'}
          onClick={this.handleMenuClick.bind(this, 'pocket')}>钱包资产</Menu.Item>
        <Menu.Item
          name="order-record"
          active = {activeMenu == 'order-record'}
          onClick={this.handleMenuClick.bind(this, 'order-record')}>订单记录</Menu.Item>
        <Menu.Item>个人资料</Menu.Item>
        <Menu.Item>优惠卡券</Menu.Item>
        <Menu.Item>安全中心</Menu.Item>
        <Menu.Item>消息中心</Menu.Item>
        <Menu.Item>推荐返利</Menu.Item>
        <Menu.Item>其他设置</Menu.Item>
      </Menu>
      )
  }
  handleMenuClick = (menu) => {
    this.setState({ activeMenu: menu })
    switch( menu ){
      case 'pocket':
        history.push('/user/finance');break;
      case 'order-record':
        history.push('/transaction');break;
      default:;break;
    }
  }
}