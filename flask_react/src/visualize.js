import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";
import './yeti.min.css';
import './visualize.css';
import { createRoot } from 'react-dom/client';
import Map from './map.js';

function LayerItem(props) {
    return (<div className="layer_item">
        {props.projectName}
        <br />
        City of Davis
    </div>)
}

function Visualize(props) {
    const [mapData, setMapData] = useState(null);
    const [locationData, setLocationData] = useState(null);
    const [savedLayers, setSavedLayers] = useState(null);
    const [savedLayerData, setSavedLayerData] = useState(null);

    function SavedLayers() {
        return (<div id="saved_layers">
            <h2>Saved Layers</h2>
            {savedLayerData && savedLayerData.length > 0 && savedLayerData.map(item => <LayerItem key={item.name} projectName={item.name} />)}
        </div>);
    }

    function getSavedLayers(userId) {
        axios({
            method: 'GET',
            url: '/getLayers?userId=' + userId
        }).then((response) => {
            var savedLayers = [];
            var savedLayerData = [];
            const res = response.data;
            for (let i = 0; i < res.length; i++) {
                const currLayerId = res[i].layerId;
                const currName = res[i].layerName ? res[i].layerName : '';
                savedLayers.push(currLayerId);
                savedLayerData.push({ 'name': currName });
            }
            setSavedLayerData([...savedLayerData]);
            setSavedLayers([...savedLayers]);
        }).catch((error) => {
            if (error.response) {
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
            }
        })
    }

    function getLayerInfo(layerId) {
        console.log('entered function');
        axios({
            method: 'GET',
            url: '/getLayer?layerId=' + layerId
        }).then((response) => {
            const res = response.data;
            console.log('here', res);
            return res;
        }).catch((error) => {
            if (error.response) {
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
            }
            return {};
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
        console.log('lat in visualize', lat, 'long', long);
        setLocationData({ 'lat': lat, 'long': long });
        setMapData([['Lat', 'Long', 'Name'], [lat, long, 'Current Location']]);
    }

    useEffect(() => {
        getLocation();
        getSavedLayers(props.userId);
    }, []);

    return (
        <div className="Visualize">
            <div className="container">
                <h1>Visualize</h1>
                <div id="body">
                    <div id='map' className='flex-item'></div>
                    <SavedLayers className='flex-item' />
                </div>
            </div>
            {locationData && mapData && <Map lat={locationData.lat} long={locationData.long} data={mapData} />}
        </div>
    )
}

export default Visualize;
