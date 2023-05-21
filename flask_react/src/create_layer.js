import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";
import './yeti.min.css';
import './create_layer.css';
import Map from './map.js';

function CreateLayer() {
    const [locationData, setLocationData] = useState(null);
    const [mapData, setMapData] = useState(null);
    const [layerId, setLayerId] = useState(null);
    const [layerName, setLayerName] = useState(null);

    function CreateProject() {
        return (<div>
            <h2>Add Project</h2>
            <form>
                <label htmlFor="layerName">Layer Name:</label><br />
                <input type="text" id="layerName" name="layerName" defaultValue={(layerId != undefined) ? layerName : ""} disabled={(layerId != undefined) ? "disabled" : ""} /><br />
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
            setLocationData();
        }
    }

    function showPosition(position) {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        setLocationData({ 'lat': lat, 'long': long });
        setMapData([['Lat', 'Long', 'Name'], [lat, long, 'Current Location']])
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
            data: {
                'layerId': layerId,
                'layerName': layerName,
                'address': address,
                'projectName': projectName,
                'description': description
            }
        }).then((response) => {
            const res = response.data;
            const layerId = res['layerId'];
            const lat = parseFloat(res['lat']);
            const long = parseFloat(res['long']);

            setLayerId(layerId);
            setMapData([...mapData, [lat, long, '']])
            setLayerName(layerName);
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
            {locationData && mapData && <Map lat={locationData.lat} long={locationData.long} data={mapData} />}
        </div>
    )
}

export default CreateLayer;
