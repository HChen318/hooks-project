import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import classnames from 'classnames';

import './Nav.css';

export default function Nav(props) {
    const { isPrevDisable, isNextDisable, departDate, next, prev } = props;

    const currentTime = useMemo(() => {
        const d = dayjs(departDate);
        return d.format('M月D日 ') + d.locale('zh-cn').format('ddd');
    }, [departDate]);

    return (
        <div className="nav">
            <span
                className={classnames('nav-prev', {
                    'nav-disabled': isPrevDisable,
                })}
                onClick={prev}
            >
                前一天
            </span>
            <span className="nav-current">{currentTime}</span>
            <span
                className={classnames('nav-next', {
                    'nav-disabled': isNextDisable,
                })}
                onClick={next}
            >
                后一天
            </span>
        </div>
    );
}

Nav.propTypes = {
    isPrevDisable: PropTypes.bool.isRequired,
    isNextDisable: PropTypes.bool.isRequired,
    departDate: PropTypes.number.isRequired,
    next: PropTypes.func.isRequired,
    prev: PropTypes.func.isRequired,
};
