import * as Actions from 'actions/register';
import config  from 'config/app.config';

const { SMS_COUNT } = config;
var initial_state ={
  remain_time:0,
  send_captcha_status:"primary",
  send_ing:false,
  submit_ing:false
}

export default function Register(state = initial_state, action){
  switch(action.type){
    case Actions.SEND_CAPTCHA_START:
      return { ...state, send_ing: true, remain_time: SMS_COUNT };break;
    case Actions.SEND_CAPTCHA_SUCCESS:
      return { ...state, send_ing: false, send_captcha_status: 'sent'};break;
    case Actions.SEND_CAPTCHA_OVER:
      return { ...state, send_captcha_status: 'timeout'};break;
    case Actions.REGISTER_ING:
      return { ...state, submit_ing: true };break;
    case Actions.REGISTER_SUCCESS:
    case Actions.REGISTER_FAIL:
      return { ...state, submit_ing: false};break;
    case Actions.UPDATE_TIME:
      var { remain_time, send_captcha_status } = state;
      remain_time = remain_time - 1 >= 0 ? remain_time -1 : 0;
      if(remain_time === 0){ send_captcha_status = 'timeout'; }
      return { ...state, remain_time, send_captcha_status}
    default: return state;break;
  }
}