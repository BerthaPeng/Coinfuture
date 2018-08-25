
//修改trade类型
export const UPDATE_TRADE = 'UPDATE_TRADE';
export function updateTrade(){
  return dispatch => {
    dispatch({ type: UPDATE_TRADE })
  }
}