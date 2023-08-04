import React from 'react';
import VectorMap, {
  Layer,
  Tooltip,
} from 'devextreme-react/vector-map';

import Button from 'devextreme-react/button';

import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { markers } from './data.js';

const bounds = [-180, 85, 180, -60];

const customizeTooltip = (arg) => {
  if (arg.layer.type === 'marker') {
    return { text: arg.attribute('name') };
  }
  return null;
};

const markerClick = (e) => {
  if (e.target && e.target.layer.type === 'marker') {
    e.component.center(e.target.coordinates()).zoomFactor(10);
  }
};

const App = () => {
  const vectorMapRef = React.useRef(null);

  const reset = React.useCallback(() => {
    vectorMapRef.current.instance.center(null);
    vectorMapRef.current.instance.zoomFactor(null);
  }, [vectorMapRef]);

  return (
    <React.Fragment>
      <VectorMap
        ref={vectorMapRef}
        id="vector-map"
        onClick={markerClick}
        bounds={bounds}
      >
        <Layer dataSource={mapsData.world} hoverEnabled={false} />
        <Layer dataSource={markers} />
        <Tooltip enabled={true} customizeTooltip={customizeTooltip} />
      </VectorMap>
      <Button text="Reset" id="reset" onClick={reset} />
    </React.Fragment>
  );
};

export default App;
