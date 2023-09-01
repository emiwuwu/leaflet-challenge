# Part 1: Earthquake Visualization with Leaflet

This project visualizes earthquake data provided by the USGS (United States Geological Survey) using the Leaflet JavaScript library. The data is updated every 5 minutes and is available in GeoJSON format.

## Getting the Dataset

Retrieve earthquake data for visualization by selecting the "All Earthquakes from the Past 7 Days" dataset from the [USGS GeoJSON Feed](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) and utilizing the provided JSON URL.

## Visualizing the Data

To visualize the earthquake data, we use Leaflet to create an interactive map with the following features:

- The map plots all earthquakes based on their longitude and latitude coordinates.
- Data markers represent the magnitude of each earthquake. Higher magnitude earthquakes appear larger.
- The color of the data markers reflects the depth of the earthquake. Deeper earthquakes appear darker in color.
- Popups provide additional information about each earthquake. Clicking on a marker displays the earthquake's details.
- A legend is included to provide context for the map data, indicating the relationship between marker size and earthquake magnitude, as well as the color code for earthquake depth.

## Dependencies

This project relies on the following dependencies:

- Leaflet: A JavaScript library for interactive maps.
- D3.js: A JavaScript library for data visualization.


# Part 2: Earthquake and Tectonic Plates Visualization with Leaflet

This project visualizes earthquake data provided by the USGS (United States Geological Survey) using the Leaflet JavaScript library. It also displays tectonic plate boundaries data.

## Features

1. **Interactive Map**: The project includes an interactive map that displays both earthquake data and tectonic plate boundaries.

2. **Multiple Base Maps**: You can choose from several base maps to customize your viewing experience. The available base maps include:
   - Satellite Imagery
   - Grayscale Map
   - Outdoors Map

3. **Layer Controls**: Layer controls are provided, allowing you to toggle between earthquake data and tectonic plate boundaries. You can turn each dataset on and off independently to focus on specific information.

4. **Earthquake Visualization**:
   - Earthquake data is plotted on the map based on their longitude and latitude coordinates.
   - Data markers represent the magnitude of each earthquake. Higher magnitude earthquakes appear larger.
   - The color of the data markers reflects the depth of the earthquake. Deeper earthquakes appear darker in color.
   - Clicking on a marker displays a popup with detailed information about the earthquake.

5. **Tectonic Plate Boundaries**:
   - Tectonic plate boundaries are displayed on the map, providing context for seismic activity.
   - The plate boundaries dataset is included as a separate overlay and can be turned on and off independently.

## Getting the Dataset

- Retrieve earthquake data for visualization by selecting the "All Earthquakes from the Past 7 Days" dataset from the [USGS GeoJSON Feed](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) and utilizing the provided JSON URL.

- The tectonic plate boundaries dataset is available online, and a sample URL is provided in the project code.

## Dependencies

This project relies on the following dependencies:

- Leaflet: A JavaScript library for interactive maps.
- D3.js: A JavaScript library for data visualization.
