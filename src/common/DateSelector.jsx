import React from 'react'
import classnames from 'classnames'
import Header from './Header.jsx'
import { dateFormat } from '../utils'
import PropTypes from 'prop-types';
import './DateSelector.css'


export default function DateSelector(props) {
  const { title, show, onBack, onSelect } = props;

  // 获取当月的0时0分0秒>递增月
  let now = new Date()
  now.setHours(0)
  now.setMinutes(0)
  now.setSeconds(0)
  now.setMilliseconds(0)
  now.setDate(1)
  let month = []
  month.push(now.getTime())
  month.push(now.setMonth(now.getMonth() + 1))
  month.push(now.setMonth(now.getMonth() + 1))

  return (
    <div className={classnames('date-selector', { hidden: !show })}>
      <Header title={title} onBack={onBack} />
      <div className="date-selector-tables">
        {month.map(ele => {
          return (
            <Month
              key={ele}
              startingTimeInMonth={ele}
              onSelect={onSelect}
            />
          );
        })}
      </div>
    </div>
  )
}

DateSelector.propTypes = {
  show: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};



function Month(props) {
  const { startingTimeInMonth, onSelect } = props
  const startDay = new Date(startingTimeInMonth)
  const currentDay = new Date(startingTimeInMonth)

  let days = []
  // 遍历递增天数,获取月的每一天
  while (currentDay.getMonth() === startDay.getMonth()) {
    days.push(currentDay.getTime())
    currentDay.setDate(currentDay.getDate() + 1)
  }

  // 如1号不是星期一,需前置补齐如:星期三补齐2个...星期日补齐6
  days = new Array(startDay.getDay() ? startDay.getDay() - 1 : 6).fill(null).concat(days)

  // 如31号不是星期日,需后置补齐
  const lastDay = new Date(days[days.length - 1]).getDay()

  days = days.concat(new Array(7 - lastDay).fill(null))
  // console.log(days)

  let weeks = []
  // 被7天整除
  for (let i = 0; i < days.length / 7; i++) {
    weeks.push(days.slice(i * 7, (i + 1) * 7))
  }

  return (
    <table className="date-table">
      <thead>
        <tr>
          <td colSpan="7">
            <h5>{`${startDay.getFullYear()}年${startDay.getMonth() + 1}月`}</h5>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr className="data-table-weeks">
          <th>周一</th>
          <th>周二</th>
          <th>周三</th>
          <th>周四</th>
          <th>周五</th>
          <th className="weekend">周六</th>
          <th className="weekend">周日</th>
        </tr>
        {weeks.map((ele, i) => {
          return <Week key={i} days={ele} onSelect={onSelect} />;
        })}
      </tbody>
    </table>
  )
}
Month.propTypes = {
  startingTimeInMonth: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
};


const Week = (props) => {
  const { days, onSelect } = props
  return (
    <tr className="date-table-days">
      {days.map((ele, i) => {
        return <Day day={ele} key={i} onSelect={onSelect} />
      })}
    </tr>
  )
}

Week.propTypes = {
  days: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const Day = (props) => {
  const { day, onSelect } = props
  if (!day) {
    return <td className="null"></td>;
  }
  const classes = [];
  const now = dateFormat();
  if (day < now) {
    classes.push('disabled');
  }
  if ([6, 0].includes(new Date(day).getDay())) {
    classes.push('weekend');
  }
  const dateString = now === day ? '今天' : new Date(day).getDate();

  return (
    <td className={classnames(classes)} onClick={() => onSelect(day)}>
      {dateString}
    </td>
  );
}

Day.propTypes = {
  day: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
};