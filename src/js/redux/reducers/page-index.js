import { combineReducers } from 'redux';
import * as Actions from 'actions/index.js';
import { Lang } from './lang.js';

var initial_state = {
  coin_cate_list: [],
  coin_attr_list: [],
  origin_coin_cate_list: [],
  filter_coin_list: [],
  market_list: []
}
function PageIndex(state = initial_state, action){
  switch(action.type){
    case Actions.GET_COIN_CATEGORY_LIST_INDEX:
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
    case Actions.GET_COMMON_ATTR_LIST_INDEX:
      var { data } = action;
      data = data.map( m => { m.items = JSON.parse(m.items); return m;})
      return { ...state, coin_attr_list: data};break;
    case Actions.GET_DAILY_MARKET_INDEX:
      var { daily } = action.data;
      daily = daily.slice(0, 5).map( d => {
        d = {
          ...d,
          name: d.s,
          price: Number(d.c).toFixed(4),
          change: d.cg,
          highest: Number(d.h).toFixed(4),
          lowest: Number(d.l).toFixed(4),
          commit: Number(d.a).toFixed(4),
          changeMoney: Number(d.c).toFixed(4),
        }
        if(d.cg.indexOf('-') != -1){
          d.direction = 'down';
        }else{
          d.direction = 'up';
        }
        return d;
      })
      return { ...state, market_list: daily};break;
    case Actions.GET_COIN_LIST_BY_ATTR_INDEX:
      return { ...state, filter_coin_list: action.data};break;
    default:
      return state;break;
  }
}

export default combineReducers({
  Lang,
  PageIndex
})