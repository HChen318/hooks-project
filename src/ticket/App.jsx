import React, { useCallback, useMemo, useEffect, lazy, Suspense } from 'react';
import { bindActionCreators } from 'redux';
import URI from 'urijs';
import dayjs from 'dayjs';
import { dateFormat } from '../utils';
import Header from '../common/Header';
import Nav from '../common/Nav';
import Detail from '../common/Detail';
// import Schedule from './Schedule'
import Candidate from './Candidate';
import useNav from '../common/useNav';
import { connect } from 'react-redux';
import {
    setDepartDate,
    setArriveDate,
    setDepartTimeStr,
    setArriveTimeStr,
    setDepartStation,
    setArriveStation,
    setTrainNumber,
    setDurationStr,
    setTickets,
    toggleIsScheduleVisible,
    setSearchParsed,
    nextDate,
    prevDate,
} from './actions.js';

import Context from './context';

import './App.css';

const Schedule = lazy(() => import('./Schedule.jsx'));

function App(props) {
    const {
        departDate,
        arriveDate,
        departTimeStr,
        arriveTimeStr,
        departStation,
        arriveStation,
        trainNumber,
        durationStr,
        tickets,
        isScheduleVisible,
        searchParsed,
        dispatch,
    } = props;

    useEffect(() => {
        let { aStation, dStation, trainNumber, date } = URI.parseQuery(
            window.location.search
        );
        dispatch(setDepartStation(dStation));
        dispatch(setArriveStation(aStation));
        dispatch(setTrainNumber(trainNumber));
        dispatch(setDepartDate(dateFormat(date)));
        // 解析成功后发请求
        dispatch(setSearchParsed(true));
    }, [dispatch]);

    useEffect(() => {
        // 解析成功后发请求
        if (!searchParsed) {
            return;
        }
        const url = new URI('/rest/ticket')
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .setSearch('trainNumber', trainNumber)
            .toString();

        fetch(url)
            .then((response) => response.json())
            .then((res) => {
                const {
                    candidates,
                    detail: {
                        arriveDate,
                        arriveTimeStr,
                        departTimeStr,
                        durationStr,
                    },
                } = res;
                dispatch(setArriveDate(arriveDate));
                dispatch(setArriveTimeStr(arriveTimeStr));
                dispatch(setDepartTimeStr(departTimeStr));
                dispatch(setDurationStr(durationStr));
                dispatch(setTickets(candidates));
            });
    }, [
        departDate,
        departStation,
        arriveStation,
        trainNumber,
        searchParsed,
        dispatch,
    ]);

    const onBack = useCallback(() => {
        window.history.back();
    }, []);

    const detailCbs = useMemo(() => {
        return bindActionCreators(
            {
                toggleIsScheduleVisible,
            },
            dispatch
        );
    }, [dispatch]);

    const { isPrevDisable, isNextDisable, prev, next } = useNav(
        departDate,
        prevDate,
        nextDate,
        dispatch
    );

    if (!searchParsed) {
        return null;
    }

    return (
        <div className="app">
            <div className="header-wrapper">
                <Header title={trainNumber} onBack={onBack} />
            </div>
            <div className="nav-wrapper">
                <Nav
                    departDate={departDate}
                    isPrevDisable={isPrevDisable}
                    isNextDisable={isNextDisable}
                    prev={prev}
                    next={next}
                />
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
                    <span className="left"></span>
                    <span
                        className="schedule"
                        onClick={() => detailCbs.toggleIsScheduleVisible()}
                    >
                        时刻表
                    </span>
                    <span className="right"></span>
                </Detail>
            </div>
            <Context.Provider
                value={{
                    trainNumber,
                    departStation,
                    arriveStation,
                    departDate,
                }}
            >
                <Candidate tickets={tickets} />
            </Context.Provider>
            {isScheduleVisible && (
                <div
                    className="mask"
                    onClick={() => dispatch(toggleIsScheduleVisible())}
                >
                    {/* 异步组件  */}
                    <Suspense fallback={<div>Loading...</div>}>
                        <Schedule
                            date={departDate}
                            trainNumber={trainNumber}
                            departStation={departStation}
                            arriveStation={arriveStation}
                        />
                    </Suspense>
                </div>
            )}
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
