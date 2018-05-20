import { post } from 'utils/request'; //Promise
import Url from 'config/url';
import config from 'config/app.config';

const { TRADE_TYPE } = config;
export const TRADE_ING = 'TRADE_ING';
export const TRADE_SUCCESS = 'TRADE_SUCCESS';
export const TRADE_FAIL = 'TRADE_FAIL';

export function trade(params ){
  return dispatch => {
    var { trade_type } = params;
    dispatch({ type: TRADE_ING, trade_type});
    var postid = params.coin_type + params.market;

    //在session中获取accountid;
    var account_id = parseInt(sessionStorage.getItem('_udata_accountid'));
    var order_type = TRADE_TYPE[params.trade_type];
    var limit_price = "";
    var order_quantity = "";
    switch(params.trade_type){
      case 'buy_limit':
      case 'buy_market':
        limit_price = params.buy_price;
        order_quantity = params.buy_count;break;
      case 'sell_limit':
      case 'sell_market':
        limit_price = params.sell_price;
        order_quantity = params.sell_count;break;
      default:;
    }
    return post( postid, 'trade', { limit_price, order_quantity, account_id, order_type })
      .done( () => {
        dispatch({ type: TRADE_SUCCESS, trade_type});
      })
      .fail( () => {
        dispatch({ type: TRADE_FAIL, trade_type});
      })
  }
}