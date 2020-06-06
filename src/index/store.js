import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose
} from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers'

// Chrome查看redux
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  combineReducers(reducers), {
    from: '北京',
    to: '上海',
    isCitySelectorVisible: false, // 城市选择浮层
    currentSelectingLeftCity: false,
    cityData: null,
    isLoadingCityData: false, // 城市加载数据状态
    departDate: Date.now(),
    isDateSelectorVisible: false,
    highSpeed: false,
  },
  composeEnhancers(applyMiddleware(thunk)),
)