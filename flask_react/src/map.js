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
        var data = google.visualization.arrayToDataTable(props.data);
        const center = { lat: props.lat, lng: props.long };

        var map = new google.visualization.Map(document.getElementById('map'), {
            zoom: 4,
            center: center
        });
        map.draw(data, {
            showTooltip: true,
            showInfoWindow: true
        });
    }
}

export default Map;