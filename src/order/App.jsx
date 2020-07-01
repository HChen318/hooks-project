import React, { useCallback, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import URI from 'urijs';
import dayjs from 'dayjs';
import Header from '../common/Header';
import Detail from '../common/Detail';
import Ticket from './Ticket';
import Menu from './Menu';
import Passengers from './Passengers';
import Choose from './Choose';
import Account from './Account';

import {
    setTrainNumber,
    setArriveStation,
    setDepartStation,
    setDepartDate,
    setSeatType,
    setSearchParsed,
    fetchInitial,
    createChild,
    createAdult,
    removePassenger,
    updatePassenger,
    showGenderMenu,
    hideMenu,
    showFollowAdultMenu,
    showTicketTypeMenu,
} from './actions';

import './App.css';

function App(props) {
    const {
        trainNumber,
        departStation,
        arriveStation,
        seatType,
        departDate,
        arriveDate,
        departTimeStr,
        arriveTimeStr,
        durationStr,
        price,
        passengers,
        menu,
        isMenuVisible,
        searchParsed,
        dispatch,
    } = props;

    const onBack = useCallback(() => {
        window.history.back();
    }, []);

    useEffect(() => {
        const { trainNumber, dStation, aStation, type, date } = URI.parseQuery(
            window.location.search
        );
        dispatch(setTrainNumber(trainNumber));
        dispatch(setArriveStation(aStation));
        dispatch(setDepartStation(dStation));
        dispatch(setDepartDate(date));
        dispatch(setSeatType(type));
        dispatch(setSearchParsed(true));
    }, [dispatch]);

    useEffect(() => {
        if (!searchParsed) return;

        const url = new URI('/rest/order')
            .setSearch('trainNumber', trainNumber)
            .setSearch('dStation', departStation)
            .setSearch('aStation', arriveStation)
            .setSearch('type', seatType)
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .toString();
        dispatch(fetchInitial(url));
    }, [
        trainNumber,
        departStation,
        arriveStation,
        seatType,
        departDate,
        searchParsed,
        dispatch,
    ]);

    const passngersCbs = useMemo(() => {
        return bindActionCreators(
            {
                createChild,
                createAdult,
                removePassenger,
                updatePassenger,
                showGenderMenu,
                showFollowAdultMenu,
                showTicketTypeMenu,
            },
            dispatch
        );
    }, [dispatch]);

    const menuCbs = useMemo(() => {
        return bindActionCreators(
            {
                hideMenu,
            },
            dispatch
        );
    }, [dispatch]);

    const chooseCbs = useMemo(() => {
        return bindActionCreators(
            {
                updatePassenger,
            },
            dispatch
        );
    }, [dispatch]);

    if (!searchParsed) return null;

    return (
        <div className="app">
            <div className="header-wrapper">
                <Header title="订单填写" onBack={onBack} />
            </div>
            <div className="detail-wrapper">
                <Detail
                    departDate={departDate}
                    arriveDate={arriveDate}
                    departStation={departStation}
                    arriveStation={arriveStation}
                    trainNumber={trainNumber}
                    durationStr={durationStr}
                    arriveTimeStr={arriveTimeStr}
                    departTimeStr={departTimeStr}
                >
                    {/* 插槽 */}
                    <span
                        className="train-icon"
                        style={{ display: 'block' }}
                    ></span>
                </Detail>
            </div>
            <Ticket seatType={seatType} price={price} />
            <Passengers passengers={passengers} {...passngersCbs} />
            {passengers.length > 0 && (
                <Choose passengers={passengers} {...chooseCbs} />
            )}
            <Account price={price} length={passengers.length} />
            <Menu show={isMenuVisible} {...menu} {...menuCbs} />
        </div>
    );
}

export default connect(
    function mapStateToProps(state) {
        return state;
    },
    function mapDispatchToProps(dispatch) {
        return { dispatch };
    }
)(App);
