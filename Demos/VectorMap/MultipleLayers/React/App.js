import React from 'react';

import VectorMap, {
  Export,
  Layer,
  Legend,
  Source,
  Font,
} from 'devextreme-react/vector-map';

import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { streamsData } from './data.js';

const colorGroups = [0, 1, 2];
const streamsPalette = ['#3c20c8', '#d82020'];

const bounds = [-180, 85, 180, -75];

export default function App() {
  return (
    <VectorMap
      title="Sea Currents"
      maxZoomFactor={3}
      id="vector-map" bounds={bounds}>
      <Layer
        dataSource={mapsData.world}
        hoverEnabled={false}>
      </Layer>
      <Layer
        dataSource={streamsData}
        name="water"
        colorGroupingField="tag"
        colorGroups={colorGroups}
        palette={streamsPalette}
        borderColor="none"
        hoverEnabled={false}
      >
      </Layer>
      <Legend
        horizontalAlignment="right"
        verticalAlignment= "top"
        customizeText={customizeText}>
        <Source layer="water" grouping="color"></Source>
        <Font size={14} />
      </Legend>
      <Export enabled={true}></Export>
    </VectorMap>
  );
}

function customizeText(itemInfo) {
  if (itemInfo.color === '#3c20c8') {
    return 'Cold';
  }
  return 'Warm';
}
