import React from 'react';

import VectorMap, {
  Layer,
  Legend,
  Source,
  Tooltip,
} from 'devextreme-react/vector-map';

import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { names, markers } from './data.js';

const bounds = [-180, 85, 180, -60];

export default function App() {
  return (
    <VectorMap
      id="vector-map" bounds={bounds}>
      <Layer
        dataSource={mapsData.world}
        hoverEnabled={false}>
      </Layer>
      <Layer
        dataSource={markers}
        name="pies"
        elementType="pie"
        dataField="values"
      >
      </Layer>
      <Tooltip enabled={true}
        customizeTooltip={customizeTooltip}
      ></Tooltip>
      <Legend
        customizeText={customizeText}>
        <Source layer="pies" grouping="color"></Source>
      </Legend>
      <Tooltip enabled={true}
        customizeTooltip={customizeTooltip} />
    </VectorMap>
  );
}

function customizeTooltip(arg) {
  if (arg.layer.type === 'marker') {
    return {
      text: arg.attribute('tooltip'),
    };
  }
  return 0;
}

function customizeText(arg) {
  return names[arg.index];
}
