import { combineReducers } from 'redux';
import * as Actions from 'actions/market.js';
import { Lang } from './lang.js';

var initial_state = {
  coin_cate_list: [],
  coin_attr_list: [],
  origin_coin_cate_list: [],
  filter_coin_list: [],
}
function Market(state = initial_state, action){
  switch(action.type){
    case Actions.GET_COIN_CATEGORY_LIST_MARKET:
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
    case Actions.GET_COMMON_ATTR_LIST_MARKET:
      var { data } = action;
      data = data.map( m => { m.items = JSON.parse(m.items); return m;})
      return { ...state, coin_attr_list: data};break;
    case Actions.GET_COIN_LIST_BY_ATTR_MARKET:
      var coin_list = action.data.map( m => { m.cate_chain = JSON.parse( m.cate_chain); return m;})
      return { ...state, filter_coin_list: coin_list};break;
    default:
      return state;break;
  }
}

export default combineReducers({
  Lang,
  Market
})