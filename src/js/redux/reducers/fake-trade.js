import * as Actions from 'actions/lang.js';

var initial_state = {
  isFake: false
}

export function FakeTrade(state = initial_state, action){
  switch(action.type){
    case Actions.UPDATE_TRADE:
      return { ...state, isFake: !state.isFake};break;
    default:
      return state;break;
  }
}