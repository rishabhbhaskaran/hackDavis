import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";
import './yeti.min.css';
import './view_map.css';
import { useLocation } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import Map from './map.js';

function ViewMap() {
    const [mapData, setMapData] = useState([['Lat', 'Long', 'Name']]);
    const [locationData, setLocationData] = useState(null);
    const [mapInfo, setMapInfo] = useState({});
    const { state } = useLocation();
    const { layerId } = state;
    const [projects, setProjects] = useState([]);

    function ProjectItem(props) {
        return (
            <div class='project-item'>
                <b>{props.name}</b>: {props.description}
                <br />
                {props.address} {props.city}
            </div>);
    }

    function Projects() {
        return (<div id="projects">
            <h2>Projects</h2>
            {projects && projects.length > 0 && projects.map(item => <ProjectItem address={item.address} city={item.city} description={item.description} key={item.name} name={item.name} id={item.id} />)}
        </div>);
    }

    function getLayerInfo(layerId) {
        axios({
            method: 'GET',
            url: '/getLayer?layerId=' + layerId
        }).then((response) => {
            const res = response.data['pins'];
            setMapInfo(response.data);
            setProjects(res);
            console.log('map info', response.data);
            let currPins = [];
            for (let i = 0; i < res.length; i++) {
                let currPin = res[i];
                currPins.push([parseFloat(currPin.lat), parseFloat(currPin.long), currPin.name]);
            }
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
            <h1>View {mapInfo.pins && mapInfo.pins[0].layerName}</h1>
            <div id='map' className='flex-item'></div>
            <Projects />
        </div>
        {locationData && mapData && <Map lat={locationData.lat} long={locationData.long} data={mapData} />}
    </div>);
}

export default ViewMap;