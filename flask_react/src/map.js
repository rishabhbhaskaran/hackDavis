import React from 'react';
import { useState } from 'react';

function Map(props) {
    google.charts.load("current", {
        "packages": ["map"],
        "mapsApiKey": "AIzaSyAff20p5rRI2GyCoGT22sQ3NH_R513kjrU"
        // "mapsApiKey": "AIzaSyCq31WS6iguw04oT8IrpnpSN7DekJgNF6I"
    });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        const center = { lat: props.lat, lng: props.long };
        var styledMap = {
            name: 'Styled Map',
            styles: [
                {
                    featureType: 'poi.attraction',
                    stylers: [{ color: '#fce8b2' }]
                },
                {
                    featureType: 'road.highway',
                    stylers: [{ hue: '#0277bd' }, { saturation: -50 }]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'labels.icon',
                    stylers: [{ hue: '#000' }, { saturation: 100 }, { lightness: 50 }]
                },
                {
                    featureType: 'landscape',
                    stylers: [{ hue: '#259b24' }, { saturation: 10 }, { lightness: -22 }]
                }
            ]
        };

        var map = new google.visualization.Map(document.getElementById('map'), {
            zoom: 7,
            center: center,
            mapType: styledMap
            // mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        console.log('data', props.data.length);
        // if (props.data.length > 1) {
        var data = google.visualization.arrayToDataTable(props.data);
        map.draw(data, {
            showTooltip: true,
            showInfoWindow: true
        });
        // }
    }
}

export default Map;