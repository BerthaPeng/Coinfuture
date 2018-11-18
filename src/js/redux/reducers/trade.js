import { combineReducers } from 'redux';
import * as Actions from 'actions/trade.js';
import { timestampToTime, timestampToDate, dateFormat } from 'utils/utils.js';
import marketData from 'config/market-data.js';
import { Lang } from './lang.js';
import config from 'config/app.config.js';
var clone = require('clone')

var initial_state = {
  get_before_data_ing: false,
  Kdata_list: [],
  deal_list: [],
  in_order_list: [],
  out_order_list: [],
  market_list: [],
  coin_cate_list: [],
  coin_attr_list: [],
  origin_coin_cate_list: [],
  coin_list: [],
  filter_coin_list: [],
  coin_config_list: [], //币对的配置信息，展示哪些币对，币对保留的小数位等
  activeCoin: '', //当前币种
  activeCoinInfo: {
    price_decimal: 4,
    quantity_decimal: 4,
  },
  coin_info_arr: [],
  coin_info: {},
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
    case Actions.GET_COIN_CONFIG_LIST:
      var price_decimal = 4, quantity_decimal = 4;
      if(action.data.data && action.data.data.length){
        price_decimal = action.data.data[0].price_decimal;
        quantity_decimal = action.data.data[0].quantity_decimal;
      }
      return { ...state, coin_config_list: action.data.data,
        activeCoin: action.data.coin == 'default' ? action.data.data[0].commodity_symbol : action.data.coin,
        activeCoinInfo: { price_decimal, quantity_decimal }
      };break;
    case Actions.CHOOSE_COIN:
      var price_decimal = 4, quantity_decimal = 4;
      var currentCoinInfo = state.coin_config_list.filter( m => m.commodity_symbol == state.activeCoin);
      if(currentCoinInfo && currentCoinInfo.length){
        price_decimal = currentCoinInfo[0].price_decimal;
        quantity_decimal = currentCoinInfo[0].quantity_decimal;
      }
      return { ...state, activeCoin: action.coin,
        activeCoinInfo: { price_decimal, quantity_decimal }
       };break;
    case Actions.GET_DAILY_MARKET:
      var { daily } = action.data;
      var dailySelected = state.coin_config_list.map( selected => {
        var selectedIndex = daily.findIndex( m => m.s == selected.commodity_symbol);
        var h = selected;
        if(selectedIndex > -1){
          h = {
            ...h,
            name_en: h.commodity_symbol.replace(/_/g, ' '),
            name: daily[selectedIndex].s,
            price:  daily[selectedIndex].c ? Number(daily[selectedIndex].c).toFixed( h.price_decimal) : '/',
            change: daily[selectedIndex].cg ? daily[selectedIndex].cg : '/',
            highest: daily[selectedIndex].h ? Number(daily[selectedIndex].h).toFixed(h.price_decimal) : '/',
            lowest: daily[selectedIndex].l ? Number(daily[selectedIndex].l).toFixed(h.price_decimal) : '/',
            commit: daily[selectedIndex].a ? Number(daily[selectedIndex].a).toFixed(h.price_decimal) : '/',
            changeMoney: daily[selectedIndex].cg ? daily[selectedIndex].cg: '/',
          }
          if(daily[selectedIndex].cg.indexOf('-') != -1){
            h.direction = 'down'
          }else{
            h.direction = 'up';
          }
          return h;
        }
        return h;
      })
      /*daily = daily.map( m => {
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
      })*/
      return { ...state, market_list: dailySelected};break;
    case Actions.GET_NEW_DEALS:
      var { ticks } = action.data;
      //处理小数
      var { price_decimal, quantity_decimal } = state.activeCoinInfo;
      //金额暂时处理保留两位小数
      ticks = ticks.map( m => {
        var item = m;
        try{
          item.p = parseFloat(item.p).toFixed(price_decimal);
          item.q = parseFloat(item.q).toFixed(quantity_decimal);
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
      var { price_decimal, quantity_decimal } = state.activeCoinInfo;
      asks = asks.map ( m => {
        var item = m ;
        try{
          item[0] = parseFloat(item[0]).toFixed(price_decimal);
          item[1] = parseFloat(item[1]).toFixed(quantity_decimal);
        }catch(e){
          console.warn(e);
        }
        return { quantity: item[1], price: item[0]};
      })
      bids = bids.map( m => {
        var item = m ;
        try{
          item[0] = parseFloat(item[0]).toFixed(price_decimal);
          item[1] = parseFloat(item[1]).toFixed(quantity_decimal);
        }catch(e){
          console.warn(e);
        }
        return { quantity: item[1], price: item[0]};
      })
      return { ...state, in_order_list: bids.slice(0, 10), out_order_list: asks.slice(-10) };break;
    case Actions.GET_COIN_CATEGORY_LIST:
      /*var AGE_CATE = config.AGE_CATE;*/
      var cateList = [], childrenCateList = [], grandsonCateList = [],
        { data } = action;
      grandsonCateList = data.filter( m => m.level == 2);
      childrenCateList = data.filter( m => m.level == 1)
        .map( n => {
          n.children = [];
          grandsonCateList.forEach( g => {
            if( n.id == g.parent){
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
        return { ...state, coin_cate_list: cateList, origin_coin_cate_list: data};break;
    case Actions.TRIGGER_OPEN_CATE:
      var { cate_id ,level, parent, grand_parent } = action.data;
      var { coin_cate_list } = state;
      if( level == 0){
        var index = coin_cate_list.findIndex( m => m.id == cate_id);
        coin_cate_list[index].isOpen = !coin_cate_list[index].isOpen;
      }else if(level == 1){
        var parentIndex = coin_cate_list.findIndex( m => m.id == parent);
        var index = coin_cate_list[parentIndex].children.findIndex( m => m.id == cate_id);
        coin_cate_list[parentIndex].children[index].isOpen = !coin_cate_list[parentIndex].children[index].isOpen
      }else if(level == 2){
        var grandIndex = coin_cate_list.findIndex( m => m.id == grand_parent);
        var parentIndex = coin_cate_list[grandIndex].children.findIndex( m => m.id == parent);
        index = coin_cate_list[grandIndex].children[parentIndex].findIndex( m => m.id == parentIndex);
        coin_cate_list[grandIndex].children[parentIndex].children[index].isOpen = !coin_cate_list[grandIndex].children[parentIndex].children[index].isOpen;
      }
      return { ...state, coin_cate_list};break;
    case Actions.GET_COMMON_ATTR_LIST:
      var { data } = action;
      data = data.map( m => { m.items = JSON.parse(m.items); return m;})
      return { ...state, coin_attr_list: data};break;
    case Actions.GET_COIN_LIST:
      return { ...state, coin_list: action.data};break;
    case Actions.GET_COIN_LIST_BY_ATTR:
      return { ...state, filter_coin_list: action.data};break;
    case Actions.GET_COIN_INFO:
      var { data } = action;
      var coin_info_arr = [];
      if(data.length){
        for(var  key in data[0]){
          if(key != 'url' && key != 'id' && key != 'name' && key != 'price_evaluation'){
            var keyForm = key.replace('_', ' ');
            if(key == 'built'){
              keyForm = 'year of build'
            }else if(key=='loa' || key == 'breadth' || key == 'draft' || key == 'lbp'
              || key == 'depth'){
              keyForm = key + '(m)'
            }else if( key == 'me'){
              keyForm = 'main engine'
            }else if( key == 'service_speed'){
              keyForm = 'service speed(knots)'
            }else if(key == 'consumption'){
              keyForm = 'consumption(ton/day)'
            }else if(key == 'teux'){
              keyForm = 'teu x 14 tons'
            }
            coin_info_arr.push({key: keyForm, value: data[0][key]})
          }
        }
      }
      return { ...state, coin_info_arr, coin_info: data[0]};break;
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

