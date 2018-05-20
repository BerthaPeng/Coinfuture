export const CHANGE_LANG = 'CHANGE_LANG';
export function changeLang(lang){
  return dispatch => {
    dispatch({ type: CHANGE_LANG, lang })
  }
}