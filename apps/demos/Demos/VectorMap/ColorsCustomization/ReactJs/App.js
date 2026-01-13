import React from 'react';
import VectorMap, {
  Layer, Tooltip, Border, Font,
} from 'devextreme-react/vector-map';
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { countries } from './data.js';

const bounds = [-180, 85, 180, -60];
const customizeLayer = (elements) => {
  elements.forEach((element) => {
    const name = element.attribute('name');
    const country = countries[name];
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
  const name = target?.attribute('name');
  if (target && countries[name]) {
    target.selected(!target.selected());
  }
};
const customizeTooltip = ({ attribute }) => {
  const name = attribute('name');
  const country = countries[name];
  if (country) {
    return {
      text: `${name}: ${country.totalArea}M km&#178`,
      color: country.color,
    };
  }
  return {};
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
        customize={customizeLayer}
      ></Layer>
      <Tooltip
        enabled={true}
        customizeTooltip={customizeTooltip}
      >
        <Border visible={true}></Border>
        <Font color="#fff"></Font>
      </Tooltip>
    </VectorMap>
  );
}
