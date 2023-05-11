import React from 'react';

import VectorMap, {
  Label,
  Layer,
  Font,
  LoadingIndicator,
} from 'devextreme-react/vector-map';

import * as mapsData from 'devextreme-dist/js/vectormap-data/usa.js';
import { weatherData } from './data.js';

const bounds = [-118, 52, -80, 20];

export default function App() {
  return (
    <VectorMap
      id="vector-map"
      bounds={bounds}>
      <Layer
        dataSource={mapsData.usa}
        hoverEnabled={false}
        borderColor="#ffffff"
      >
      </Layer>
      <Layer
        dataSource={weatherData}
        type="marker"
        elementType="image"
        dataField="url"
        size={51}>
        <Label dataField="text">
          <Font size={14} />
        </Label>
      </Layer>
      <LoadingIndicator show={true} />
    </VectorMap>
  );
}
