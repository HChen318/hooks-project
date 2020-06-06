import React, { useCallback, useEffect } from 'react'
import dayjs from 'dayjs';
import URI from 'urijs'
import { dateFormat } from '../utils'
import Header from '../common/Header.jsx';
import Nav from '../common/Nav.jsx';
import useNav from '../common/useNav';
import { connect } from 'react-redux'
import {
  setFrom,
  setTo,
  setDepartDate,
  setHighSpeed,
  setSearchParsed,
  setTrainList,
  setTrainTypes,
  setTicketTypes,
  setDepartStations,
  setArriveStations,
  prevDate,
  nextDate

} from './actions'

import './App.css';

function App(props) {
  const {
    dispatch,
    from,
    to,
    departDate,
    highSpeed,
    trainList,
    orderType,
    onlyTickets,
    ticketTypes,
    checkedTicketTypes,
    trainTypes,
    checkedTrainTypes,
    departStations,
    checkedDepartStations,
    arriveStations,
    checkedArriveStations,
    departTimeStart,
    departTimeEnd,
    arriveTimeStart,
    arriveTimeEnd,
    searchParsed,

  } = props

  const onBack = useCallback(() => {
    window.history.back()
  }, [])

  useEffect(() => {
    let search = window.location.search
    var { date, from, highSpeed, to } = URI.parseQuery(search);

    dispatch(setFrom(from))
    dispatch(setTo(to))
    dispatch(setDepartDate(dateFormat(new Date(date))))
    dispatch(setHighSpeed(highSpeed))
    dispatch(setSearchParsed(true))
  }, [])

  useEffect(() => {
    if (!searchParsed) {
      return;
    }
    
    const url = new URI('/rest/query')
      .setSearch('from', from)
      .setSearch('to', to)
      .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
      .setSearch('highSpeed', highSpeed)
      .setSearch('orderType', orderType)
      .setSearch('onlyTickets', onlyTickets)
      .setSearch(
        'checkedTicketTypes',
        Object.keys(checkedTicketTypes).join()
      )
      .setSearch(
        'checkedTrainTypes',
        Object.keys(checkedTrainTypes).join()
      )
      .setSearch(
        'checkedDepartStations',
        Object.keys(checkedDepartStations).join()
      )
      .setSearch(
        'checkedArriveStations',
        Object.keys(checkedArriveStations).join()
      )
      .setSearch('departTimeStart', departTimeStart)
      .setSearch('departTimeEnd', departTimeEnd)
      .setSearch('arriveTimeStart', arriveTimeStart)
      .setSearch('arriveTimeEnd', arriveTimeEnd)
      .toString();

    fetch(url)
      .then(response => response.json())
      .then(result => {
        console.log(result, '====result')
        const {
          dataMap: {
            directTrainInfo: {
              trains,
              filter: {
                ticketType,
                trainType,
                depStation,
                arrStation,
              },
            },
          },
        } = result;
        dispatch(setTrainList(trains));
        dispatch(setTicketTypes(ticketType));
        dispatch(setTrainTypes(trainType));
        dispatch(setDepartStations(depStation));
        dispatch(setArriveStations(arrStation));
      });

  }, [
      from, to, departDate, highSpeed, orderType, onlyTickets, checkedTicketTypes,
      checkedTrainTypes, checkedDepartStations, checkedArriveStations,
      departTimeStart, departTimeEnd, arriveTimeStart, arriveTimeEnd
    ])

  // 自定义hooks
  const navHooks = useNav(departDate, prevDate, nextDate, dispatch)


  if (!searchParsed) {
    return null;
  }

  return (
    <div>
      <div className="header-wrapper">
        <Header onBack={onBack} title={`${from} ⇀ ${to}`} />
      </div>
      <Nav
        departDate={departDate}
        {...navHooks}
      />
    </div>
  )
}

export default connect(
  function mapStateToProps(state) {
    return state
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch }
  }
)(App)

