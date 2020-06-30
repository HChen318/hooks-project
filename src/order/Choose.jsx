import React, { memo } from 'react'
import className from 'classnames'
import PropTypes from 'prop-types'

import './Choose.css'


function Choose(props) {
  const { passengers, updatePassenger } = props

  const createSeat = (type) => {
    return (
      <div>
        {passengers.map(ele => {
          return <p
            className={className("seat", { active: ele.seat === type })}
            key={ele.id}
            data-text={type}
            onClick={() => updatePassenger(ele.id, { seat: type })}
          >&#xe02d;</p>
        })}
      </div>
    )
  }

  return (
    <div className='choose'>
      <p className="tip">在线选座</p>
      <div className="container">
        <div className="seats">
          <div>窗</div>
          {createSeat('A')}
          {createSeat('B')}
          {createSeat('C')}
          <div>过道</div>
          {createSeat('D')}
          {createSeat('F')}
          <div>窗</div>
        </div>
      </div>
    </div>
  )
}

export default memo(Choose)

Choose.propTypes = {
  passengers: PropTypes.array.isRequired,
  updatePassenger: PropTypes.func.isRequired
}


