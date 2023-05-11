import React from 'react';

import VectorMap, {
  Label,
  Layer,
  Legend,
  Source,
  Tooltip,
} from 'devextreme-react/vector-map';

import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { markers } from './data.js';

const sizeGroups = [0, 8000, 10000, 50000];

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
        name="bubbles"
        elementType="bubble"
        dataField="value"
        minSize={20}
        maxSize={40}
        sizeGroups={sizeGroups}
        opacity="0.8">
        <Label enabled={false}></Label>
      </Layer>
      <Tooltip enabled={true}
        customizeTooltip={customizeTooltip}
      ></Tooltip>
      <Legend
        markerShape="circle"
        customizeItems={customizeItems}
        customizeText={customizeText}>
        <Source layer="bubbles" grouping="size"></Source>
      </Legend>
      <Tooltip enabled={true}
        customizeTooltip={customizeTooltip} />
    </VectorMap>
  );
}

function customizeTooltip(arg) {
  if (arg.layer.type === 'marker') {
    return { text: arg.attribute('tooltip') };
  }
  return null;
}

function customizeText(arg) {
  return ['< 8000K', '8000K to 10000K', '> 10000K'][arg.index];
}

function customizeItems(items) {
  return items.reverse();
}
