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

function Browse() {
    const [featured, setFeatured] = useState(null);
    const [verified, setVerified] = useState(null);
    const [community, setCommunity] = useState(null);

    function getMaps(endpoint, func) {
        axios({
            method: 'GET',
            url: endpoint
        }).then((response) => {
            var newMaps = [];
            const res = response.data;
            for (let i = 0; i < res.length; i++) {
                const currCreator = res[i].creator;
                const currName = res[i].layerName ? res[i].layerName : '';
                newMaps.push({ 'id': i, 'name': currName, 'creator': currCreator, 'image': imageLinks.sample() });
            }
            func([...newMaps]);
        }).catch((error) => {
            if (error.response) {
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
            }
        })
    }

    useEffect(() => {
        getMaps('/getLayers?userId=abcd1234', setFeatured);
        getMaps('/getLayers?userId=abcd1234', setVerified);
        getMaps('/getLayers?userId=abcd1234', setCommunity);
    }, []);

    return (<div className="Browse">
        <div className="container">
            <h1>Browse</h1>
            <h2>Featured</h2>
            <div>
                {featured && <Slider>
                    {featured.map(map => (
                        <Slider.Item className="sliderItem" movie={map} key={map.id}>item1</Slider.Item>
                    ))}
                </Slider>}
            </div>

            <h2>Verified</h2>
            <div>
                {verified && <Slider>
                    {verified.map(map => (
                        <Slider.Item className="sliderItem" movie={map} key={map.id}>item1</Slider.Item>
                    ))}
                </Slider>}
            </div>

            <h2>Community</h2>
            <div>
                {community && <Slider>
                    {community.map(map => (
                        <Slider.Item className="sliderItem" movie={map} key={map.id}>item1</Slider.Item>
                    ))}
                </Slider>}
            </div>

        </div>
    </div>);
}

export default Browse;
