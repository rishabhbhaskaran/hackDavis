import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";
import './yeti.min.css';
import './create_layer.css';
import { createRoot } from 'react-dom/client';
import Map from './map.js';

function CreateLayer() {
    const [locationData, setLocationData] = useState(null);
    const [layerId, setLayerId] = useState(null);

    function CreateProject() {
        return (<div>
            <h2>Add Project</h2>
            <form>
                <label htmlFor="layerName">Layer Name:</label><br />
                <input type="text" id="layerName" name="layerName" defaultValue="" /><br />
                <label htmlFor="address">Address:</label><br />
                <input type="text" id="address" name="address" defaultValue="" /><br />
                <label htmlFor="projectName">Project name:</label><br />
                <input type="text" id="projectName" name="projectName" defaultValue="" /><br />
                <label htmlFor="description">Description:</label><br />
                <input type="text" id="description" name="description" defaultValue="" /><br /><br />
                <input type="button" value="Add" onClick={postProject} />
            </form>
        </div>);
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
    }

    function showPosition(position) {
        setLocationData({ 'lat': position.coords.latitude, 'long': position.coords.longitude });
    }

    function postProject() {
        let layerName = document.getElementById('layerName').value;
        let address = document.getElementById('address').value;
        let projectName = document.getElementById('projectName').value;
        let description = document.getElementById('description').value;

        if (layerName == '' || address == '' || projectName == '' || description == '') {
            return;
        }

        axios({
            method: 'POST',
            url: '/createProject',

        }).then((response) => {
            const res = response.data;
            console.log(res);
            const layerId = res['layerId'];
            const lat = res['lat'];
            const long = res['long'];

            setLayerId(layerId);
            setLocationData([...locationData, [lat, long, '']])
            console.log('response', res);
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
        <div className="CreateLayer">
            <div className="container">
                <h1>Create Layer</h1>
                <div id="body">
                    <div id='map' className='flex-item'></div>
                    <CreateProject className='flex-item' />
                </div>
            </div>
            {locationData && <Map lat={locationData.lat} long={locationData.long} data={[['Lat', 'Long', 'Name'], [locationData.lat, locationData.long, 'Current Location']]} />}
        </div>
    )
}

export default CreateLayer;
