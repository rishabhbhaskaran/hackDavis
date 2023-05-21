import React, { useState } from 'react';
import cx from 'classnames';
import SliderContext from './context'
import ShowDetailsButton from './ShowDetailsButton'
import Mark from './Mark'
import axios from "axios";
import './Item.scss'
import '../../../src/'
import { useNavigate } from 'react-router-dom';

function Item({ movie, setTopLevelState, topLevelState }) {
  const [style, setStyle] = useState({ display: 'none' });
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  function viewMap(id) {
    setTopLevelState(!topLevelState); // force whole page to reload
    navigate("/viewMap", { 'state': { 'layerId': id } });
  }

  function addMap(layerId, userId) {
    axios({
      method: "PATCH",
      url: "/save",
      data: {
        'layerId': layerId,
        'userId': userId,
      }
    })
      .then((response) => {
        setAdded(true);
      }).catch((error) => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
        }
      })
  }

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
            }} onClick={() => viewMap(movie.layerId)}
          >
            <img className="icon" src={movie.image} alt="" />
            <div className="centered" style={style}>{movie.name}<br />{movie.creator}</div>
            <div className="bottomCentered"><img onClick={added ? () => { } : () => addMap(movie.id, 1)} style={{ ...style, height: 30, width: 30 }} src={added ? 'https://www.freeiconspng.com/thumbs/checkmark-png/checkmark-png-5.png' : 'https://www.freeiconspng.com/thumbs/add-icon-png/add-icon--line-iconset--iconsmind-29.png'} /></div>
            {/* <ShowDetailsButton onClick={() => onSelectSlide(movie)} />
            {isActive && <Mark />} */}
          </div>
        );
      }}
    </SliderContext.Consumer>);
}

export default Item;
