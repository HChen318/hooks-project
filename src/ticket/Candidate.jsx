import React, { memo, useState, useCallback, useContext, useMemo } from 'react';
import dayjs from 'dayjs';
import URI from 'urijs';
import PropTypes from 'prop-types';
import Context from './context';
import './Candidate.css';

function Candidate(props) {
    const { tickets } = props;
    const [expandIndex, setExpandIndex] = useState(-1);

    const toggleExpand = useCallback((index) => {
        setExpandIndex((expandIndex) => (index === expandIndex ? '-1' : index));
    }, []);

    return (
        <div className="candidate">
            <ul>
                {tickets.map((ele, i) => {
                    return (
                        <Seats
                            key={ele.type}
                            expanded={expandIndex === i}
                            index={i}
                            toggleExpand={toggleExpand}
                            {...ele}
                        />
                    );
                })}
            </ul>
        </div>
    );
}

Candidate.propTypes = {
    tickets: PropTypes.array.isRequired,
};

export default memo(Candidate);

function Seats(props) {
    const {
        channels,
        priceMsg,
        ticketsLeft,
        type,
        expanded,
        toggleExpand,
        index,
    } = props;

    return (
        <li>
            <div
                className="bar"
                onClick={() => {
                    toggleExpand(index);
                }}
            >
                <span className="seat">{type}</span>
                <span className="price">
                    <i>¥</i>
                    {priceMsg}
                </span>
                <span className="btn">{expanded ? '预定' : '收起'}</span>
                <span className="num">{ticketsLeft}</span>
            </div>
            <div
                className="channels"
                style={{ height: expanded ? channels.length * 55 : 0 }}
            >
                {channels.map((ele, i) => {
                    return <Chanel {...ele} key={i} type={type} />;
                })}
            </div>
        </li>
    );
}

Seats.propTypes = {
    type: PropTypes.string.isRequired,
    priceMsg: PropTypes.string.isRequired,
    ticketsLeft: PropTypes.string.isRequired,
    channels: PropTypes.array.isRequired,
    expanded: PropTypes.bool.isRequired,
    toggleExpand: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
};

function Chanel(props) {
    const { name, desc, type } = props;
    const {
        trainNumber,
        departStation,
        arriveStation,
        departDate,
    } = useContext(Context);

    const src = useMemo(() => {
        return new URI('order.html')
            .setSearch('trainNumber', trainNumber)
            .setSearch('dStation', departStation)
            .setSearch('aStation', arriveStation)
            .setSearch('type', type)
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .toString();
    }, [type, trainNumber, departStation, arriveStation, departDate]);

    return (
        <div className="channel">
            <div className="middle">
                <div className="name">{name}</div>
                <div className="desc">{desc}</div>
            </div>
            <a href={src}>
                <div className="buy">买票</div>
            </a>
        </div>
    );
}

Chanel.propTypes = {
    name: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};
