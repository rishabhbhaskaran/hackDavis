import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";
import './yeti.min.css';
import { createRoot } from 'react-dom/client';
import Map from './map.js';

function CreateLayer() {
    const [layerId, setLayerId] = useState(null);

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            // x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    function showPosition(position) {
        setLocationData({ 'lat': position.coords.latitude, 'long': position.coords.longitude });
    }

    function postProject() {
        axios({
            method: 'POST',
            url: '/createProject',
            data: {
                'layerId': _,
                'layerName': _,
                'address': _,
                'projectName': _,
                'description': _
            }
        }).then((response) => {
            const res = response.data;
            console.log(res);
        }).catch((error) => {
            if (error.response) {
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
            }
        })
    }

    return (
        <div className="CreateLayer">
            <div className="container">
                <h1>Create Layer</h1>
                <div id='map'></div>
            </div>
            {locationData && <Map lat={locationData.lat} long={locationData.long} data={[[]]} />}
        </div>
    )
}

export default CreateLayer;
