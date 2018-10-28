import { post } from 'utils/request'; //Promise
import Url from 'config/url';
import config from 'config/app.config';

//获取币的分类列表
export const GET_COIN_CATEGORY_LIST_MARKET = 'GET_COIN_CATEGORY_LIST_MARKET';
export function getCoinCategoryList_market(params){
  return dispatch => {
    return post(201019, params)
      .done(data => {
        dispatch({ type: GET_COIN_CATEGORY_LIST_MARKET, data});
      })
  }
}


//获取公共属性列表
export const GET_COMMON_ATTR_LIST_MARKET = 'GET_COMMON_ATTR_LIST_MARKET';
export function getCommonAttrList_market(params){
  return dispatch => {
    return post(201020, params)
      .done(data => {
        dispatch({ type: GET_COMMON_ATTR_LIST_MARKET, data })
      })
  }
}

export const GET_COIN_LIST_BY_ATTR_MARKET = 'GET_COIN_LIST_BY_ATTR_MARKET';
export function getCoinListByAttr_market(params){
  return dispatch => {
    return post( 201021, params)
      .done( data => {
        dispatch({ type: GET_COIN_LIST_BY_ATTR_MARKET, data})
      })
  }
}

