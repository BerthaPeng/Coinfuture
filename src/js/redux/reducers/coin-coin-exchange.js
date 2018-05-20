import { combineReducers } from 'redux';
import * as Actions from 'actions/coin-coin-exchange.js';
import { Lang } from './lang.js';


var initial_state = {
  market: 'USDT',
  coin_type: 'BTC',
  buy_submit_ing: false,
  sell_submit_ing: false,
  submit_status: '',
}

function Exchange(state = initial_state, action){
  switch(action.type){
    case Actions.TRADE_ING:
      if( action.trade_type == 'buy_market' ||
        action.trade_type == 'buy_limit'){
        return { ...state, buy_submit_ing: true}
      }else{
        return { ...state, sell_submit_ing: true}
      }
      break;
    case Actions.TRADE_SUCCESS:
      if( action.trade_type == 'buy_market' ||
        action.trade_type == 'buy_limit'){
        return { ...state, buy_submit_ing: false, submit_status: 'success'}
      }else{
        return { ...state, sell_submit_ing: false, submit_status: 'success'}
      }
      return state;break;
    case Actions.TRADE_FAIL:
      if( action.trade_type == 'buy_market' ||
        action.trade_type == 'buy_limit'){
        return { ...state, buy_submit_ing: false, submit_status: 'error'}
      }else{
        return { ...state, sell_submit_ing: false, submit_status: 'error'}
      }
    default:
      return state;
  }
}

export default combineReducers({
  Lang,
  Exchange
})






