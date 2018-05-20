import { combineReducers } from 'redux';
import * as Actions from 'actions/user/transaction.js';
import { Lang } from './lang.js';

var initial_state = {
  get_transac_ing: false,
  transac_list: []
}


function Transaction(state = initial_state, action){
  switch(action.type){
    case Actions.GET_TRANSAC_ING:
      return {...state, get_transac_ing: true };break;
    case Actions.GET_TRANSAC_SUCCESS:
      return { ...state, get_transac_ing: false, transac_list: action.data};break;
    case Actions.GET_TRANSAC_FAIL:
      return { ...state, get_transac_ing: false};break;
    default: return state;break;
  }
}

export default combineReducers({
  Lang,
  Transaction
})
