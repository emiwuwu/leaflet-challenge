// Create the base layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Earthquake logic here
let earthquakes = L.layerGroup();

// Create a baseMaps object.
let baseMaps = {
    "Street Map": street
};

// Create an overlays object.
let overlays = {
    "Earthquakes": earthquakes
};

// Create a new map.
let map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, earthquakes]
});

// Define a function to get color based on depth
function getColor(depth) {
    if (depth < 10) return "green";
    else if (depth < 30) return "yellow";
    else if (depth < 50) return "orange";
    else if (depth < 70) return "darkorange";
    else if (depth < 90) return "red";
    else return "darkred";
}

// Define the custom marker function
function createCustomMarker(feature, latlng) {
    const depth = feature.geometry.coordinates[2];
    const magnitude = feature.properties.mag;
    const radius = magnitude * 5;

    const markerOptions = {
        radius: radius,
        fillColor: getColor(depth),
        color: 'black',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    const popupContent = `<strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth}`;

    const marker = L.circleMarker(latlng, markerOptions).bindPopup(popupContent);

    return marker;
}

// Perform a GET request to the query URL.
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(queryUrl).then(data => {
    // Create a GeoJSON layer for earthquakes and add it to the earthquakes layer.
    const earthquakeLayer = L.geoJSON(data.features, {
        pointToLayer: createCustomMarker
    });
    earthquakeLayer.addTo(earthquakes);
});

// Create a legend
// Create a legend for earthquake data
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'info legend');
    const depthValues = [-10, 10, 30, 50, 70, 90];
    const colors = ["green", "yellow", "orange", "darkorange", "red", "darkred"];
    const labels = [];

    // Add a color bar
    labels.push('<i style="background: none;"></i> Depth');
    
    for (let i = 0; i < depthValues.length; i++) {
        const from = depthValues[i];
        const to = depthValues[i + 1];
        const color = colors[i];

        labels.push(
            `<li style="background:${color}"></li> ${from} ${to ? `&ndash; ${to}` : '+'}`
        );
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);