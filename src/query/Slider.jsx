import React, { useState, memo, useMemo, useRef, useEffect } from 'react';
import useWidth from '../common/useWidth';
import './Slider.css';



const Slider = memo(function Slider(props) {
    const {
        title,
        currentStartTime,
        currentEndTime,
        currentStartTimeChange,
        currentEndTimeChange,
    } = props;

    // 左滑块
    const startHandle = useRef();
    // 右滑块
    const endHandle = useRef();
    // 不会重渲染???跨渲染周期”保存数据
    const lastStartX = useRef();
    const lastEndX = useRef();

    const range = useRef();
    const rangeWidth = useRef();

    const { width } = useWidth();
    // 记录初始值
    const startTimeVal = useRef(currentStartTime);
    const endTimeVal = useRef(currentEndTime);

    // 转换百分比来滑动> 延时初始化,组件第一次渲染被使用,值后面有变化也不会任何响应
    const [startTime, setStartTime] = useState(
        () => (currentStartTime / 24) * 100
    );
    const [endTime, setEndTime] = useState(() => (currentEndTime / 24) * 100);
    if (startTimeVal.current !== currentStartTime) {
        setStartTime(() => (currentStartTime / 24) * 100);
        startTimeVal.current = currentStartTime;
    }
    if (endTimeVal.current !== currentEndTime) {
        setEndTime(() => (currentEndTime / 24) * 100);
        endTimeVal.current = currentEndTime;
    }

    // 精度原因 所以做个限制
    const startPercent = useMemo(() => {
        if (startTime > 100) {
            return 100;
        }
        if (startTime < 0) {
            return 0;
        }
        return startTime;
    }, [startTime]);

    const endPercent = useMemo(() => {
        if (endTime > 100) {
            return 100;
        }
        if (endTime < 0) {
            return 0;
        }
        return endTime;
    }, [endTime]);

    // 滑块区间的数> 转换为小时数
    const startHour = useMemo(() => {
        const num = Math.round((startPercent * 24) / 100) + '';
        return num.padStart(2, '0') + ':00';
    }, [startPercent]);

    const endHour = useMemo(() => {
        const num = Math.round((endPercent * 24) / 100) + '';
        return num.padStart(2, '0') + ':00';
    }, [endPercent]);

    const onStartTouchBegin = (e) => {
        lastStartX.current = e.targetTouches[0].pageX;
    };
    const onStartTouchMove = (e) => {
        const touch = e.targetTouches[0];
        const distance = touch.pageX - lastStartX.current;
        lastStartX.current = touch.pageX;
        setStartTime(
            (startTime) => startTime + (distance / rangeWidth.current) * 100
        );
    };
    const onEndTouchBegin = (e) => {
        lastEndX.current = e.targetTouches[0].pageX;
    };
    const onEndTouchMove = (e) => {
        const touch = e.targetTouches[0];
        const distance = touch.pageX - lastEndX.current;
        lastEndX.current = touch.pageX;
        setEndTime(
            (endTime) => endTime + (distance / rangeWidth.current) * 100
        );
    };

    // 获取滑动区域的距离
    useEffect(() => {
        rangeWidth.current = parseFloat(
            window.getComputedStyle(range.current).width
        );
    }, [width]);

    useEffect(() => {
        startHandle.current.addEventListener(
            'touchstart',
            onStartTouchBegin,
            false
        );
        startHandle.current.addEventListener(
            'touchmove',
            onStartTouchMove,
            false
        );
        endHandle.current.addEventListener(
            'touchstart',
            onEndTouchBegin,
            false
        );
        endHandle.current.addEventListener('touchmove', onEndTouchMove, false);
        return () => {
            startHandle.current.removeEventListener(
                'touchstart',
                onStartTouchBegin,
                false
            );
            startHandle.current.removeEventListener(
                'touchmove',
                onStartTouchMove,
                false
            );
            endHandle.current.removeEventListener(
                'touchstart',
                onEndTouchBegin,
                false
            );
            endHandle.current.removeEventListener(
                'touchmove',
                onEndTouchMove,
                false
            );
        };
    }); // 副作用 不加

    // 回传
    useEffect(() => {
        const num = Math.round((startPercent * 24) / 100) + '';
        currentStartTimeChange(parseFloat(num));
    }, [currentStartTimeChange, startPercent]);

    useEffect(() => {
        const num = Math.round((endPercent * 24) / 100) + '';
        currentEndTimeChange(parseFloat(num));
    }, [currentEndTimeChange, endPercent]);

    return (
        <div className="option">
            <h3>{title}</h3>
            <div className="range-slider">
                <div className="slider">
                    <div
                        className="slider-range"
                        ref={range}
                        style={{
                            left: startPercent + '%',
                            width: endPercent - startPercent + '%',
                        }}
                    ></div>
                    <i
                        className="slider-handle"
                        style={{ left: startPercent + '%' }}
                        ref={startHandle}
                    >
                        <span>{startHour}</span>
                    </i>
                    <i
                        className="slider-handle"
                        style={{ left: endPercent + '%' }}
                        ref={endHandle}
                    >
                        <span>{endHour}</span>
                    </i>
                </div>
            </div>
        </div>
    );
});

export default Slider;
