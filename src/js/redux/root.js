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
      <Route path="/login" getComponent = { get('Login')} />
      <Route path="/:lang/login" getComponent = { get('Login')} />
      <Route path="/register" getComponent = { get('Register')} />
      <Route path="/:lang/register" getComponent = { get('Register')} />
      <Route path="/user/finance" onEnter={ requireAuth} getComponent={ get('Finance')} />
      <Route path="/:lang/user/finance" onEnter={ requireAuth} getComponent={ get('Finance')} />
      <Route path="/coin-coin-exchange" getComponent = { get('CoinCoinExchange')}/>
      <Route path="/:lang/coin-coin-exchange" getComponent = { get('CoinCoinExchange')}/>
      <Route path="/transaction" onEnter = { requireAuth } getComponent = { get('Transaction')} />
      <Route path="/:lang/transaction" onEnter = { requireAuth } getComponent = { get('Transaction')} />
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