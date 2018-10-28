import { combineReducers } from 'redux';
import * as Actions from 'actions/trade.js';
import { timestampToTime, timestampToDate } from 'utils/utils.js';
import marketData from 'config/market-data.js';
import { Lang } from './lang.js';
import config from 'config/app.config.js';
var clone= require('clone');

var initial_state = {
  get_before_data_ing: false,
  Kdata_list: [],
  deal_list: [],
  in_order_list: [],
  out_order_list: [],
  market_list: [],
  coin_cate_list: [],
  origin_coin_cate_list: [],
  coin_list: [],

  isFake: false,
}

function Trade(state = initial_state, action){
  switch(action.type){
    case Actions.GET_BEFORE_MARKET_DATA_ING:
      return { ...state, get_before_data_ing: true};break;
    case Actions.GET_BEFORE_MARKET_DATA_SUCCESS:
      var transUnit = 60000, line = action.line; //1分钟=60000毫米
      switch(line){
        case '5m':
          transUnit *= 5;break;
        case '10m':
          transUnit *= 10;break;
        case '15m':
          transUnit *= 15;break;
        case '30m':
          transUnit *= 30;break;
        case '60m':
          transUnit *= 60;break;
        case '1d':
          transUnit *= 24 * 60;break;
        default:;break;
      }
      //line 为一天的时候
      var kline = [];
      if( line == '1d'){
        kline = action.data.kline.map( k => ([timestampToDate(k.t * transUnit), k.o, k.c, k.l, k.h, Number(k.q)]))
      }else{
        kline = action.data.kline.map( k => ([timestampToTime(k.t * transUnit), k.o, k.c, k.l, k.h, Number(k.q)]))
      }
      return { ...state, get_before_data_ing: false, Kdata_list: kline};break;
    case Actions.GET_BEFORE_MARKET_DATA_FAIL:
      return { ...state, get_before_data_ing: false };break;
    case Actions.GET_DAILY_MARKET:
      var { daily } = action.data;
      daily = daily.map( m => {
        var h = { name: m.s, price: parseFloat(m.c).toFixed(4), change: m.cg,
          highest: parseFloat(m.h).toFixed(4),
          lowest: parseFloat(m.l).toFixed(4),
          commit: parseFloat(m.a).toFixed(4),
          changeMoney: (parseFloat(m.c) - parseFloat(m.o)).toFixed(4),
        };
        if(m.cg.indexOf('-') != -1){
          h.direction = 'down'
        }else{
          h.direction = 'up';
        }
        return h;
      })
      return { ...state, market_list: daily};break;
    case Actions.GET_NEW_DEALS:
      var { ticks } = action.data;
      //金额暂时处理保留两位小数
      ticks = ticks.map( m => {
        var item = m;
        try{
          item.p = parseFloat(item.p).toFixed(4);
          item.q = parseFloat(item.q).toFixed(4);
        }catch(e){
          console.warn(e);
        }
        item.m = item.m ? 'in': 'out';
        return {id: item.t, quantity: item.q, price: item.p, time: timestampToTime(item.t), type: item.m}
      })
      return { ...state, deal_list: ticks.slice(0, 10)};break;
    case Actions.GET_ORDER_LIST:
      var { data } = action;
      var { asks, bids } = data;
      asks = asks.map ( m => {
        var item = m ;
        try{
          item[0] = parseFloat(item[0]).toFixed(4);
          item[1] = parseFloat(item[1]).toFixed(4);
        }catch(e){
          console.warn(e);
        }
        return { quantity: item[1], price: item[0]};
      })
      bids = bids.map( m => {
        var item = m ;
        try{
          item[0] = parseFloat(item[0]).toFixed(4);
          item[1] = parseFloat(item[1]).toFixed(4);
        }catch(e){
          console.warn(e);
        }
        return { quantity: item[1], price: item[0]};
      })
      return { ...state, in_order_list: bids.slice(0, 5), out_order_list: asks.slice(-5) };break;
    case Actions.GET_COIN_CATEGORY_LIST:
      /*var AGE_CATE = config.AGE_CATE;*/
      var cateList = [], childrenCateList = [], grandsonCateList = [],
        { data } = action;
      grandsonCateList = data.filter( m => m.level == 2)
      childrenCateList = data.filter( m => m.level == 1)
        .map( n => {
          n.children = [];
          grandsonCateList.forEach( g => {
            if( n.id == g.parent){
              /*g.children = AGE_CATE;*/
              n.children.push(g);
            }
          })
          /*if(n.children.length == 0 ){
            n.children = clone(AGE_CATE);
          }*/
          return n;
        })
      cateList = data.filter( m => m.level === 0)
        .map( n => {
          n.children = [];
          childrenCateList.forEach( g => {
            if( n.id == g.parent){
              n.children.push(g);
            }
          })
          /*if(n.children.length == 0 ){
            n.children = clone(AGE_CATE);
          }*/
          return n;
        })
        console.log(cateList);
        return { ...state, coin_cate_list: cateList, origin_coin_cate_list: data};break;
    case Actions.GET_COIN_LIST:
      return { ...state, coin_list: action.data};break;
    default:
      return state;break;
  }
}

var exchange_initial_state = {
  market: 'USDT',
  coin_type: 'BTC',
  buy_submit_ing: false,
  sell_submit_ing: false,
  submit_status: '',
}

function Exchange(state = exchange_initial_state, action){
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


var transc_initial_state = {
  get_transac_ing: false,
  transac_list: []
}


function Transaction(state = transc_initial_state, action){
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
  Exchange,
  Trade,
  Transaction
})

