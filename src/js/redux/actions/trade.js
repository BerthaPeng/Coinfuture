import { post } from 'utils/request'; //Promise
import Url from 'config/url';
import config from 'config/app.config';

export const GET_BEFORE_MARKET_DATA_ING = 'GET_BEFORE_MARKET_DATA_ING';
export const GET_BEFORE_MARKET_DATA_SUCCESS = 'GET_BEFORE_MARKET_DATA_SUCCESS';
export const GET_BEFORE_MARKET_DATA_FAIL = 'GET_BEFORE_MARKET_DATA_FAIL';

//事先拉起K线数据
export function getBeforeMarketData(params){
  var url = Url.get_before_market_data + '.' + params.line;
  var line = params.line;
  delete params.line;
  return dispatch => {
    dispatch({type: GET_BEFORE_MARKET_DATA_ING});
    return post(url, 'app', params)
      .done(data => {
        dispatch({type: GET_BEFORE_MARKET_DATA_SUCCESS, data, line: line });
      })
      .fail( () => {
        dispatch({ type: GET_BEFORE_MARKET_DATA_FAIL});
      })
  }
}

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
    return post( 'trade', 'app', { limit_price, order_quantity, account_id, order_type, symbol: postid })
      .done( () => {
        dispatch({ type: TRADE_SUCCESS, trade_type});
      })
      .fail( () => {
        dispatch({ type: TRADE_FAIL, trade_type});
      })
  }
}

export const GET_NEW_DEALS = 'GET_NEW_DEALS';
export function getNewDeals(params){
  return dispatch => {
    return post(Url.get_new_deal_list, 'app', params)
      .done( (data) => {
        dispatch({ type: GET_NEW_DEALS, data});
      })
  }
}

export const GET_ORDER_LIST = 'GET_ORDER_LIST';
export function getOrderList(params){
  return dispatch => {
    return post(Url.get_order_list, 'app', params)
      .done( data => {
        dispatch({ type: GET_ORDER_LIST, data});
      })
  }
}

export const GET_TRANSAC_ING = "GET_TRANSAC_ING"
export const GET_TRANSAC_SUCCESS = "GET_TRANSAC_SUCCESS"
export const GET_TRANSAC_FAIL = "GET_TRANSAC_FAIL"

export function getTransacList(params){
  return dispatch => {
    dispatch({ type: GET_TRANSAC_ING });
    return post(Url.transac_list, 'app', params)
      .done( data => {
        dispatch({ type: GET_TRANSAC_SUCCESS, data})
      })
      .fail( () => {
        dispatch({ type: GET_TRANSAC_FAIL });
      })
  }
}


export const GET_DAILY_MARKET = 'GET_DAILY_MARKET';
export function getDailyMarket(params){
  return dispatch => {
    return post(Url.get_daily_market, 'app', params)
      .done(data => {
        dispatch({ type: GET_DAILY_MARKET, data});
      })
  }
}

//获取币的分类列表
export const GET_COIN_CATEGORY_LIST = 'GET_COIN_CATEGORY_LIST';
export function getCoinCategoryList(params){
  return dispatch => {
    return post(Url.get_coin_cate_list, 'app', params)
      .done(data => {
        dispatch({ type: GET_COIN_CATEGORY_LIST, data});
      })
  }
}

//获取分类下的币
export const GET_COIN_LIST = 'GET_COIN_LIST';
export function getCoinList(params){
  return dispatch => {
    return post(Url.get_coin_list_by_cate, 'app', params)
      .done(data => {
        dispatch({ type: GET_COIN_LIST, data});
      })
  }
}
