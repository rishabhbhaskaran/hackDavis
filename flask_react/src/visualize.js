import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";
import './yeti.min.css';
import './visualize.css';
import { createRoot } from 'react-dom/client';
import Map from './map.js';

var colors = ['blue', 'green', 'red'];

function Visualize(props) {
    const [mapData, setMapData] = useState(null);
    const [locationData, setLocationData] = useState(null);
    const [savedLayers, setSavedLayers] = useState(null);
    const [savedLayerData, setSavedLayerData] = useState(null);
    const [lastIdx, setLastIdx] = useState(0);

    function LayerItem(props) {
        return (
            <div className={props.clicked ? "layer_item_clicked" : "layer_item"}>
                <div onClick={() => {
                    changeLayerInfo(props.id, !props.clicked)
                }}>
                    <b>{props.name}</b>
                    <br />
                    {props.userId}
                </div>
            </div>
        )
    }

    function SavedLayers() {
        return (<div id="saved_layers">
            <h2>Saved Layers</h2>
            {savedLayerData && savedLayerData.length > 0 && savedLayerData.map(item => <LayerItem key={item.name} name={item.name} userId={item.userId} id={item.id} clicked={item.clicked} />)}
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
                const currUserId = res[i].userId;
                const currName = res[i].layerName ? res[i].layerName : '';
                savedLayers.push(currLayerId);
                savedLayerData.push({ 'name': currName, 'id': currLayerId, 'userId': currUserId, 'clicked': false });
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

    function changeLayerInfo(layerId, clicked) {
        axios({
            method: 'GET',
            url: '/getLayer?layerId=' + layerId
        }).then((response) => {
            const color = colors[lastIdx]; // pick a color
            setLastIdx((lastIdx + 1) % 3);
            console.log(color);
            const res = response.data['pins'];
            const currPins = [];
            for (let i = 0; i < res.length; i++) {
                let currPin = res[i];
                currPins.push([parseFloat(currPin.lat), parseFloat(currPin.long), currPin.name, color]);
            }

            let newSavedLayerData = [];
            for (let i = 0; i < savedLayerData.length; i++) {
                newSavedLayerData.push(savedLayerData[i]);
                if (savedLayerData[i].id == layerId) {
                    newSavedLayerData[i].clicked = !newSavedLayerData[i].clicked;
                }
            }

            setSavedLayerData([...newSavedLayerData]);
            let newMapData;
            if (clicked) {
                newMapData = [...mapData, ...currPins];
            } else {
                newMapData = [];
                for (let i = 0; i < mapData.length; i++) {
                    let flag = false;
                    for (let j = 0; j < currPins.length; j++) {
                        if ((currPins[j][2] == mapData[i][2])) {
                            flag = true;
                        }
                    }
                    if (!flag) {
                        newMapData.push(mapData[i]);
                    }
                }
            }

            setMapData(newMapData);
        }).catch((error) => {
            if (error.response) {
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
            }
        })
    }

    function removeLayerInfo(layerId) {
        let newMapData = [];
        for (let i = 0; i < mapData.length; i++) {
            newSavedLayerData.push(savedLayerData[i]);
            if (savedLayerData[i].id == layerId) {
                newSavedLayerData[i].clicked = !newSavedLayerData[i].clicked;
            }
        }
        setSavedLayerData([...newSavedLayerData]);
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
        setMapData([[lat, long, 'Current Location', 'red']]);
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
