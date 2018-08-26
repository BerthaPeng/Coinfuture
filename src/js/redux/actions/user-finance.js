import { post } from 'utils/request'; //Promise
import Url from 'config/url';

export const GET_USER_COIN_LIST = 'GET_USER_COIN_LIST';

export function getUserCoinList(params){
  return dispatch => {
    return post( 201005, params)
      .done( data => {
        dispatch({ type: GET_USER_COIN_LIST, data})
      })
  }
}

//获取币种的充值地址
export function getDepositAddress(params){
  return dispatch => {
    return post(201010, params);
  }
}