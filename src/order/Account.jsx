import React, { memo, useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import './Account.css'

function Account(prop) {
  const { price, length } = prop;
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="account">
      <div className="price">
        <div className="money" onClick={() => setExpanded(!expanded)}>{price * length}</div>
        <div className="amount">支付金额</div>
      </div>
      <div className="button">提交按钮</div>
      <div className={classNames('layer', { hidden: !expanded })} onClick={() => setExpanded(!expanded)}></div>
      <div className={classNames('detail', { hidden: !expanded })}>
        <div className="title">金额详情</div>
        <ul>
          <li>
            <span>火车票</span>
            <span>￥</span>
            <span>x {length}</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default memo(Account)

Account.prototype = {
  price: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,

}