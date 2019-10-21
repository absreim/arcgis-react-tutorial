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
    const [FeatureLayer, GraphicsLayer, Graphic] = await loadModules(
      [
        'esri/layers/FeatureLayer',
        'esri/layers/GraphicsLayer',
        'esri/Graphic',
      ],
    );

    // Reference the feature layer to query
    var featureLayer = new FeatureLayer({
      url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0",
    });

    // Layer used to draw graphics returned
    var graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    function addGraphics(result) {
      graphicsLayer.removeAll();
      result.features.forEach(function(feature){
        var g = new Graphic({
          geometry: feature.geometry,
          attributes: feature.attributes,
          symbol: {
           type: "simple-marker",
            color: [0,0,0],
            outline: {
             width: 2,
             color: [0,255,255],
           },
            size: "20px"
          },
          popupTemplate: {
           title: "{TRL_NAME}",
           content: "This a {PARK_NAME} trail located in {CITY_JUR}."
          }
        });
        graphicsLayer.add(g);
      });
    }

    function queryFeatureLayer(point, distance, spatialRelationship, sqlExpression) {
      var query = {
        geometry: point,
        distance: distance,
        spatialRelationship: spatialRelationship,
        outFields: ["*"],
        returnGeometry: true,
        where: sqlExpression
      };
      featureLayer.queryFeatures(query).then(function(result) {
        addGraphics(result, true);
      });
    }

    view.when(function(){
      queryFeatureLayer(view.center, 1500, "intersects");
    });

    view.on("click", function(event){
      queryFeatureLayer(event.mapPoint, 1500, "intersects");
    });

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
          viewProperties={{
            center: [-118.80500, 34.02700],
            zoom: 13,
          }}
          loaderOptions={{ css: true }}
          onLoad={this.handleMapLoad}
        />
      </div>
    );
  }
}
