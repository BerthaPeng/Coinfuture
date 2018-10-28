import * as Actions from 'actions/lang.js';
import { getLocaleFromBrowser } from 'utils/utils';

var initial_state = {
  //默认网站显示语言从先前设置的语言 || 浏览器语言 || 英文
  lang:  localStorage.getItem('lang') || getLocaleFromBrowser() || 'en-US'
}

export function Lang(state = initial_state, action){
  switch(action.type){
    case Actions.CHANGE_LANG:
      localStorage.setItem('lang', action.lang);
      return { ...state, lang: action.lang };break;
    default:
      return state;break;
  }
}