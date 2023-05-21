import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";
import './yeti.min.css';
import { useLocation } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import Map from './map.js';

function ViewMap() {
    const [mapData, setMapData] = useState([['Lat', 'Long', 'Name']]);
    const [locationData, setLocationData] = useState(null);
    const { state } = useLocation();
    const { layerId } = state;

    function getLayerInfo(layerId) {
        axios({
            method: 'GET',
            url: '/getLayer?layerId=' + layerId
        }).then((response) => {
            const res = response.data['pins'];
            let currPins = [];
            for (let i = 0; i < res.length; i++) {
                let currPin = res[i];
                currPins.push([parseFloat(currPin.lat), parseFloat(currPin.long), currPin.name]);
            }
            // currPins.push([locationData.lat, locationData.long, 'Current Location']);
            let newMapData = [...mapData, ...currPins];
            setMapData(newMapData);
        }).catch((error) => {
            if (error.response) {
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
            }
        })
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
        }
    }

    function showPosition(position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        setLocationData({ 'lat': lat, 'long': long });
        setMapData([...mapData, [parseFloat(lat), parseFloat(long), 'Current Location']]);
        getLayerInfo(layerId);
    }

    useEffect(() => {
        getLocation();
    }, []);

    return (<div className="View Map">
        <div className="container">
            <h1>View Map</h1>
            <div id='map' className='flex-item'></div>
        </div>
        {locationData && mapData && <Map lat={locationData.lat} long={locationData.long} data={mapData} />}
    </div>);
}

export default ViewMap;