import React, {Component} from 'react';
import {Link} from 'react-router';
import { Button, Dropdown, Icon, Popup } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as LoginActions from 'actions/login.js';
import * as LangActions from 'actions/lang.js';
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
      lang: '',
    }
  }
  render(){
    const options = [{key: 'ch', text: '中文-CH',value: 'ch'},
    {key: 'en', text: 'EN', value: 'en'}];
  var { login, uname, lang } = this.state;
  var { lang } = this.props.Lang;
  return (
      <nav className="navbar header">
        <div className="lang-box">
          <ul>
            <li className={ lang == 'zh-CN' ? "current-lang" : ""} onClick={this.changeLang.bind(this, 'zh-CN')}><Link>ZH</Link></li>
            <li className={ lang == 'en-US' ? "current-lang" : ""} onClick={this.changeLang.bind(this, 'en-US')}><Link>EN</Link></li>
          </ul>
        </div>
        <div className="nav">
          <Link to=""><div>{intl.get('market')}</div></Link>
          <Link to=""><div>{intl.get('otc')}</div></Link>
          <Link to="/coin-coin-exchange"><div>{intl.get('exchange_a')}</div></Link>
        </div>
        {
          login ?
          <div className="social-nav">
            <Link to="/user/finance"><div className="finance-block"><Icon name="yen" />{intl.get('balances')}</div></Link>
            <Link to="/transaction"><div className="finance-block"><Icon name="file text outline" />{intl.get('orders')}</div></Link>
            <Popup on="click" trigger = {<span className="uname"><Icon name="user outline"></Icon>{uname}<Icon name="caret down" /></span>}>
              <div className="setting-menu" onClick={this.logout.bind(this)}><Icon name="sign out" />{intl.get('logout')}</div>
            </Popup>
          </div>
          :
          <div className = "social-nav">
            <Link to={ lang ? '/' + lang + '/login' : '/login'}><Button className="login-btn" size="tiny">{intl.get('login')}</Button></Link>
            <Link to={ lang ? '/' + lang + '/register' : '/register'}><Button className="register-btn" size="tiny">{intl.get('signup')}</Button></Link>
            {/*<Dropdown text='中文-CH' options={options} />*/}
          </div>
        }
      </nav>
      )
  }
  componentDidMount(){
    if(sessionStorage.getItem('_udata')){
      var uname=sessionStorage.getItem('_udata_name')
      this.setState({ login: true, uname})
    }else{
      this.setState({ login: false})
    }
    this.loadLocales(this.props.lang);
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
      locales: header
    })
    .then( () => {
      this.setState({ initDone: true })
    })
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
      ...LangActions
    },dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);