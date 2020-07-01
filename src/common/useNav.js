import { useCallback } from 'react';
import { dateFormat } from '../utils';

const useNav = (departDate, prevDate, nextDate, dispatch) => {
    const isPrevDisable = dateFormat(departDate) <= dateFormat();
    // 假如大于20天
    const isNextDisable =
        dateFormat(departDate) - dateFormat() > 20 * 86400 * 1000;

    const prev = useCallback(() => {
        if (isPrevDisable) {
            return;
        }
        dispatch(prevDate());
    }, [dispatch, isPrevDisable, prevDate]);

    const next = useCallback(() => {
        if (isNextDisable) {
            return;
        }
        // debugger
        dispatch(nextDate());
    }, [dispatch, isNextDisable, nextDate]);

    return {
        isPrevDisable,
        isNextDisable,
        prev,
        next,
    };
};

export default useNav;
