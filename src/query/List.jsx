import React, { useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

import './List.css'

const List = memo(function List(props) {
  const { list } = props
  return (
    <ul className='list'>
      {list.map(ele => {
        return <ListItem {...ele} key={ele.trainNumber} />
      })}
    </ul>
  )
})

List.propTypes = {
  list: PropTypes.array.isRequired
}

export default List


const ListItem = memo(function ListItem(props) {
  const { dTime, aTime, dStation, aStation, trainNumber, time, priceMsg } = props

  const urlString = useMemo(() => {
    return new URI()
      .setSearch("dStation", dStation)
      .setSearch("aStation", aStation)
      .setSearch("trainNumber", trainNumber)
      .setSearch("date", time)
      .toString()
  }, [dStation, aStation, trainNumber, time])

  return <li className="list-item">
    <a href={urlString}>
      <span className="item-time">
        <em>{dTime}</em>
        <br />
        <em>{aTime}</em>
      </span>
      <span className="item-stations">
        <em>
          <i className="train-station train-start">始</i>
          {dStation}
        </em>
        <br />
        <em className="em-light">
          <i className="train-station train-end">终</i>
          {aStation}
        </em>
      </span>
      <span className="item-train">
        <em>{trainNumber}</em>
        <br />
        <em className="em-light">{time}</em>
      </span>
      <span className="item-ticket">
        <em>{priceMsg}</em>
        <br />
        <em className="em-light-orange">可抢票</em>
      </span>
    </a>
  </li>
})

ListItem.propTypes = {
  dTime: PropTypes.string.isRequired,
  aTime: PropTypes.string.isRequired,
  dStation: PropTypes.string.isRequired,
  aStation: PropTypes.string.isRequired,
  trainNumber: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  priceMsg: PropTypes.string.isRequired
}