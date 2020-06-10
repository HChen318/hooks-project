import React, { memo, useState, useMemo, useCallback, useReducer } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Slider from './Slider.jsx'
import { ORDER_DEPART } from './constant'

import './Bottom.css'



const Bottom = memo(function Bottom(props) {
  const { orderType, highSpeed, onlyTickets, isFiltersVisible,
    toggleOrderType, toggleHighSpeed, toggleOnlyTickets, toggleIsFiltersVisible,
    ticketTypes, checkedTicketTypes, trainTypes, checkedTrainTypes, departStations,
    checkedDepartStations, arriveStations, checkedArriveStations, departTimeStart,
    departTimeEnd, arriveTimeStart, arriveTimeEnd,
    setCheckedTicketTypes, setCheckedTrainTypes, setCheckedDepartStations,
    setCheckedArriveStations, setDepartTimeStart, setDepartTimeEnd, setArriveTimeStart,
    setArriveTimeEnd, noChecked
  } = props


  return (
    <div className='bottom'>
      <div className="bottom-filters">
        <span className="item" onClick={toggleOrderType}>
          {/* &#x html写法 */}
          <i className="icon">&#xf065;</i>
          {orderType == ORDER_DEPART ? '出发 早→晚' : '耗时 短→长'}
        </span>
        <span className={classnames('item', { 'item-on': highSpeed })} onClick={toggleHighSpeed}>
          {/* \u js变量写法 */}
          <i className="icon">{highSpeed ? '\uf43f' : '\uf43e'}</i>
          只看高铁动车
        </span>
        <span className={classnames('item', { 'item-on': onlyTickets })} onClick={toggleOnlyTickets}>
          <i className="icon">{onlyTickets ? '\uf43d' : '\uf43c'}</i>
          只看有票
       </span>
        <span className={classnames('item', { 'item-on': !noChecked || isFiltersVisible })} onClick={toggleIsFiltersVisible}>
          <i className="icon">{noChecked ? '\uf0f7' : '\uf446'}</i>
          综合筛选
       </span>
      </div>

      {isFiltersVisible &&
        (<BottomModal
          ticketTypes={ticketTypes}
          checkedTicketTypes={checkedTicketTypes}
          trainTypes={trainTypes}
          checkedTrainTypes={checkedTrainTypes}
          departStations={departStations}
          checkedDepartStations={checkedDepartStations}
          arriveStations={arriveStations}
          checkedArriveStations={checkedArriveStations}
          toggleIsFiltersVisible={toggleIsFiltersVisible}
          departTimeStart={departTimeStart}
          departTimeEnd={departTimeEnd}
          arriveTimeStart={arriveTimeStart}
          arriveTimeEnd={arriveTimeEnd}

          setCheckedTicketTypes={setCheckedTicketTypes}
          setCheckedTrainTypes={setCheckedTrainTypes}
          setCheckedDepartStations={setCheckedDepartStations}
          setCheckedArriveStations={setCheckedArriveStations}
          setDepartTimeStart={setDepartTimeStart}
          setDepartTimeEnd={setDepartTimeEnd}
          setArriveTimeStart={setArriveTimeStart}
          setArriveTimeEnd={setArriveTimeEnd}
        />)}
    </div>
  )
})

export default Bottom;

Bottom.propTypes = {
  orderType: PropTypes.number.isRequired,
  highSpeed: PropTypes.bool.isRequired,
  onlyTickets: PropTypes.bool.isRequired,
  isFiltersVisible: PropTypes.bool.isRequired,
  toggleOrderType: PropTypes.func.isRequired,
  toggleHighSpeed: PropTypes.func.isRequired,
  toggleOnlyTickets: PropTypes.func.isRequired,
  toggleIsFiltersVisible: PropTypes.func.isRequired,
  ticketTypes: PropTypes.array.isRequired,
  checkedTicketTypes: PropTypes.object.isRequired,
  trainTypes: PropTypes.array.isRequired,
  checkedTrainTypes: PropTypes.object.isRequired,
  departStations: PropTypes.array.isRequired,
  checkedDepartStations: PropTypes.object.isRequired,
  arriveStations: PropTypes.array.isRequired,
  checkedArriveStations: PropTypes.object.isRequired,
  departTimeStart: PropTypes.number.isRequired,
  departTimeEnd: PropTypes.number.isRequired,
  arriveTimeStart: PropTypes.number.isRequired,
  arriveTimeEnd: PropTypes.number.isRequired,
}

function checkedReducer(state, action) {
  const { type, payload } = action;
  let newState;

  switch (type) {
    case 'toggle':
      newState = { ...state };
      if (payload in newState) {
        delete newState[payload];
      } else {
        newState[payload] = true;
      }
      return newState;
    case 'reset':
      return {};
    default:
  }

  return state;
}


function BottomModal(props) {
  const {
    ticketTypes,
    checkedTicketTypes,
    trainTypes,
    checkedTrainTypes,
    departStations,
    checkedDepartStations,
    arriveStations,
    checkedArriveStations,
    toggleIsFiltersVisible,
    departTimeStart,
    departTimeEnd,
    arriveTimeStart,
    arriveTimeEnd,
    setCheckedTicketTypes,
    setCheckedTrainTypes,
    setCheckedDepartStations,
    setCheckedArriveStations,
    setDepartTimeStart,
    setDepartTimeEnd,
    setArriveTimeStart,
    setArriveTimeEnd
  } = props
  // 临时缓存状态
  // const [localCheckedTicketTypes, setLocalCheckedTicketTypes] = useState(() => {
  //   return { ...checkedTicketTypes }
  // })
  // useReducer 可以当成局部的redux , useReducer能做useState也能
  const [
    localCheckedTicketTypes,
    localCheckedTicketTypesDispatch,
  ] = useReducer(checkedReducer, checkedTicketTypes, checkedTicketTypes => {
    return {
      ...checkedTicketTypes,
    };
  });

  const [localCheckedTrainTypes, localCheckedTrainTypesDispatch] = useReducer(
    checkedReducer,
    checkedTrainTypes,
    checkedTrainTypes => {
      return {
        ...checkedTrainTypes,
      };
    }
  );

  const [
    localCheckedDepartStations,
    localCheckedDepartStationsDispatch,
  ] = useReducer(
    checkedReducer,
    checkedDepartStations,
    checkedDepartStations => {
      return {
        ...checkedDepartStations,
      };
    }
  );

  const [
    localCheckedArriveStations,
    localCheckedArriveStationsDispatch,
  ] = useReducer(
    checkedReducer,
    checkedArriveStations,
    checkedArriveStations => {
      return {
        ...checkedArriveStations,
      };
    }
  );
  const [localDepartTimeStart, setLocalDepartTimeStart] = useState(parseFloat(departTimeStart))
  const [localDepartTimeEnd, setLocalDepartTimeEnd] = useState(parseFloat(departTimeEnd))
  const [localArriveTimeStart, setLocalArriveTimeStart] = useState(parseFloat(arriveTimeStart))
  const [localArriveTimeEnd, setLocalArriveTimeEnd] = useState(parseFloat(arriveTimeEnd))

  const optionGroup = [
    {
      title: '坐席类型',
      options: ticketTypes,
      checkedMap: localCheckedTicketTypes,
      dispatch: localCheckedTicketTypesDispatch
    },
    {
      title: '车次类型',
      options: trainTypes,
      checkedMap: localCheckedTrainTypes,
      dispatch: localCheckedTrainTypesDispatch
    },
    {
      title: '出发车站',
      options: departStations,
      checkedMap: localCheckedDepartStations,
      dispatch: localCheckedDepartStationsDispatch
    },
    {
      title: '到达车站',
      options: arriveStations,
      checkedMap: localCheckedArriveStations,
      dispatch: localCheckedArriveStationsDispatch
    },
  ]

  const noReset = useMemo(() => {
    return Object.keys(localCheckedTicketTypes).length === 0 && Object.keys(localCheckedTrainTypes).length === 0 &&
      Object.keys(localCheckedDepartStations).length === 0 && Object.keys(localCheckedArriveStations).length === 0 &&
      localDepartTimeStart === 0 && localDepartTimeEnd === 24 && localArriveTimeStart === 0 && localArriveTimeEnd === 24
  }, [
      localCheckedTicketTypes,
      localCheckedTrainTypes,
      localCheckedDepartStations,
      localCheckedArriveStations,
      localDepartTimeStart,
      localDepartTimeEnd,
      localArriveTimeStart,
      localArriveTimeEnd,
    ])

  const sure = useCallback(() => {
    setCheckedTicketTypes(localCheckedTicketTypes)
    setCheckedTrainTypes(localCheckedTrainTypes)
    setCheckedDepartStations(localCheckedDepartStations)
    setCheckedArriveStations(localCheckedArriveStations)
    setDepartTimeStart(parseFloat(localDepartTimeStart))
    setDepartTimeEnd(parseFloat(localDepartTimeEnd))
    setArriveTimeStart(parseFloat(localArriveTimeStart))
    setArriveTimeEnd(parseFloat(localArriveTimeEnd))
    toggleIsFiltersVisible()

  }, [localCheckedTicketTypes,
      localCheckedTrainTypes,
      localCheckedDepartStations,
      localCheckedArriveStations,
      localDepartTimeStart,
      localDepartTimeEnd,
      localArriveTimeStart,
      localArriveTimeEnd])

  const reset = useCallback(() => {
    if (!noReset) {
      return
    }
    localCheckedTicketTypesDispatch({ type: 'reset' });
    localCheckedTrainTypesDispatch({ type: 'reset' });
    localCheckedDepartStationsDispatch({ type: 'reset' });
    localCheckedArriveStationsDispatch({ type: 'reset' });
    setLocalDepartTimeStart(0)
    setLocalDepartTimeEnd(24)
    setLocalArriveTimeStart(0)
    setLocalArriveTimeEnd(24)
  }, [noReset])

  return (
    <div className="bottom-modal">
      <div className="bottom-dialog">
        <div className="bottom-dialog-content">
          <div className="title">
            <span className={classnames('reset', { disabled: noReset })} onClick={reset}>重置</span>
            <span className="ok" onClick={sure}>确定</span>
          </div>
          <div className="options">
            {optionGroup.map(option => <Option key={option.title} {...option} />)}
            <Slider
              title="出发时间"
              currentStartTime={localDepartTimeStart}
              currentEndTime={localDepartTimeEnd}
              currentStartTimeChange={setLocalDepartTimeStart}
              currentEndTimeChange={setLocalDepartTimeEnd}
            />
            <Slider
              title="到达时间"
              currentStartTime={localArriveTimeStart}
              currentEndTime={localArriveTimeEnd}
              currentStartTimeChange={setLocalArriveTimeStart}
              currentEndTimeChange={setLocalArriveTimeEnd}
            />

          </div>
        </div>
      </div>
    </div>
  )
}

BottomModal.propTypes = {
  ticketTypes: PropTypes.array.isRequired,
  checkedTicketTypes: PropTypes.object.isRequired,
  trainTypes: PropTypes.array.isRequired,
  checkedTrainTypes: PropTypes.object.isRequired,
  departStations: PropTypes.array.isRequired,
  checkedDepartStations: PropTypes.object.isRequired,
  arriveStations: PropTypes.array.isRequired,
  checkedArriveStations: PropTypes.object.isRequired,
  toggleIsFiltersVisible: PropTypes.func.isRequired,
}

function Option(props) {
  const { title, options, checkedMap, dispatch } = props

  // const toggle = useCallback((key) => {
  //   // 副本
  //   let newCheckedMap = { ...checkedMap }
  //   if (key in newCheckedMap) {
  //     delete newCheckedMap[key]
  //   } else {
  //     newCheckedMap[key] = true
  //   }
  //   update(newCheckedMap)
  // }, [checkedMap, update])

  return (
    <div className="option">
      <h3>{title}</h3>
      <ul>
        {options.map(ele => <OptionItem key={ele.value} {...ele} checked={ele.value in checkedMap} dispatch={dispatch} />)}
      </ul>
    </div>
  )
}

Option.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  checkedMap: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
}

function OptionItem(props) {
  const { value, name, checked, dispatch } = props

  return (
    <li className={checked ? 'checked' : ''} onClick={() => dispatch({ payload: value, type: 'toggle' })}>{name}</li>
  )
}

OptionItem.propTypes = {
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
}




