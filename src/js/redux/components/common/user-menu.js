import React, {Component} from 'react';
import { Menu } from 'semantic-ui-react';
import history from 'history_instance';
import intl from 'react-intl-universal';
import { common } from 'locales/index';
export default class UserMenu extends Component{
  constructor(props){
    super(props);
    this.state = {
      activeMenu: 'pocket',
    }
  }
  render(){
    var { activeMenu } = this.state;
    return (
      <Menu text vertical>
        {/*<Menu.Item
          name="userCenter"
          active={activeMenu == 'userCenter'} disabled>用户中心</Menu.Item>*/}
        <Menu.Item
          name="pocket"
          active = {activeMenu == 'pocket'}
          onClick={this.handleMenuClick.bind(this, 'pocket')}>{intl.get('balances')}</Menu.Item>
        <Menu.Item
          name="order-record"
          active = {activeMenu == 'order-record'}
          onClick={this.handleMenuClick.bind(this, 'order-record')}>{intl.get('orders')}</Menu.Item>
        {/*<Menu.Item
          name="simulated-trading"
          active = { activeMenu == 'simulated-trading'}
          onClick = {this.handleMenuClick.bind(this, 'simulated-trading')}
          >{intl.get('simulatedtrading')}</Menu.Item>*/}
        {/*<Menu.Item disabled>个人资料</Menu.Item>
        <Menu.Item disabled>优惠卡券</Menu.Item>
        <Menu.Item disabled>安全中心</Menu.Item>
        <Menu.Item disabled>消息中心</Menu.Item>
        <Menu.Item disabled>推荐返利</Menu.Item>
        <Menu.Item disabled>其他设置</Menu.Item>*/}
      </Menu>
      )
  }
  handleMenuClick = (menu) => {
    this.setState({ activeMenu: menu })
    switch( menu ){
      case 'pocket':
        this.setState({ activeMenu: 'pocket'});
        history.push('/user/finance');break;
      case 'order-record':
        this.setState({activeMenu: 'order-record'});
        history.push('/transaction');break;
      case 'simulated-trading':
        this.setState({ activeMenu: 'simulated-trading'});
        history.push('/user/fake-trade');break;
      default:;break;
    }
  }
  componentDidMount(){
    if(this.props.active){
      this.setState({ activeMenu: this.props.active});
    }
  }
  componentWillReceiveProps(nextProps){
    if(this.props.active != nextProps.active){
      this.setState({ activeMenu : nextProps.active});
    }
  }
}