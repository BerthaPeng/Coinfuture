import * as Actions from 'actions/lang.js';
import { getLocaleFromBrowser } from 'utils/utils';

var initial_state = {
  lang: getLocaleFromBrowser() || 'en-US'
}

export function Lang(state = initial_state, action){
  switch(action.type){
    case Actions.CHANGE_LANG:
      return { ...state, lang: action.lang };break;
    default:
      return state;break;
  }
}