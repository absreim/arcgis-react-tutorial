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

    var popupTrailheads = {
      "title": "{TRL_NAME}",
      "content": "<b>City:</b> {CITY_JUR}<br><b>Cross Street:</b> {X_STREET}<br><b>Parking:</b> {PARKING}<br><b>Elevation:</b> {ELEV_FT} ft"
    }

    var trailheads = new FeatureLayer({
      url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0",
      outFields: ["TRL_NAME","CITY_JUR","X_STREET","PARKING","ELEV_FT"],
      popupTemplate: popupTrailheads
    });

    map.add(trailheads);

    var popupTrails = {
      "title": "Trail Information",
      "content": function(){
         return "This is {TRL_NAME} with {ELEV_GAIN} ft of climbing.";
      }
    }

    var trails = new FeatureLayer({
      url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails_Styled/FeatureServer/0",
      outFields: ["TRL_NAME","ELEV_GAIN"],
      popupTemplate: popupTrails
    });

    map.add(trails,0);

    var popupOpenspaces = {
      "title": "{PARK_NAME}",
      "content": [{
        "type": "fields",
        "fieldInfos": [
          {
            "fieldName": "AGNCY_NAME",
            "label": "Agency",
            "isEditable": true,
            "tooltip": "",
            "visible": true,
            "format": null,
            "stringFieldOption": "textbox"
          },
          {
            "fieldName": "TYPE",
            "label": "Type",
            "isEditable": true,
            "tooltip": "",
            "visible": true,
            "format": null,
            "stringFieldOption": "textbox"
          },
          {
            "fieldName": "ACCESS_TYP",
            "label": "Access",
            "isEditable": true,
            "tooltip": "",
            "visible": true,
            "format": null,
            "stringFieldOption": "textbox"
          },
          {
            "fieldName": "GIS_ACRES",
            "label": "Acres",
            "isEditable": true,
            "tooltip": "",
            "visible": true,
            "format": {
              "places": 2,
              "digitSeparator": true
            },
            "stringFieldOption": "textbox"
          }
        ]
      }]
    }

    var openspaces = new FeatureLayer({
      url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space_Styled/FeatureServer/0",
      outFields: ["TYPE","PARK_NAME", "AGNCY_NAME","ACCESS_TYP","GIS_ACRES"],
      popupTemplate: popupOpenspaces
    });

    map.add(openspaces,0);

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
