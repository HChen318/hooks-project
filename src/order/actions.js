export const ACTION_SET_TRAIN_NUMBER = 'SET_TRAIN_NUMBER';
export const ACTION_SET_DEPART_STATION = 'SET_DEPART_STATION';
export const ACTION_SET_ARRIVE_STATION = 'SET_ARRIVE_STATION';
export const ACTION_SET_SEAT_TYPE = 'SET_SEAT_TYPE';
export const ACTION_SET_DEPART_DATE = 'SET_DEPART_DATE';
export const ACTION_SET_ARRIVE_DATE = 'SET_ARRIVE_DATE';
export const ACTION_SET_DEPART_TIME_STR = 'SET_DEPART_TIME_STR';
export const ACTION_SET_ARRIVE_TIME_STR = 'SET_ARRIVE_TIME_STR';
export const ACTION_SET_DURATION_STR = 'SET_DURATION_STR';
export const ACTION_SET_PRICE = 'SET_PRICE';
export const ACTION_SET_PASSENGERS = 'SET_PASSENGERS';
export const ACTION_SET_MENU = 'SET_MENU';
export const ACTION_SET_IS_MENU_VISIBLE = 'SET_IS_MENU_VISIBLE';
export const ACTION_SET_SEARCH_PARSED = 'SET_SEARCH_PARSED';

export function setTrainNumber(trainNumber) {
    return {
        type: ACTION_SET_TRAIN_NUMBER,
        payload: trainNumber,
    };
}
export function setDepartStation(departStation) {
    return {
        type: ACTION_SET_DEPART_STATION,
        payload: departStation,
    };
}
export function setArriveStation(arriveStation) {
    return {
        type: ACTION_SET_ARRIVE_STATION,
        payload: arriveStation,
    };
}
export function setSeatType(seatType) {
    return {
        type: ACTION_SET_SEAT_TYPE,
        payload: seatType,
    };
}
export function setDepartDate(departDate) {
    return {
        type: ACTION_SET_DEPART_DATE,
        payload: departDate,
    };
}
export function setArriveDate(arriveDate) {
    return {
        type: ACTION_SET_ARRIVE_DATE,
        payload: arriveDate,
    };
}
export function setDepartTimeStr(departTimeStr) {
    return {
        type: ACTION_SET_DEPART_TIME_STR,
        payload: departTimeStr,
    };
}
export function setArriveTimeStr(arriveTimeStr) {
    return {
        type: ACTION_SET_ARRIVE_TIME_STR,
        payload: arriveTimeStr,
    };
}
export function setDurationStr(durationStr) {
    return {
        type: ACTION_SET_DURATION_STR,
        payload: durationStr,
    };
}
export function setPrice(price) {
    return {
        type: ACTION_SET_PRICE,
        payload: price,
    };
}
export function setPassengers(passengers) {
    return {
        type: ACTION_SET_PASSENGERS,
        payload: passengers,
    };
}
export function setMenu(menu) {
    return {
        type: ACTION_SET_MENU,
        payload: menu,
    };
}
export function setIsMenuVisible(isMenuVisible) {
    return {
        type: ACTION_SET_IS_MENU_VISIBLE,
        payload: isMenuVisible,
    };
}
export function setSearchParsed(searchParsed) {
    return {
        type: ACTION_SET_SEARCH_PARSED,
        payload: searchParsed,
    };
}

export function fetchInitial(url) {
    return (dispatch, getState) => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                const {
                    departTimeStr,
                    arriveTimeStr,
                    arriveDate,
                    durationStr,
                    price,
                } = data;

                dispatch(setDepartTimeStr(departTimeStr));
                dispatch(setArriveTimeStr(arriveTimeStr));
                dispatch(setArriveDate(arriveDate));
                dispatch(setDurationStr(durationStr));
                dispatch(setPrice(price));
            });
    };
}

let passengerIdSeed = 0;

export function createAdult() {
    return (dispatch, getState) => {
        const {
            passengers
        } = getState()
        // 添加第二个乘客之前信息需全部填写
        for (let item of passengers) {
            let props = Object.keys(item)
            for (let key of props) {
                if (!item[key]) return;
            }
        }
        dispatch(setPassengers([
            ...passengers,
            {
                id: ++passengerIdSeed,
                name: '',
                ticketType: 'adult', // 成人
                licenceNo: '',
                seat: 'Z'
            }
        ]))
    }
}

export function createChild() {
    return (dispatch, getState) => {
        const {
            passengers
        } = getState()

        let followAdultID = null

        // 添加第二个乘客之前信息需全部填写
        for (let item of passengers) {
            let props = Object.keys(item)
            for (let key of props) {
                if (!item[key]) return;
            }
            if (item.ticketType === 'adult') {
                followAdultID = item.id
            }
        }
        if (!followAdultID) return alert('至少添加一位成人')

        dispatch(setPassengers([
            ...passengers,
            {
                id: ++passengerIdSeed,
                name: '',
                ticketType: 'child', // 儿童
                gender: '',
                birthday: '',
                followAdult: followAdultID,
                seat: 'Z'
            }
        ]))
    }
}

export function removePassenger(id) {
    return (dispatch, getState) => {
        const {
            passengers
        } = getState();
        // 同行儿童也删除
        const newPassengers = passengers.filter(ele => {
            return ele.id != id && ele.followAdult != id
        })

        dispatch(setPassengers(newPassengers));
    };
}

export function updatePassenger(id, data, keysToBeRemoved = []) {
    return (dispatch, getState) => {
        const {
            passengers
        } = getState();
        passengers.some((ele, i) => {
            if (ele.id === id) {
                let newPassengers = [...passengers]
                newPassengers[i] = Object.assign({}, {
                    ...ele
                }, data)
                keysToBeRemoved.forEach(item => {
                    delete newPassengers[i][item]
                })
                dispatch(setPassengers(newPassengers))
                return true
            }
        })
    };
}

export function showMenu(menu) {
    return dispatch => {
        dispatch(setMenu(menu));
        dispatch(setIsMenuVisible(true));
    };
}

export function showFollowAdultMenu(id) {
    return (dispatch, getState) => {
        const {
            passengers
        } = getState();

        const passenger = passengers.find(passenger => passenger.id === id);
        if (!passenger) {
            return;
        }
        dispatch(showMenu({
            onPress(followAdult) {
                dispatch(updatePassenger(id, {
                    followAdult
                }))
                dispatch(hideMenu())
            },
            // 过滤出成人乘客
            options: passengers.filter(item => {
                return item.ticketType === 'adult'
            }).map(ele => {
                return {
                    title: ele.name,
                    value: ele.id,
                    active: ele.id === passenger.followAdult
                }
            })
        }))
    };
}

export function showGenderMenu(id) {
    return (dispatch, getState) => {
        const {
            passengers
        } = getState();

        const passenger = passengers.find(passenger => passenger.id === id);

        if (!passenger) {
            return;
        }
        dispatch(showMenu({
            onPress(gender) {
                dispatch(updatePassenger(id, {
                    gender
                }))
                dispatch(hideMenu())
            },
            options: [{
                    title: '男',
                    value: 'male',
                    active: 'male' === passenger.gender
                },
                {
                    title: '女',
                    value: 'female',
                    active: 'female' === passenger.gender
                }
            ]
        }))
    };
}

export function showTicketTypeMenu(id) {
    return (dispatch, getState) => {
        const {
            passengers
        } = getState();

        const passenger = passengers.find(passenger => passenger.id === id);

        if (!passenger) {
            return;
        }
        dispatch(showMenu({
            onPress(ticketType) {
                if (ticketType == 'adult') {
                    dispatch(updatePassenger(id, {
                        ticketType,
                        licenceNo: '',
                    }, ['gender', 'followAdult', 'birthday']))
                } else {
                    // 切换儿童, 找到其余乘客,看有没有成人. 有的话才能切换儿童
                    const adult = passengers.find(passenger => passenger.id != id && passenger.ticketType === 'adult');
                    if (adult) {
                        dispatch(
                            updatePassenger(
                                id, {
                                    ticketType,
                                    gender: '',
                                    followAdult: adult.id,
                                    birthday: '',
                                },
                                ['licenceNo']
                            )
                        );
                    } else {
                        alert('没有其他成人乘客');
                    }
                }
                dispatch(hideMenu())
            },
            options: [{
                    title: '成人票',
                    value: 'adult',
                    active: 'adult' === passenger.ticketType
                },
                {
                    title: '儿童票',
                    value: 'child',
                    active: 'child' === passenger.ticketType
                }
            ]
        }))
    };
}

export function hideMenu() {
    return setIsMenuVisible(false);
}