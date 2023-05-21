import React, { useState } from 'react';
import cx from 'classnames';
import SliderContext from './context'
import ShowDetailsButton from './ShowDetailsButton'
import Mark from './Mark'
import './Item.scss'

function Item({ movie }) {
  const [style, setStyle] = useState({ display: 'none' });
  return (
    <SliderContext.Consumer>
      {({ onSelectSlide, currentSlide, elementRef }) => {
        const isActive = currentSlide && currentSlide.id === movie.id;

        return (
          <div
            ref={elementRef}
            className={cx('item', {
              'item--open': isActive,
            })} onMouseEnter={e => {
              console.log('here');
              setStyle({ display: 'block' });
            }} onMouseLeave={e => {
              setStyle({ display: 'none' });
            }}
          >
            <img src={movie.image} alt="" />
            <div className="centered" style={style}>{movie.name}<br />{movie.creator}</div>
            {/* <ShowDetailsButton onClick={() => onSelectSlide(movie)} />
            {isActive && <Mark />} */}
          </div>
        );
      }}
    </SliderContext.Consumer>);
}

export default Item;
