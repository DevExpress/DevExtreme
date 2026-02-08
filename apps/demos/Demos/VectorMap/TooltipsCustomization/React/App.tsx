import React from 'react';

import VectorMap, {
  Export,
  Label,
  Layer,
  Legend,
  Source,
  Subtitle,
  Title,
  Tooltip,
  Size, ILayerProps, ILegendProps,
} from 'devextreme-react/vector-map';

import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { countriesGDP } from './data.ts';
import TooltipTemplate from './TooltipTemplate.tsx';

const colorGroups = [0, 10000, 50000, 100000, 500000, 1000000, 10000000, 50000000];
const mapBounds = [-180, 85, 180, -60];

const { format } = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
});

const customizeLayer: ILayerProps['customize'] = (elements) => {
  elements.forEach((element) => {
    const countryGDPData = countriesGDP[element.attribute('name')];
    element.attribute('total', (countryGDPData && countryGDPData.total) || 0);
  });
};

const customizeLegendText: ILegendProps['customizeText'] = ({ start, end }) => `${format(start)} to ${format(end)}`;

const App = () => (
  <VectorMap
    id="vector-map"
    bounds={mapBounds}>
    <Size height={700} />
    <Layer
      name="areas"
      dataSource={mapsData.world}
      colorGroups={colorGroups}
      colorGroupingField="total"
      customize={customizeLayer}
      palette="Violet"
    >
      <Label dataField="name" enabled={true} />
    </Layer>

    <Legend customizeText={customizeLegendText}>
      <Source layer="areas" grouping="color" />
    </Legend>

    <Title text="Nominal GDP">
      <Subtitle text="(in millions of US dollars)" />
    </Title>

    <Tooltip enabled={true}
      contentRender={TooltipTemplate} />
    <Export enabled={true} />
  </VectorMap>
);

export default App;
