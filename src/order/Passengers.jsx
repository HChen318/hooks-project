import React, { memo, useMemo } from 'react'
import PropTypes from 'prop-types'
import './Passengers.css'

function Passengers(props) {
  const {
    passengers, createChild, createAdult,
    removePassenger, updatePassenger, showGenderMenu,
    showFollowAdultMenu,showTicketTypeMenu
  } = props

  // 存储所有人的id
  const togetherName = useMemo(() => {
    let ret = {}
    for (let item of passengers) {
      ret[item.id] = item.name
    }
    return ret
  }, [passengers])


  return (
    <div className='passengers'>
      <ul>
        {
          passengers && passengers.map((ele, i) => {
            return <Passenger
              {...ele}
              key={i}
              removePassenger={removePassenger}
              updatePassenger={updatePassenger}
              showGenderMenu={showGenderMenu}
              showFollowAdultMenu={showFollowAdultMenu}
              // 同行者
              followAdultName={togetherName[ele.followAdult]}
              showTicketTypeMenu={showTicketTypeMenu}
            />
          })
        }
      </ul>
      <section className="add">
        <div className="adult" onClick={() => createAdult()}>添加成人</div>
        <div className="child" onClick={() => createChild()}>添加儿童</div>
      </section>
    </div>
  )
}

export default memo(Passengers)

function Passenger(props) {
  const {
    id, name, ticketType, licenceNo, seat,
    removePassenger, updatePassenger, gender,
    birthday, followAdult, showGenderMenu, showFollowAdultMenu,
    followAdultName,showTicketTypeMenu
  } = props

  const isAdult = useMemo(() => ticketType === 'adult', [ticketType])

  return <li className="passenger">
    <i className="delete" onClick={() => removePassenger(id)}>-</i>
    <ol className="items">
      <li className="item">
        <label className="label name">姓名</label>
        <input
          type="text"
          className="input name"
          placeholder="乘客姓名"
          value={name}
          onChange={(e) => updatePassenger(id, { name: e.target.value })}
        />
        <label className="ticket-type" onClick={() => showTicketTypeMenu(id)}>
          {isAdult ? '成人票' : '儿童票'}
        </label>
      </li>
      {isAdult &&
        <li className="item">
          <label className="label licenceNo">身份证</label>
          <input
            type="text"
            className="input name"
            placeholder="证件号码"
            value={licenceNo}
            onChange={(e) => updatePassenger(id, { licenceNo: e.target.value })}
          />
        </li>
      }
      {
        !isAdult &&
        <li className="item arrow" onClick={() => showGenderMenu(id)}>
          <label className="label gender" >性别</label>
          <input
            type="text"
            className="input gender"
            placeholder="请选择"
            value={gender == 'male' ? '男' : gender == 'female' ? '女' : ''}
            readOnly
          />
        </li>
      }
      {
        !isAdult &&
        <li className="item">
          <label className="label birthday">出生日期</label>
          <input
            type="text"
            className="input gender"
            placeholder="如 19951015"
            value={birthday}
            onChange={(e) => updatePassenger(id, { birthday: e.target.value })}
          />
        </li>
      }
      {
        !isAdult &&
        <li className="item arrow" onClick={() => showFollowAdultMenu(id)}>
          <label className="label followAdult" >同行成人</label>
          <input
            type="text"
            className="input followAdult"
            placeholder="如 19951015"
            value={followAdultName}
            readOnly
          />
        </li>
      }
    </ol>
  </li>
}