import { post } from 'utils/request'; //Promise
import Url from 'config/url';

export const GET_TRANSAC_ING = "GET_TRANSAC_ING"
export const GET_TRANSAC_SUCCESS = "GET_TRANSAC_SUCCESS"
export const GET_TRANSAC_FAIL = "GET_TRANSAC_FAIL"

export function getTransacList(params){
  return dispatch => {
    dispatch({ type: GET_TRANSAC_ING });
    return post(201006, params)
      .done( data => {
        dispatch({ type: GET_TRANSAC_SUCCESS, data})
      })
      .fail( () => {
        dispatch({ type: GET_TRANSAC_FAIL });
      })
  }
}


export const GET_TRANSAC_DETAIL_LIST = 'GET_TRANSAC_DETAIL_LIST'

export function getTransacDetailList(params){
  return dispatch => {
    return post(201007, params)
      .done( data => {
        dispatch({ type: GET_TRANSAC_DETAIL_LIST, data})
      })
  }
}

//撤单
export const WITHDRAW = 'WITHDRAW';
export function withdraw(params){
  return dispatch => {
    return post(201011, params)
  }
}
