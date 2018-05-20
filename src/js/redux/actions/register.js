import { post } from 'utils/request'; //Promise
import Url from 'config/url';
import config from 'config/app.config';

export const SEND_CAPTCHA_START = 'SEND_CAPTCHA_START';
export const SEND_CAPTCHA_SUCCESS = 'SEND_CAPTCHA_SUCCESS';
export const SEND_CAPTCHA_OVER = 'SEND_CAPTCHA_OVER';

export const UPDATE_TIME = 'UPDATE_TIME';

export const REGISTER_ING = 'REGISTER_ING';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAIL = 'REGISTER_FAIL';

export function getPhoneCaptcha(params){
  return dispatch => {
    dispatch({ type: SEND_CAPTCHA_START});
    return post( Url.getCaptcha, 'app', params)
      .done( () => {
        dispatch({ type: SEND_CAPTCHA_SUCCESS });
      })
  }
}

export function updateTime(){
  return dispatch => {
    dispatch({ type: UPDATE_TIME})
  }
}

export function register(params){
  return dispatch => {
    dispatch({ type: REGISTER_ING });

    return post(Url.register, 'app', params)
      .done( () => {
        dispatch({ type: REGISTER_SUCCESS })
      })
      .fail( () => {
        dispatch({ type: REGISTER_FAIL })
      })
  }
}