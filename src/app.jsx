import React, { Component } from 'react';
import { Map, loadModules } from '@esri/react-arcgis';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      view: null,
    };
    this.handleMapLoad = this.handleMapLoad.bind(this);
  }

  async handleMapLoad(map, view) {
    const [FeatureLayer] = await loadModules(
      [
        'esri/layers/FeatureLayer',
      ],
    );
    const trailsLayer = new FeatureLayer({
      url: 'https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0'
    });
    map.add(trailsLayer, 0);
    const parksLayer = new FeatureLayer({
      url: 'https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0'
    });
    map.add(parksLayer, 0);
    this.setState({
      map,
      view,
    });
  }

  render() {
    return (
      <div id="map-container">
        <Map
          mapProperties={{
            basemap: 'topo-vector',
          }}
          loaderOptions={{ css: true }}
          onLoad={this.handleMapLoad}
        />
      </div>
    );
  }
}
