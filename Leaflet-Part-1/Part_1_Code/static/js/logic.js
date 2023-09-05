// Initialize the map and create base layers
function initMap() {
  // Create the base layer using OpenStreetMap tiles
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a layer group for earthquakes
  let earthquakes = L.layerGroup();

  // Create a baseMaps object with the street layer
  let baseMaps = {
      "Street Map": street
  };

  // Create an overlays object with the earthquakes layer
  let overlays = {
      "Earthquakes": earthquakes
  };

  // Create a new map with specified options
  let map = L.map("map", {
      center: [
          39.3200, -111.0937 
      ],
      zoom: 5,
      layers: [street, earthquakes]
  });

  // Create a layer control that allows switching between base layers and overlays
  L.control.layers(baseMaps, overlays, {
      collapsed: false
  }).addTo(map);

  return { map, earthquakes };
}

// Initialize the map and get references to the map and earthquakes layer
const { map, earthquakes } = initMap();

// Define a function to get color based on depth
function getColor(depth) {
  // Color mapping based on depth
  const colorMap = {
      bright: "#ffffb2",
      lightyellow: "#fed976",
      orange: "#feb24c",
      darkorange: "#fd8d3c",
      red: "#f03b20",
      darkred: "#bd0026"
  };
  if (depth < 10) return colorMap.bright;
  else if (depth < 30) return colorMap.lightyellow;
  else if (depth < 50) return colorMap.orange;
  else if (depth < 70) return colorMap.darkorange;
  else if (depth < 90) return colorMap.red;
  else return colorMap.darkred;
}

// Define the custom marker function for earthquake data
function createCustomMarker(feature, latlng) {
  const depth = feature.geometry.coordinates[2];
  const magnitude = feature.properties.mag;
  const radius = magnitude * 5;
  const location= feature.properties.place;

  // Define marker options
  const markerOptions = {
      radius: radius,
      fillColor: getColor(depth),
      color: 'black',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
  };

  const popupContent = `<strong>Location:</strong> ${location}<br><strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth}`;

  const marker = L.circleMarker(latlng, markerOptions).bindPopup(popupContent);

  return marker;
}

// Perform a GET request to the query URL to fetch earthquake data
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(queryUrl).then(data => {
  console.log(data);
  // Create a GeoJSON layer for earthquakes and add it to the earthquakes layer group
  const earthquakeLayer = L.geoJSON(data.features, {
      pointToLayer: createCustomMarker
  });
  earthquakeLayer.addTo(earthquakes);
});

// Create a legend for earthquake depth data
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'info legend');
  const depthValues = [-10, 10, 30, 50, 70, 90];
  const colors = ["#ffffb2","#fed976", "#feb24c", "#fd8d3c","#f03b20","#bd0026"];
  const labels = [];

  // Create legend labels with color indicators and depth ranges
  for (let i = 0; i < depthValues.length; i++) {
      const from = depthValues[i];
      const to = depthValues[i + 1];
      const color = colors[i];

      labels.push(
          `<i style="background:${color}"></i>${from} ${to ? `&ndash; ${to}` : '+'}`
      );
  }

  div.innerHTML =  labels.join('<br>');
  return div;
};

// Add the legend to the map
legend.addTo(map);
