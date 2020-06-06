import { createStore, combineReducers, applyMiddleware } from 'redux';

import reducers from './reducers';
import thunk from 'redux-thunk';

import { dateFormat } from '../utils';
import { ORDER_DEPART } from './constant';

export default createStore(
    combineReducers(reducers),
    {
        from: null,
        to: null,
        departDate: dateFormat(Date.now()),
        highSpeed: false,
        trainList: [],  // 火车列表
        orderType: ORDER_DEPART,
        onlyTickets: false,
        ticketTypes: [],  // 座位类型
        checkedTicketTypes: {},
        trainTypes: [],  // 火车类型
        checkedTrainTypes: {},
        departStations: [], // 始发站
        checkedDepartStations: {},
        arriveStations: [], // 终到站
        checkedArriveStations: {},
        departTimeStart: 0,
        departTimeEnd: 24,
        arriveTimeStart: 0,
        arriveTimeEnd: 24,
        isFiltersVisible: false,
        searchParsed: false,  // 解析url完成后请求list
    },
    applyMiddleware(thunk)
);
