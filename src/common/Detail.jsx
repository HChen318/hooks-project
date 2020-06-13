import React, { useState, memo, useMemo } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

import './Detail.css'

function format(val) {
  let date = dayjs(val)
  return date.format('MM-DD') + ' ' + date.locale('zh-cn').format('ddd')
}

const Detail = memo(function Detail(props) {
  const {
    departDate,
    arriveDate,
    departStation,
    arriveStation,
    trainNumber,
    durationStr,
    arriveTimeStr,
    departTimeStr,
    toggleIsScheduleVisible
  } = props

  const departDateStr = useMemo(() => format(departDate), [departDate])
  const arriveDateStr = useMemo(() => format(arriveDate), [arriveDate])

  return (
    <div className='detail'>
      <div className="content">
        <div className="left">
          <p className="city">{departStation}</p>
          <p className="time">{departTimeStr}</p>
          <p className="date">{departDateStr}</p>
        </div>
        <div className="middle">
          <p className="train-name">{trainNumber}</p>
          <div className="train-mid">
            <span className="left"></span>
            <span className="schedule" onClick={() => toggleIsScheduleVisible()}>时刻表</span>
            <span className="right"></span>
          </div>
          <p className="train-time">
            {'耗时' + durationStr}
          </p>
        </div>
        <div className="right">
          <p className="city">{arriveStation}</p>
          <p className="time">{arriveTimeStr}</p>
          <p className="date">{arriveDateStr}</p>
        </div>
      </div>
    </div>
  )
})

export default Detail