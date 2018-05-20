import { combineReducers } from 'redux';
import * as Actions from 'actions/user-finance.js';
import { Lang } from './lang.js';

var initial_state = {
  user_coin_list: []
}

function Finance(state =  initial_state, action){
  switch(action.type){
    case Actions.GET_USER_COIN_LIST:
      if( action.data && action.data.length){
        sessionStorage.setItem('_udata_accountid', action.data[0].id);
      }
      return { ...state, user_coin_list: action.data };break;
    default: return state;break;
  }
}

export default combineReducers({
  Lang,
  Finance
})
