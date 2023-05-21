import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";
import './yeti.min.css';
import Map from './map.js';

function DiscoverCity() {
    // new line start
    const [mapData, setMapData] = useState(null);
    const [locationData, setLocationData] = useState(null);
    const [tagline, setTagline] = useState('');

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            // x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    function showPosition(position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        setLocationData({ 'lat': lat, 'long': long });
        getData(lat, long);
        // getCity(position.coords.latitude, position.coords.longitude);
    }

    function getTagLine() {
        axios({
            method: "GET",
            url: "/getTagline"
        }).then((response) => {
            setTagline(response.data);
        })
    }

    function getData(lat, long) {
        axios({
            method: "GET",
            url: "/getAggregateMap?lat=" + lat + "&long=" + long,
        })
            .then((response) => {
                const res = response.data['pins'];
                var mapArray = [['Lat', 'Long', 'Name'], [lat, long, 'Current Location']];
                for (let i = 0; i < res.length; i++) {
                    const currLat = res[i]['lat'];
                    const currLong = res[i]['long'];
                    const currName = res[i]['data']['name'] ? res[i]['data']['name'] : "";
                    mapArray.push([currLat, currLong, currName]);
                }
                setMapData([...mapArray]);
                getTagLine();
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                    console.log(error.response.status)
                    console.log(error.response.headers)
                }
            })
    }

    useEffect(() => {
        getLocation();
    }, []);

    return (
        <div className="DiscoverCity">
            {/* <div class="navbar navbar-expand-lg fixed-top navbar-dark bg-primary"></div> */}
            <div className="container">
                <h1>Discover Davis</h1>
                <div id="tagline">{tagline}</div>
                <br />
                <div id='map'></div>
                {/* {locationData && <div>Lat {locationData.lat} Long {locationData.long}</div>} */}
            </div>
            {mapData && locationData && <Map lat={locationData.lat} long={locationData.long} data={mapData} />}
        </div>
    );
}

export default DiscoverCity;
