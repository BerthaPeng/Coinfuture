import { combineReducers } from 'redux';
import * as Actions from 'actions/login.js';
import { Lang } from './lang.js';

var initial_state = {
  login: false,
  submit_ing: false,
  token: "",
  user_name: "",
}

function Login(state = initial_state, action){
  switch(action.type){
    case Actions.LOGIN_ING:
      return { ...state, submit_ing: true };break;
    case Actions.LOGIN_SUCCESS:
      sessionStorage.setItem('_udata', action.data[0].token);
      sessionStorage.setItem('_udata_name', action.uname);
      return { ...state, submit_ing: false, token: action.data[0].token, user_name: action.uname, login: true };break;
    case Actions.LOGIN_FAIL:
      return { ...state, submit_ing: false };break;
    case Actions.LOG_OUT:
      sessionStorage.removeItem('_udata');
      sessionStorage.removeItem('_udata_name');
      sessionStorage.removeItem('_udata_accountid');
      return { ...state, login: false, user_name: "", token: ""};break;
    default:
      return state; break;
  }
}

export default combineReducers({
  Lang: Lang,
  Login,
})
