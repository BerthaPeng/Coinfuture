import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from './header.js';
import { Input, Button, Grid, Dropdown, Checkbox, Form, Popup, Message } from 'semantic-ui-react';
import { Link } from 'react-router';
import UserCommon from 'utils/user-common.js';
import config from 'config/app.config';
import * as RegisterActions from 'actions/register.js';
const { Column } = Grid;
import history from 'history_instance';

import intl from 'react-intl-universal';
import { register } from 'locales/index.js';
import LazyLoad from 'utils/lazy_load';
import { Noty } from 'utils/utils';

class Register extends Component{
  constructor(props){
    super(props);
    this.state = {
      type: 'mobile',
      tel: '',
      captcha: '',
      telError: false,
      captchaError: false,
      pwdError: false,
      confirmpwdError: false,
      pwd: '',
      confirmpwd: '',
      popupError: '',
      agreement: true,
      country: '+86',

      submit_msg: '',

      initDone: false,
      btnText: '获取验证码',

    }
  }
  handleInputChange = (e, { name, value }) => this.setState({ [name]: value })
  render(){
    var { type, telError, tel, captcha, captchaError, pwd, pwdError, confirmpwd,
      confirmpwdError, popupError, agreement, country, submit_msg, lang, initDone,
      btnText, isLineChange  } = this.state;
    var { send_captcha_status, remain_time, submit_ing } = this.props.Register;
    var btnText = lang == 'en' ? 'Send' : '获取验证码';
    if(send_captcha_status === 'sent'){
      btnText = lang == 'en' ? ('Retry after ' +  remain_time ) : (remain_time   + '后重试');
    }else if(send_captcha_status == 'timeout'){
      btnText = lang == 'en' ? 'Retry' : '获取验证码';
    }
    return (
      <div className="login">
        { initDone && <div className="box-container">
              <Grid style={{width: '330px'}}>
                <Column width={8} textAlign="left"  verticalAlign="bottom"><h1>注册</h1></Column>
                <Column width={8} textAlign="right" verticalAlign="bottom">
                  <span onClick={this.toggleType.bind(this, 'mobile')} className={` ${type == 'mobile' ? 'active' : ''}`} style={{paddingBottom: '5px', cursor: 'pointer'}}>手机号</span>
                  <span onClick={this.toggleType.bind(this, 'email')} className={` ${type == 'email' ? 'active' : ''}`}  style={{marginLeft: '10px', paddingBottom: '5px', cursor: 'pointer'}}>邮件</span>
                </Column>
              </Grid>
              {
                type == 'mobile' ?
                [
                <Grid style={{width: '330px', margin: 0, padding: 0, marginTop: '50px'}}>
                  <Column width={4} style={{margin: 0, padding: 0}}>
                    <Dropdown name="country" value={country} options={ config.COUNTRY_CODE_LIST}
                      onChange={this.handleInputChange.bind(this)} />
                  </Column>
                  <Column width={12} style={{margin: 0, padding: 0}} >
                    <Popup
                      trigger={
                        <Input value={tel} name="tel" placeholder="请输入手机号" className="login-input"
                          onChange={this.handleInputChange.bind(this)}
                          onBlur={this.onTelBlur.bind(this)}
                          style={{width: '100%'}}
                          error={telError}/>
                      }
                      content="手机号输入有误"
                      open={ popupError == 'tel'}
                      position='top right'
                    />
                  </Column>
                </Grid>,
                <Grid style={{width: '330px', margin: 0, padding: 0}}>
                  <Column width={10} style={{margin: 0, padding: 0}}>
                  <Popup
                    trigger={
                      <Input style={{width: '100%'}} value={captcha} name="captcha" placeholder="短信验证码" className="login-input"
                      onChange={this.handleInputChange.bind(this)}
                      error={captchaError} />
                    }
                    content="验证码无效"
                    open={ popupError == 'captcha'}
                    position='top right'
                  />
                  </Column>
                  <Column width={6} style={{margin: 0, padding: 0}} textAlign="center">
                    <Button onClick={this.getCaptha.bind(this)} className="captcha-btn">
                      {btnText}</Button>
                  </Column>
                </Grid>
                ]
                :
                [
                  <Input className="login-input" placeholder={intl.get('email_placeholder')} style={{marginTop: '50px'}}/>,
                  <Grid style={{width: '330px', margin: 0, padding: 0}}>
                    <Column width={10} style={{margin: 0, padding: 0}}>
                      <Input style={{width: '100%'}} className="login-input" placeholder={intl.get('email_verify_code_placeholder')}/>
                    </Column>
                    <Column width={6} style={{margin: 0, padding: 0}} textAlign="center">
                      <Button style={{backgroundColor: '#fff', border: '1px solid #3D6FFF', color: '#3D6FFF', fontSize: '12px',
                      height: '36px', borderRadius: '18px'}}>{intl.get('get_sms')}</Button>
                    </Column>
                  </Grid>
                ]
              }
              <Popup
                trigger={
                  <Input name="pwd" className="login-input" type="password" placeholder={intl.get('pw1_placeholder')}
                    value={pwd}
                    onChange={this.handleInputChange.bind(this)}
                    onBlur={this.onPwdBlur.bind(this)}
                    error={pwdError}/>
                }
                content="密码需要包含字母与数字，至少8个字符"
                open={ popupError == 'pwd'}
                position="top right"
              />
              <Popup
                trigger = {
                  <Input name="confirmpwd" className="login-input" type="password" placeholder={intl.get('pw2_placeholder')}                    value={confirmpwd}
                    onChange={this.handleInputChange.bind(this)}
                    onBlur={this.onConfirmpwdBlur.bind(this)}
                    error={confirmpwdError}/>
                }
                content="两次密码不一致"
                open={ popupError == 'confirmpwd'}
                position="top right"
              />
              <div>
              <Checkbox name="agreement" onChange={this.handleInputChange.bind(this)} checked={agreement} className="checkbox" style={{verticalAlign: 'middle', color: ''}}/>
                <span style={{verticalAlign: 'middle', marginLeft: '3px'}}>{intl.get('agreement_txt')}<Link>《XXXXXXX》</Link></span></div>
              <Button disabled={submit_ing} loading={submit_ing} onClick={this.submit.bind(this)} className="login-btn">注册</Button>
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
    this.loadLocales('zh-CN');
    LazyLoad('noty')
  }
  loadLocales(lang){
    intl.init({
      currentLocale: lang,
      locales: register
    })
    .then( () => {
      this.setState({ initDone: true })
    })
  }
  toggleType(value){
    this.setState({ type: value })
  }
  onTelBlur(){
    var { tel } = this.state;
    if(UserCommon.telValidator(tel)){
      this.setState({telError: false})
    }else{
      this.setState({telError: true});
    }
  }
  onPwdBlur(){
    var { pwd } = this.state;
    if(UserCommon.passwordValidator(pwd)){
      this.setState({ pwdError: false})
    }else{
      this.setState({pwdError: true})
    }
  }
  onConfirmpwdBlur(){
    var { pwd, confirmpwd } = this.state;
    if(pwd === confirmpwd){
      this.setState({confirmpwdError: false})
    }else{
      this.setState({confirmpwdError: true})
    }
  }
  getCaptha(){
    var { tel } = this.state;
    var self = this;
    var { remain_time } = this.props;
    if(UserCommon.telValidator(tel)){
      this.props.actions.getPhoneCaptcha({ mobile_num: tel, country_code: '+86', email: ''})
        .done( () => {
          self.updateTimer = setInterval( () => {
            self.props.actions.updateTime()
          }, 1000)
        })
    }else{
      this.setState({telError: true});
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.remain_time === 0){
      clearInterval(this.updateTimer);
      delete this.updateTimer;
    }
    if(this.props.Lang.lang != nextProps.Lang.lang){
      /*intl.determineLocale({ currentLocale: nextProps.Lang.lang });*/
      this.loadLocales(nextProps.Lang.lang);
    }
  }
  submit(){
    var { captcha, telError, pwdError, confirmpwdError, agreement, tel, pwd, confirmpwd, country, remain_time } = this.state;
    var { send_captcha_status } = this.props.Register;
    var valid = true;
    if(send_captcha_status === 'primary'){
      Noty('warning', '请先发送验证码');
      valid = false;
    }
    if(!UserCommon.telValidator(tel)){
      this.setState({ telError: true, popupError: 'tel'});
      valid = false;
    }
    if(!captcha || remain_time == 0){
      this.setState({captchaError: true, popupError: 'captcha'});
      valid = false;
    }
    if(!UserCommon.passwordValidator(pwd)){
      this.setState({ pwdError: true, popupError: 'pwd'});
      valid = false;
    }
    if( pwd != confirmpwd){
      this.setState({ confirmpwdError: true, popupError: 'confirmpwd'});
      valid = false;
    }
    if(!agreement){
      this.setState({ popupError : 'agreement'})
      valid = false;
    }
    if(valid){
      var pwd = UserCommon.encodePwdSync(pwd, tel);
      this.props.actions.register({ mobile_num: tel, country_code: country,
        verificode: captcha, pw:  pwd})
        .done( (msg) => {
          /*this.setState({ submit_msg : msg})*/
          Noty('success', '注册成功，请登录')
          history.push('/login')
        })
        .fail( ({msg}) => {
          this.setState({ submit_msg : msg})
        })
    }else{
      return;
    }
  }
}



function mapStateToProps(state){
  return state.RegisterData;
}

function mapDispatchToProps(dispatch){
  return {
    actions:bindActionCreators({
      ...RegisterActions,
    },dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);