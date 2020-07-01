export const ACTION_SET_FROM = 'SET_FROM';
export const ACTION_SET_TO = 'SET_TO';
export const ACTION_SET_IS_CITY_SELETORVISIBLE = 'SET_IS_CITY_SELETORVISIBLE';
export const ACTION_SET_CURRENT_SELETOR_LEFT_CITY =
    'SET_CURRENT_SELETOR_LEFT_CITY';
export const ACTION_SET_CITY_DATA = 'SET_CITY_DATA';
export const ACTION_SET_IS_LOADING_CITY_DATA = 'SET_IS_LOADING_CITY_DATA';
export const ACTION_SET_IS_DATE_SELETORVISIBLE = 'SET_IS_DATE_SELETORVISIBLE';
export const ACTION_SET_HIGHSPEED = 'SET_HIGHSPEED';
export const ACTION_SET_DEPART_DATE = 'SET_DEPART_DATE';

export function setFrom(from) {
    return {
        type: ACTION_SET_FROM,
        payload: from,
    };
}

export function setTo(to) {
    return {
        type: ACTION_SET_TO,
        payload: to,
    };
}

export function setCityData(cityData) {
    return {
        type: ACTION_SET_CITY_DATA,
        payload: cityData,
    };
}

export function setIsLoadingCityData(isLoadingCityData) {
    return {
        type: ACTION_SET_IS_LOADING_CITY_DATA,
        payload: isLoadingCityData,
    };
}

// 异步action,要获取当前值,计算最新的值
export function toggleHighSpeed() {
    return (dispatch, getState) => {
        const { highSpeed } = getState();
        dispatch({
            type: ACTION_SET_HIGHSPEED,
            payload: !highSpeed,
        });
    };
}

// 异步action
export function showCitySelector(currentSelectingLeftCity) {
    return (dispatch) => {
        dispatch({
            type: ACTION_SET_IS_CITY_SELETORVISIBLE,
            payload: true,
        });
        dispatch({
            type: ACTION_SET_CURRENT_SELETOR_LEFT_CITY,
            payload: currentSelectingLeftCity,
        });
    };
}

export function hideCitySelector() {
    return {
        type: ACTION_SET_IS_CITY_SELETORVISIBLE,
        payload: false,
    };
}

export function setSelectedCity(city) {
    return (dispatch, getState) => {
        const { currentSelectingLeftCity } = getState();
        if (currentSelectingLeftCity) {
            dispatch(setFrom(city));
        } else {
            dispatch(setTo(city));
        }
        dispatch(hideCitySelector());
    };
}

export function showDateSelector() {
    return {
        type: ACTION_SET_IS_DATE_SELETORVISIBLE,
        payload: true,
    };
}

export function hideDateSelector() {
    return {
        type: ACTION_SET_IS_DATE_SELETORVISIBLE,
        payload: false,
    };
}

export function exchangeFromTo() {
    return (dispatch, getState) => {
        const { from, to } = getState();
        dispatch(setFrom(to));
        dispatch(setTo(from));
    };
}

export function setDepartDate(departDate) {
    return {
        type: ACTION_SET_DEPART_DATE,
        payload: departDate,
    };
}

// 城市数据
export function fetchCityData() {
    return (dispatch, getState) => {
        const { isLoadingCityData } = getState();
        if (isLoadingCityData) {
            return;
        }
        let cache = JSON.parse(localStorage.getItem('city_data') || '{}');
        // 设置的缓存时间
        if (Date.now() < cache.expires) {
            dispatch(setCityData(cache.cityData));
            return;
        }
        dispatch(setIsLoadingCityData(true));

        fetch('/rest/cities?_' + Date.now())
            .then((res) => {
                return res.json();
            })
            .then((cityData) => {
                localStorage.setItem(
                    'city_data',
                    JSON.stringify({
                        expires: Date.now() + 60 * 1000,
                        cityData,
                    })
                );
                dispatch(setCityData(cityData));
                dispatch(setIsLoadingCityData(false));
            })
            .catch(() => {
                dispatch(setIsLoadingCityData(false));
            });
    };
}
