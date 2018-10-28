import { post } from 'utils/request'; //Promise
import Url from 'config/url';
import config from 'config/app.config';


export const GET_DAILY_MARKET_INDEX = 'GET_DAILY_MARKET_INDEX';
export function getDailyMarket_index(params){
  return dispatch => {
    return post(201204, params)
      .done(data => {
        dispatch({ type: GET_DAILY_MARKET_INDEX, data});
      })
  }
}
