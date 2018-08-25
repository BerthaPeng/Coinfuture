import React, {Component} from 'react';
import {Link} from 'react-router';
import { Button, Dropdown, Icon, Popup } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as LoginActions from 'actions/login.js';
import * as LangActions from 'actions/lang.js';
import * as FakeTradeActions from 'actions/fake-trade.js';
import { bindActionCreators } from 'redux';

import intl from 'react-intl-universal';
import { header } from 'locales/index';

import history from 'history_instance';

class Header extends Component{
  constructor(props){
    super(props);
    this.state = {
      login: false,
      uname: '',
      initDone: false,
      path_url: '',
    }
  }
  render(){
    const options = [{key: 'ch', text: '中文-CH',value: 'ch'},
    {key: 'en', text: 'EN', value: 'en'}];
  var { login, uname, initDone, path_url } = this.state;
  var lang = this.props.Lang.lang;
  var { FakeTrade } = this.props.FakeTrade;
  return (
      <nav className="navbar header">
        {/*<div className="banner-header">
        </div>*/}
        <div className="logo" style={{ marginLeft: '15px'}}>
          <img src="images/logo.png" width="40" height="40" />
          {/*<img src="http://fakeimg.pl/60x30?text=logo" width="60" height="30" />*/}
        </div>
        <div className="nav">
          <Link to="/market" activeClassName="active"><div>{intl.get('market')}</div></Link>
          <Link to="/trade" activeClassName="active"><div>{intl.get('exchange_a')}</div></Link>
          {/*<Link to=""><div>{intl.get('balances')}</div></Link>*/}
          {/*<Link to=""><div>帮助</div></Link>*/}
          {/*<Link to="/coin-coin-exchange"><div>下单</div></Link>*/}
          {/*<Link to=""><div>{intl.get('market')}</div></Link>
          <Link to=""><div>{intl.get('otc')}</div></Link>
          <Link to="/coin-coin-exchange"><div>{intl.get('exchange_a')}</div></Link>*/}
        </div>
        {
          login ?
          <div className="social-nav">
            <Link to="/user/finance" activeClassName="active">
              <div className="finance-block"><Icon name="yen" />{intl.get('balances')}</div>
            </Link>
            <Link to="/transaction" activeClassName="active">
              <div className="finance-block"><Icon name="file text outline" />{intl.get('orders')}</div>
            </Link>
            <Popup on="click" trigger = {<span className="uname"><Icon name="user outline"></Icon>{uname}<Icon name="caret down" /></span>}>
              <div className="setting-menu" onClick={this.goTrade.bind(this)}><Icon name="chart bar" />{intl.get('simulatedtrading')}</div>
              <div className="setting-menu" onClick={this.logout.bind(this)}><Icon name="sign out" />{intl.get('logout')}</div>
            </Popup>
          </div>
          :
          <div className = "social-nav">
            <Link to='/login'><Button className="login-btn" size="tiny">{intl.get('login')}</Button></Link>
            <Link to='/register'><Button className="register-btn" size="tiny">{intl.get('signup')}</Button></Link>
            {/*<Dropdown text='中文-CH' options={options} />*/}
          </div>
        }
        <div className="lang-box">
          <ul>
            <li className={ lang == 'zh-CN' ? "current-lang" : ""} onClick={this.changeLang.bind(this, 'zh-CN')}><Link>ZH</Link></li>
            <li className={ lang == 'en-US' ? "current-lang" : ""} onClick={this.changeLang.bind(this, 'en-US')}><Link>EN</Link></li>
          </ul>
        </div>
      </nav>
      )
  }
  componentDidMount(){
    var url = location.href;
    if(url.indexOf('market')>-1){
      this.setState({ path_url: 'market'})
    }else if( url.indexOf('trade') > -1){
      this.setState({path_url: 'trade'})
    }
    if(sessionStorage.getItem('_udata')){
      var uname=sessionStorage.getItem('_udata_name')
      this.setState({ login: true, uname})
    }else{
      this.setState({ login: false})
    }
    this.loadLocales(this.props.Lang.lang);
  }
  componentWillReceiveProps(nextProps){
    if(this.props.Lang.lang != nextProps.Lang.lang){
      this.loadLocales(nextProps.Lang.lang);
    }
  }
  logout(){
    this.props.actions.logout({})
      .done( () => {
        location.reload();
      })
  }
  loadLocales(lang){
    intl.init({
      currentLocale: lang || 'en-us',
      locales: { ...header }
    })
    .then( () => {
      this.setState({ initDone: true })
    })
  }
  goTrade(){
    /*if(!this.props.FakeTrade.isFake){
      history.push('/trade');
      this.props.actions.updateTrade();
    }*/
  }
  changeLang(lang){
    this.props.actions.changeLang(lang);
    /*var pathname = history.getCurrentLocation().pathname
    history.push({
      pathname: '/' + lang + pathname,
    })*/
  }
}


function mapStateToProps(state){
  return state.LoginData;
}

function mapDispatchToProps(dispatch){
  return {
    actions:bindActionCreators({
      ...LoginActions,
      ...LangActions,
      ...FakeTradeActions
    },dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);