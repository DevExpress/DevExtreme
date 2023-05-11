import React from 'react';

import VectorMap, {
  Layer,
  Export,
} from 'devextreme-react/vector-map';
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';

import { coordLinesData } from './data.js';

const RADIANS = Math.PI / 180;
const WAGNER_6_P_LAT = Math.PI / Math.sqrt(3);
const WAGNER_6_U_LAT = 2 / Math.sqrt(3) - 0.1;

const customProjection = {
  aspectRatio: 2,
  to(coordinates) {
    const x = coordinates[0] * RADIANS;
    const y = Math.min(Math.max(coordinates[1] * RADIANS, -WAGNER_6_P_LAT), +WAGNER_6_P_LAT);
    const t = y / Math.PI;
    return [
      (x / Math.PI) * Math.sqrt(1 - 3 * t * t),
      (y * 2) / Math.PI,
    ];
  },
  from(coordinates) {
    const x = coordinates[0];
    const y = Math.min(Math.max(coordinates[1], -WAGNER_6_U_LAT), +WAGNER_6_U_LAT);
    const t = y / 2;
    return [
      (x * Math.PI) / Math.sqrt(1 - 3 * t * t) / RADIANS,
      (y * Math.PI) / 2 / RADIANS,
    ];
  },
};

export default function App() {
  return (
    <VectorMap
      id="vector-map"
      projection={customProjection}
      title="Wagner VI projection"
    >
      <Layer
        dataSource={mapsData.world} />
      <Layer
        dataSource={coordLinesData}
        color="#aaa"
        borderWidth={1}
        hoverEanbled={false} />
      <Export enabled={true}></Export>
    </VectorMap>
  );
}
