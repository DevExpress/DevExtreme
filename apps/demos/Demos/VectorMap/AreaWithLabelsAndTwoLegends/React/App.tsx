import React from 'react';
import VectorMap, {
  ILayerProps,
  ILegendProps,
  ITooltipProps,
  Label,
  Layer,
  Legend,
  Source,
  Tooltip,
} from 'devextreme-react/vector-map';
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { populations, markers } from './data.ts';

const colorGroups = [0, 0.5, 0.8, 1, 2, 3, 100];
const sizeGroups = [0, 8000, 10000, 50000];

const bounds = [-180, 85, 180, -75];

const customizeText = (arg: { index: number; start: any; end: any; }) => {
  if (arg.index === 0) {
    return '< 0.5%';
  } if (arg.index === 5) {
    return '> 3%';
  }
  return `${arg.start}% to ${arg.end}%`;
};

const customizeTooltip: ITooltipProps['customizeTooltip'] = (arg) => ({
  text: arg.attribute('text'),
});

const customizeMarkers: ILegendProps['customizeText'] = (arg) => ['< 8000K', '8000K to 10000K', '> 10000K'][arg.index];

const customizeItems: ILegendProps['customizeItems'] = (items) => items.reverse();

const customizeLayer: ILayerProps['customize'] = (elements) => {
  elements.forEach((element) => {
    const name = element.attribute('name');
    const population = populations[name];
    if (population) {
      element.attribute('population', population);
    }
  });
};

export default function App() {
  return (
    <VectorMap
      id="vector-map" bounds={bounds}>
      <Layer
        dataSource={mapsData.world}
        name="areas"
        palette="Violet"
        colorGroups={colorGroups}
        colorGroupingField="population"
        customize={customizeLayer}>
        <Label enabled={true} dataField="name"></Label>
      </Layer>
      <Layer
        dataSource={markers}
        name="markers"
        elementType="bubble"
        dataField="value"
        sizeGroups={sizeGroups}
        opacity={0.8}>
        <Label enabled={false}></Label>
      </Layer>
      <Legend
        title="World Population<br/>Percentages"
        horizontalAlignment="left"
        verticalAlignment="bottom"
        customizeItems={customizeItems}
        customizeText={customizeText}>
        <Source layer="areas" grouping="color"></Source>
      </Legend>
      <Legend
        title="City Population"
        markerShape="circle"
        horizontalAlignment="right"
        verticalAlignment="bottom"
        customizeItems={customizeItems}
        customizeText={customizeMarkers}>
        <Source layer="markers" grouping="size"></Source>
      </Legend>
      <Tooltip enabled={true}
        customizeTooltip={customizeTooltip} />
    </VectorMap>
  );
}
