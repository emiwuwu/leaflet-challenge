// Initialize the map and create base layers
function initMap() {
  // Create base layers
  const satellite = L.tileLayer('https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=SrVNfxrBOyXCH5tXK2VC', {
    attribution: 'Map data &copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>'
  });

  const outdoors = L.tileLayer('https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=SrVNfxrBOyXCH5tXK2VC', {
    attribution: 'Map data &copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>'
  });

  const greyscale = L.tileLayer('https://api.maptiler.com/maps/backdrop/{z}/{x}/{y}.png?key=SrVNfxrBOyXCH5tXK2VC', {
    attribution: 'Map data &copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>'
  });

  // Create layer groups for earthquakes and tectonic plates
  let earthquakes = L.layerGroup();
  let plates = L.layerGroup();

  // Create a baseMaps object with available base layers
  const baseMaps = {
    "Satellite": satellite,
    "Greyscale": greyscale,
    "Outdoors": outdoors
  };

  // Create an overlays object for additional layers
  let overlays = {
    "Tectonic Plates": plates,
    "Earthquakes": earthquakes
  };

  // Create a new map with specified options
  let map = L.map("map", {
    center: [
      39.3200, -111.0937 
    ],
    zoom: 5,
    layers: [satellite, greyscale, outdoors, earthquakes, plates]
  });

  // Create a layer control that allows switching between base layers and overlays
  L.control.layers(baseMaps, overlays, {
    collapsed: false
  }).addTo(map);

  return { map, earthquakes, plates };
}

// Initialize the map and get references to map and layers
const { map, earthquakes, plates } = initMap();

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

  // Determine the appropriate color based on depth ranges
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

  // Create a popup with earthquake information
  const popupContent = `<strong>Location:</strong> ${location}<br><strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth}`;

  // Create a circle marker with the specified options and popup
  const marker = L.circleMarker(latlng, markerOptions).bindPopup(popupContent);

  return marker;
}

// Fetch earthquake GeoJSON data and add it to the earthquakes layer
const earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(earthquakeUrl)
  .then(data => {
    // Create a GeoJSON layer for earthquakes and add it to the earthquakes layer group
    const earthquakeLayer = L.geoJSON(data.features, {
      pointToLayer: createCustomMarker
    });
    earthquakeLayer.addTo(earthquakes);
  })
  .catch(error => {
    console.error('Error fetching earthquake data:', error);
  });

// Fetch GeoJSON data from GitHub and add it to the plates layer
const platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";
fetch(platesUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Create a GeoJSON layer for tectonic plates and add it to the "plates" layer.
        const platesLayer = L.geoJSON(data);
        platesLayer.addTo(plates);
    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });

// Create a legend for earthquake data
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'info legend');
  const depthValues = [-10, 10, 30, 50, 70, 90];
  const colors = ["#ffffb2","#fed976", "#feb24c", "#fd8d3c","#f03b20","#bd0026"];
  const labels = [];
  
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

legend.addTo(map);