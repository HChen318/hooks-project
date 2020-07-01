import React, { memo } from 'react';
import PropTypes from 'prop-types';
import './Ticket.css';

function Ticket(props) {
    const { seatType, price } = props;
    return (
        <div className="ticket">
            <p>
                <span className="ticket-type">{seatType}</span>
                <span className="ticket-price">{price}</span>
            </p>
            <div className="label">坐席</div>
        </div>
    );
}

export default memo(Ticket);

Ticket.propTypes = {
    seatType: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // 字符串||数字
};
