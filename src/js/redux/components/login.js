import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Input, Button, Popup, Message } from 'semantic-ui-react';
import { Link } from 'react-router';
import UserCommon from 'utils/user-common.js';
import * as LoginActions from 'actions/login.js';

import history from 'history_instance';

import intl from 'react-intl-universal';
import { login } from 'locales/index';


class Login extends Component{
  constructor(props){
    super(props);
    this.state = {
      uname: '',
      pwd: '',
      submit_msg: '',
      initDone: false,
    }
    /*intl.init({

    })*/
  }
  handleInputChange = (e, { name, value }) => this.setState({ [name]: value })
  render(){
    var { uname, pwd, submit_msg, initDone } = this.state;
    var { submit_ing } = this.props.Login;
    return (
      <div className="login">
        { initDone && <div className="box-container">
          <h1>{intl.get('title')}</h1>
          <Input name="uname" value={uname} onChange={this.handleInputChange.bind(this)} className="login-input" placeholder={intl.get('account_placeholder')} style={{marginTop: '50px'}} />
          <Input name="pwd" value={pwd} onChange={this.handleInputChange.bind(this)} className="login-input" placeholder={intl.get('pwd_placeholder')} type="password"/>
          <Button loading={submit_ing} disabled={submit_ing} onClick={this.submit.bind(this)} className="login-btn">{intl.get("btn_txt")}</Button>
          <div className="guide-btns">
            {/*<div style={{display: 'inline-block', float: 'left'}}>修改密码</div>*/}
            <div style={{display: 'inline-block', float: 'right'}}><Link to="/register">{intl.get('register_btn_txt')}</Link></div>
          </div>
          {
            submit_msg != '' ?
            <Message negative size="mini" style={{padding: '0.5em 1.5em'}}>
                <p>{submit_msg}</p>
            </Message>
            :null
          }
        </div>}
      </div>
      )
  }
  componentDidMount(){
    this.loadLocales(this.props.Lang.lang);
    document.addEventListener("keydown",this.handleEnterKey);
  }
  componentWillUmount(){
    document.removeEventListener("keydown",this.handleEenterKey);
  }
  componentWillReceiveProps(nextProps){
    if(this.props.Lang.lang != nextProps.Lang.lang){
      /*intl.determineLocale({ currentLocale: nextProps.Lang.lang });*/
      this.loadLocales(nextProps.Lang.lang);
    }
  }
  unameValidator(){
    var { uname } = this.state;
    if(UserCommon.telValidator(uname)){
      return true;
    }else{
      this.unameError = true;
      return false;
    }
  }
  loadLocales(lang){
    intl.init({
      currentLocale: lang || 'en-US',
      locales: login,
    })
    .then( () => {
      this.setState({ initDone: true })
    })
  }
  submit(){
    var { uname, pwd } = this.state;
    var pw = UserCommon.encodePwdSync(pwd, uname);
    if(this.unameValidator() && pwd){
      this.props.actions.login({mobile: uname, pwhsh: pw})
        .done( (data) => {
          history.push('/user/finance');
          /*window.cf.uname = uname;
          window.cf.login = true;*/
          location.reload();
        })
        .fail( ({msg} ) => {
          this.setState({submit_msg:  msg || intl.get('loginfail')})
        })
    }else{
      this.setState({ submit_msg: intl.get('loginfail')})
    }
  }
  handleEnterKey = (e) => {
    if(e.keyCode === 13){
      this.submit();
    }
  }
}

function mapStateToProps(state){
  return state.LoginData;
}

function mapDispatchToProps(dispatch){
  return {
    actions:bindActionCreators({
      ...LoginActions,
    },dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);