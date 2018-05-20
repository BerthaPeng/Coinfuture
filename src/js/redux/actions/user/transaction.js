import { post } from 'utils/request'; //Promise
import Url from 'config/url';

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