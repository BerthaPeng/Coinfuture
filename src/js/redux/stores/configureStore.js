import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import rootreducer from '../reducers/index';
const loggerMiddleware = createLogger();

const store = createStore(
    rootreducer,
    //dataTreeReducer,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  )

window.STORE = store;

export default store;