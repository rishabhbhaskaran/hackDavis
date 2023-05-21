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

function Browse(props) {
    const [featured, setFeatured] = useState([]);
    const [verified, setVerified] = useState([]);
    const [community, setCommunity] = useState([]);

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
        getMaps('/getFeatured', setFeatured);
        getMaps('/getVerified', setVerified);
        getMaps('/getLayers?userId=abcd1234', setCommunity);
    }, []);

    return (<div className="Browse">
        <div className="container">
            <h1>Browse</h1>
            <h2>Featured</h2>
            <div>
                {(featured && featured.length) ? <Slider>
                    {featured.map(map => (
                        <Slider.Item className="sliderItem" movie={map} key={map.id} topLevelState={props.topLevelState} setTopLevelState={props.setTopLevelState}>item1</Slider.Item>
                    ))}
                </Slider> : <div></div>}
            </div>

            <h2>Verified</h2>
            <div>
                {(verified && verified.length) ? <Slider>
                    {verified.map(map => (
                        <Slider.Item className="sliderItem" movie={map} key={map.id} topLevelState={props.topLevelState} setTopLevelState={props.setTopLevelState}>item1</Slider.Item>
                    ))}
                </Slider> : <div></div>}
            </div>

            <h2>Community</h2>
            <div>
                {(community && community.length) ? <Slider>
                    {community.map(map => (
                        <Slider.Item className="sliderItem" movie={map} key={map.id} topLevelState={props.topLevelState} setTopLevelState={props.setTopLevelState}>item1</Slider.Item>
                    ))}
                </Slider> : <div></div>}
            </div>
        </div>
    </div>);
}

export default Browse;
