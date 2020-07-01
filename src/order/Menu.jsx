import React, { memo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './Menu.css';

function Menu(props) {
    const { show, options, onPress, hideMenu } = props;
    return (
        <div>
            {show && (
                <div className="menu-mask" onClick={() => hideMenu()}></div>
            )}
            <div className={classNames('menu', { show })}>
                <div className="menu-title"></div>
                <ul>
                    {options &&
                        options.map((ele) => {
                            return (
                                <OptionList
                                    key={ele.title}
                                    {...ele}
                                    onPress={onPress}
                                />
                            );
                        })}
                </ul>
            </div>
        </div>
    );
}
Menu.propTypes = {
    show: PropTypes.bool.isRequired,
    options: PropTypes.array,
    onPress: PropTypes.func,
    hideMenu: PropTypes.func.isRequired,
};

export default memo(Menu);

function OptionList(props) {
    const { title, active, onPress, value } = props;

    return (
        <li className={classNames({ active })} onClick={() => onPress(value)}>
            {title}
        </li>
    );
}

OptionList.propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    active: PropTypes.bool.isRequired,
};
