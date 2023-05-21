import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";
import './yeti.min.css';
import './browse.css';
import Map from './map.js';
import Slider from './carousel/NetflixSlider'
Array.prototype.sample = function () {
    return this[Math.floor(Math.random() * this.length)];
}

const imageLinks = ['./map1.png', 'map2.png', 'map3.png', 'map4.png', 'map5.png'];
const movies = [
    {
        id: 1,
        image: imageLinks.sample(),
        title: '1983'
    },
    {
        id: 2,
        image: imageLinks.sample(),
        title: 'Russian doll'
    },
    {
        id: 3,
        image: imageLinks.sample(),
        title: 'The rain',
    },
    {
        id: 4,
        image: imageLinks.sample(),
        title: 'Sex education'
    },
    {
        id: 5,
        image: imageLinks.sample(),
        title: 'Elite'
    },
    {
        id: 6,
        image: imageLinks.sample(),
        title: 'Black mirror'
    }
];

function Carousel() {
    return (<div className="carousel">
        <div className="item">1</div>
        <div className="item">2</div>
        <div className="item">3</div>
        <div className="item">4</div>
        <div className="item">5</div>
    </div>)
}

function Browse() {
    return (<div className="Browse">
        <div className="container">
            <h1>Browse</h1>
            <h2>Featured</h2>
            <Slider>
                {movies.map(movie => (
                    <Slider.Item movie={movie} key={movie.id}>item1</Slider.Item>
                ))}
            </Slider>
            <h2>Verified</h2>
            <Slider>
                {movies.map(movie => (
                    <Slider.Item movie={movie} key={movie.id}>item1</Slider.Item>
                ))}
            </Slider>
            <h2>Community</h2>
            <Slider>
                {movies.map(movie => (
                    <Slider.Item movie={movie} key={movie.id}>item1</Slider.Item>
                ))}
            </Slider>
        </div>
    </div>);
}

export default Browse;
