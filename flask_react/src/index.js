import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";
import './yeti.min.css';
import { createRoot } from 'react-dom/client';
import Map from './map.js';

function App() {
    // new line start
    const [mapData, setMapData] = useState(null);
    const [locationData, setLocationData] = useState(null);

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            // x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    function showPosition(position) {
        setLocationData({ 'lat': position.coords.latitude, 'long': position.coords.longitude });
        // getCity(position.coords.latitude, position.coords.longitude);
    }

    function getData() {
        axios({
            method: "GET",
            url: "/getAgreggateMap",
        })
            .then((response) => {
                const res = response.data['pins'];
                var mapArray = [['Lat', 'Long', 'Name']];
                for (let i = 0; i < res.length; i++) {
                    const currLat = res[i]['lat'];
                    const currLong = res[i]['long'];
                    const currName = res[i]['data']['name'] ? res[i]['data']['name'] : "";
                    mapArray.push([currLat, currLong, currName]);
                }
                setMapData([...mapArray])
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                    console.log(error.response.status)
                    console.log(error.response.headers)
                }
            })
    }

    useEffect(() => {
        getData()
        getLocation();
    }, []);

    return (
        <div className="App">
            {/* <div class="navbar navbar-expand-lg fixed-top navbar-dark bg-primary"></div> */}
            <div className="container">
                <header className="App-header">
                    <h1>Discover Davis</h1>
                    {<div id='map'></div>}
                    {/* {locationData && <div>Lat {locationData.lat} Long {locationData.long}</div>} */}
                </header>
            </div>
            {mapData && locationData && <Map lat={locationData.lat} long={locationData.long} data={mapData} />}
        </div>
    );
}

const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(<App />);
