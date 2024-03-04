import React from 'react';
import VectorMap, {
  ITooltipProps,
  Label,
  Layer,
  Legend,
  Source,
  Tooltip,
} from 'devextreme-react/vector-map';
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { markers } from './data.ts';

const sizeGroups = [0, 8000, 10000, 50000];

const bounds = [-180, 85, 180, -60];

const customizeTooltip: ITooltipProps['customizeTooltip'] = (arg) => {
  if (arg.layer.type === 'marker') {
    return { text: arg.attribute('tooltip') };
  }
  return null;
};

const customizeText = (arg: { index: string | number; }) => ['< 8000K', '8000K to 10000K', '> 10000K'][arg.index];

const customizeItems = (items: any[]) => items.reverse();

export default function App() {
  return (
    <VectorMap id="vector-map" bounds={bounds}>
      <Layer dataSource={mapsData.world} hoverEnabled={false}></Layer>
      <Layer
        dataSource={markers}
        name="bubbles"
        elementType="bubble"
        dataField="value"
        minSize={20}
        maxSize={40}
        sizeGroups={sizeGroups}
        opacity={0.8}
      >
        <Label enabled={false}></Label>
      </Layer>
      <Tooltip enabled={true} customizeTooltip={customizeTooltip}></Tooltip>
      <Legend
        markerShape="circle"
        customizeItems={customizeItems}
        customizeText={customizeText}
      >
        <Source layer="bubbles" grouping="size"></Source>
      </Legend>
      <Tooltip enabled={true} customizeTooltip={customizeTooltip} />
    </VectorMap>
  );
}
