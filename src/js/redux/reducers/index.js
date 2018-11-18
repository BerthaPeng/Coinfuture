import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';

import ExchangeData from './coin-coin-exchange.js';
import LoginData from './login.js';
import FinanceData from './user-finance.js';
import RegisterData from './register.js';
import TransacData from './transaction.js';
import TradeData from './trade.js';
import FakeTradeData from './fake-trade.js';
import PageIndexData from './page-index.js';
import MarketData from './market.js';
import BuytokenData from './buy-token.js';

const rootReducer = combineReducers({
  routing: routeReducer,
  ExchangeData,
  LoginData,
  FinanceData,
  RegisterData,
  TransacData,
  TradeData,
  FakeTradeData,
  PageIndexData,
  MarketData,
  BuytokenData
})

export default rootReducer;