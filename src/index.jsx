import React from 'react';
import ReactDOM from 'react-dom';
import { Map } from '@esri/react-arcgis';

ReactDOM.render(
  <Map loaderOptions={{ css: true }} />,
  document.getElementById('root'),
);
