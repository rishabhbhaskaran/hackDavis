import React, { useState } from 'react';
import cx from 'classnames';
import { useRef, useEffect } from 'react'

const SliderContext = React.createContext();

const PADDINGS = 110;

const useSizeElement = () => {
    const elementRef = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        setWidth(elementRef.current.clientWidth);
    }, [elementRef.current]);

    return { width, elementRef };
}

const useSliding = (elementWidth, countElements) => {
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [distance, setDistance] = useState(0);
    const [totalInViewport, setTotalInViewport] = useState(0)
    const [viewed, setViewed] = useState(0);

    useEffect(() => {
        const containerWidth = containerRef.current.clientWidth - PADDINGS;

        setContainerWidth(containerWidth);
        setTotalInViewport(Math.floor(containerWidth / elementWidth));
    }, [containerRef.current]);

    const handlePrev = () => {
        setViewed(viewed - totalInViewport);
        setDistance(distance + containerWidth);
    }

    const handleNext = () => {
        setViewed(viewed + totalInViewport);
        setDistance(distance - containerWidth)
    }

    const slideProps = {
        style: { transform: `translate3d(${distance}px, 0, 0)` }
    };

    const hasPrev = distance < 0;
    const hasNext = (viewed + totalInViewport) < countElements;

    return { handlePrev, handleNext, slideProps, containerRef, hasPrev, hasNext };
}

const Mark = () => (<div className="mark" />);

const SliderWrapper = ({ children }) => (
    <div className="slider-wrapper">
        {children}
    </div>
);

const SlideButton = ({ onClick, type }) => (
    <button className={`slide-button slide-button--${type}`} onClick={onClick}>
        <span>
            {/* <IconArrowDown /> */}
        </span>
    </button>
);

const Item = ({ movie }) => (
    <SliderContext.Consumer>
        {({ onSelectSlide, currentSlide, elementRef }) => {
            const isActive = currentSlide && currentSlide.id === movie.id;

            return (
                <div
                    ref={elementRef}
                    className={cx('item', {
                        'item--open': isActive,
                    })}
                >
                    <img src={movie.image} alt="" />
                    {/* <ShowDetailsButton onClick={() => onSelectSlide(movie)} /> */}
                    {isActive && <Mark />}
                </div>
            );
        }}
    </SliderContext.Consumer>
);

const Slider = ({ children, activeSlide }) => {
    const [currentSlide, setCurrentSlide] = useState(activeSlide);
    const { width, elementRef } = useSizeElement();
    const {
        handlePrev,
        handleNext,
        slideProps,
        containerRef,
        hasNext,
        hasPrev
    } = useSliding(width, React.Children.count(children));

    const handleSelect = movie => {
        setCurrentSlide(movie);
    };

    const handleClose = () => {
        setCurrentSlide(null);
    };

    const contextValue = {
        onSelectSlide: handleSelect,
        onCloseSlide: handleClose,
        elementRef,
        currentSlide,
    };

    return (
        <SliderContext.Provider value={contextValue}>
            <SliderWrapper>
                <div
                    className={cx('slider', { 'slider--open': currentSlide != null })}
                >
                    <div ref={containerRef} className="slider__container" {...slideProps}>{children}</div>
                </div>
                {hasPrev && <SlideButton onClick={handlePrev} type="prev" />}
                {hasNext && <SlideButton onClick={handleNext} type="next" />}
            </SliderWrapper>
            {/* {currentSlide && <Content movie={currentSlide} onClose={handleClose} />} */}
        </SliderContext.Provider>
    );
};

export { Slider, Item };
