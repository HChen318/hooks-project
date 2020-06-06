import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { dateFormat } from '../utils';
import dayjs from 'dayjs';
import './DepartDate.css'

// 这里不做memo处理因为输入的参数不仅仅有父组件还有这个dateFormat()
export default function DepartDate(props) {
  const { departDate, dateClick } = props
  // 时间搓一直变化
  const timeFlag = dateFormat(departDate)

  const date = new Date(timeFlag);

  const dateVal = useMemo(() => {
    return dayjs(timeFlag).format('YYYY-MM-DD')
  }, [timeFlag])

  const isToday = timeFlag === dateFormat()

  const week = `周${['日', '一', '二', '三', '四', '五', '六'][date.getDay()]}${isToday ? '(今日)' : ''}`

  return (
    <div className='depart-date' onClick={() => dateClick() }  >
      <input type="hidden" name="date" value={dateVal} />
      {dateVal}
      <span className="depart-week">{week}</span>
    </div>
  )
}

DepartDate.propTypes = {
  departDate: PropTypes.number.isRequired,
  dateClick: PropTypes.func.isRequired,
}