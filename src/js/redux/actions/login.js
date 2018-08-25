import { post } from 'utils/request'; //Promise
import Url from 'config/url';

export const LOGIN_ING = 'LOGIN_ING';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';

export function login(params){
  return dispatch => {
    dispatch({ type: LOGIN_ING});
    return post(201001, params)
      .done( data => {
        dispatch( { type: LOGIN_SUCCESS, data, uname: params.mobile })
      } )
      .fail( data => {
        dispatch({ type: LOGIN_FAIL })
      })
  }

}

export const LOG_OUT = 'LOG_OUT';
export function logout(params){
  return dispatch => {
    return post(101002, params)
      .done( () => {
        dispatch({type: LOG_OUT})
      })
  }
}

