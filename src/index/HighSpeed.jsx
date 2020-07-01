import React from 'react';
import classnames from 'classnames';
import propTypes from 'prop-types';

import './HighSpeed.css';

export default function HightSpeed(props) {
    const { highSpeed, toggleHighSpeed } = props;

    return (
        <div className="high-speed">
            <div className="high-speed-label">只看高铁/动车</div>
            <div className="high-speed-switch">
                <input type="hidden" name="highSpeed" value={highSpeed} />
                <div
                    className={
                        !highSpeed
                            ? 'high-speed-track'
                            : 'high-speed-track checked'
                    }
                    onClick={() => toggleHighSpeed()}
                >
                    <span
                        className={classnames('high-speed-handle', {
                            checked: highSpeed,
                        })}
                    ></span>
                </div>
            </div>
        </div>
    );
}

HightSpeed.propTypes = {
    highSpeed: propTypes.bool.isRequired,
    toggleHighSpeed: propTypes.func.isRequired,
};
