import React from 'react';

import Map from 'devextreme-react/map';
import SelectBox from 'devextreme-react/select-box';

import {
  markersData, routesData, modeLabel, colorLabel,
} from './data.js';

const modes = ['driving', 'walking'];
const routeColors = ['blue', 'green', 'red'];

const apiKey = {
  bing: 'Aq3LKP2BOmzWY47TZoT1YdieypN_rB6RY9FqBfx-MDCKjvvWBbT68R51xwbL-AqC',
};

export default function App() {
  const [routes, setRoutes] = React.useState(routesData);

  const routeModeChange = React.useCallback((value) => {
    setRoutes(routes.map((item) => {
      item.mode = value;
      return item;
    }));
  }, [routes, setRoutes]);

  const routeColorChange = React.useCallback((value) => {
    setRoutes(routes.map((item) => {
      item.color = value;
      return item;
    }));
  }, [routes, setRoutes]);

  return (
    <div>
      <Map
        defaultZoom={14}
        height={440}
        width="100%"
        controls={true}
        markers={markersData}
        routes={routes}
        provider="bing"
        apiKey={apiKey}
      />
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Set mode</span>
          <SelectBox
            defaultValue="driving"
            items={modes}
            inputAttr={modeLabel}
            onValueChange={routeModeChange}
          />
        </div>
        <div className="option">
          <span>Route color</span>
          <SelectBox
            defaultValue="blue"
            inputAttr={colorLabel}
            items={routeColors}
            onValueChange={routeColorChange}
          />
        </div>
      </div>
    </div>
  );
}
