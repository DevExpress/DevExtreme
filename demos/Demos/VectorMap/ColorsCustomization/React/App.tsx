import React from 'react';

import VectorMap, {
  Layer,
  Tooltip,
  Border,
  Font,
  ILayerProps, ITooltipProps,
} from 'devextreme-react/vector-map';

import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { countries } from './data.ts';

const bounds = [-180, 85, 180, -60];

const customizeLayer: ILayerProps['customize'] = (elements) => {
  elements.forEach((element) => {
    const country = countries[element.attribute('name')];
    if (country) {
      element.applySettings({
        color: country.color,
        hoveredColor: '#e0e000',
        selectedColor: '#008f00',
      });
    }
  });
};

const clickHandler = ({ target }) => {
  if (target && countries[target.attribute('name')]) {
    target.selected(!target.selected());
  }
};

const customizeTooltip: ITooltipProps['customizeTooltip'] = ({ attribute }) => {
  const name = attribute('name');
  const country = countries[name];
  if (country) {
    return {
      text: `${name}: ${country.totalArea}M km&#178`,
      color: country.color,
    };
  }
  return null;
};

export default function App() {
  return (
    <VectorMap
      id="vector-map"
      bounds={bounds}
      onClick={clickHandler}
    >
      <Layer
        dataSource={mapsData.world}
        customize={customizeLayer}>
      </Layer>
      <Tooltip enabled={true}
        customizeTooltip={customizeTooltip}
      >
        <Border visible={true}></Border>
        <Font color="#fff"></Font>
      </Tooltip>
    </VectorMap>
  );
}
