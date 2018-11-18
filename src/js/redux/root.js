import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import store from './stores/configureStore';
import history from './history.js';

import { syncReduxAndRouter } from 'redux-simple-router';
import {Main} from './components/body.js';
import 'semantic-ui-css/semantic.min.css';

let components = {
  Login: require('./components/login.js').default,
  Register: require('./components/register.js').default,
  Finance: require('./components/user/finance.js').default,
  CoinCoinExchange: require('./components/coin-coin-exchange/home.js').default,
  Transaction: require('./components/user/transaction.js').default,
  IndexPage: require('./components/index.js').default,
  Market: require('./components/market.js').default,
  Trade: require('./components/trade.js').default,
  FakeTrade: require('./components/user/fake-trade.js').default,
  UserCharge: require('./components/user/charge.js').default,
  WithdrawAddrManage: require('./components/user/withdraw-address-manage.js').default,
  paypaltest: require('./components/user/paypaltest.js').default,
  buytoken: require('./components/buy-token.js').default
}
const requireAuth = (nextState, replace) => {
    if (!sessionStorage.getItem('_udata')) {
        // Redirect to Home page if not an Admin
        replace({ pathname: '/login' })
    }
}

const get = componentName => ( routePath, callback ) => {
  require.ensure([], require => { callback(null, components[componentName])});
}


const App = () => (
  <Router history={history}>
    <Route path="/" component={Main} >
      <IndexRoute getComponent = { get('IndexPage')} />
      <Route path="/login" getComponent = { get('Login')} />
      <Route path="/register" getComponent = { get('Register')} />
      <Route path="/user/finance" onEnter={ requireAuth} getComponent={ get('Finance')} />
      <Route path="/user/charge" onEnter={ requireAuth} getComponent={ get('UserCharge')} />
      <Route path="/coin-coin-exchange" getComponent = { get('CoinCoinExchange')}/>
      <Route path="/transaction" onEnter = { requireAuth } getComponent = { get('Transaction')} />
      <Route path="/market" getComponent = { get('Market')} />
      <Route path="/trade/:coin(/:coinId)" getComponent = { get('Trade')} />
      {/*<Route path="/user/fake-trade" getComponent = { get('FakeTrade') } />*/}
      <Route path="/user/withdraw-address" getComponent= { get('WithdrawAddrManage') } />
      <Route path="/user/paypaltest" getComponent= { get('paypaltest') } />
      <Route path="/buytoken/:token/:tokenId" getComponent={get('buytoken')} />
    </Route>
  </Router>
  )

/*syncReduxAndRouter(history, store);*/

ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('mainContainer'));

/*const Root = ({store}) =>(
      //这里替换了之前的Index,变成了程序的入口
      <Provider store={store}>
          <Router history={history}>
            <Route path="/" component={Painter}>
            </Route>
          </Router>
      </Provider>
)

ReactDOM.render(<Root store={store}/>, document.getElementById('mainContainer'));*/