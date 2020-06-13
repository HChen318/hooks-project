import React, { memo, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import URI from 'urijs'
import classNames from 'classnames'
import './Schedule.css'

const Schedule = memo(function Schedule(props) {
  const { date, trainNumber, departStation, arriveStation } = props;
  const [scheduleList, setScheduleList] = useState([]);

  useEffect(() => {
    const url = new URI('/rest/schedule')
      .setSearch('trainNumber', trainNumber)
      .setSearch('departStation', departStation)
      .setSearch('arriveStation', arriveStation)
      .setSearch('date', dayjs(date).format('YYYY-MM-DD'))
      .toString();

    fetch(url).then(response => response.json()).then(arr => {
      // 是否出发车站(经过→出发车站)
      let departStr;
      // 是否到达车站(经过→到达车站)
      let arriveStr;
      // console.log(111)
      for (var i = 0; i < arr.length; i++) {
        if (!departStr) {
          if (arr[i].station === departStation) {
            departStr = Object.assign(arr[i], {
              isDepartStationBefore: false,
              isDeaprtStation: true,
              isArriveStation: false,
              isArriveStationAfter: false
            })
          } else {
            Object.assign(arr[i], {
              isDepartStationBefore: true,
              isDeaprtStation: false,
              isArriveStation: false,
              isArriveStationAfter: false
            })
          }
        } else if (!arriveStr) {
          if (arr[i].station === arriveStation) {
            arriveStr = Object.assign(arr[i], {
              isDepartStationBefore: false,
              isDeaprtStation: false,
              isArriveStation: true,
              isArriveStationAfter: false
            })
          } else {
            Object.assign(arr[i], {
              isDepartStationBefore: false,
              isDeaprtStation: false,
              isArriveStation: false,
              isArriveStationAfter: false
            })
          }
        } else {
          Object.assign(arr[i], {
            isDepartStationBefore: false,
            isDeaprtStation: false,
            isArriveStation: false,
            isArriveStationAfter: true
          })
        }
        Object.assign(arr[i], {
          isStartStation: i === 0,
          isEndStation: i === arr.length - 1
        })
      }
      console.log(arr, '===arr')
      setScheduleList(arr)
    })

  }, [date, trainNumber, departStation, arriveStation])


  return (
    <div className='schedule'>
      <div className="dialog">
        <h1>列车时刻表</h1>
        <div className="head">
          <div className="station">车站</div>
          <div className="deptime">到达</div>
          <div className="arrtime">发车</div>
          <div className="stoptime">停留时间</div>
        </div>
        <ul>
          {scheduleList.map((ele, i) => {
            return <ScheduleRow key={ele.station} {...ele} index={i + 1} />
          })}
        </ul>
      </div>
    </div>
  )
})

export default Schedule;

function ScheduleRow(props) {
  const {
    arriveTime, departTime, isEndStation, isArriveStation,
    isArriveStationAfter, isDeaprtStation, isDepartStationBefore,
    isStartStation, station, stay, index
  } = props

  return (
    <li>
      <div className={classNames('icon', { 'icon-red': isDeaprtStation || isArriveStation })}>
        {
          isDeaprtStation ? '出' : isArriveStation ? '到' : String(index).padStart(2, 0)
        }
      </div>
      <div className={classNames('row', { grey: isArriveStationAfter || isDepartStationBefore })}>
        <span className={classNames('station', { red: isDeaprtStation || isArriveStation })}>{station}</span>
        <span className={classNames('arrtime', { red: isArriveStation })}>
          {isStartStation ? '始发站' : arriveTime}
        </span>
        <span className={classNames('deptime', { red: isDeaprtStation })}>
          {isEndStation ? '终到站' : departTime}</span>
        <span className="stoptime" >
          {isStartStation || isEndStation ? '-' : stay + '分'}
        </span>
      </div>
    </li>
  )
}