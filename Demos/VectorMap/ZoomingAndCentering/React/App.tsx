import React, { useCallback, useRef } from 'react';
import VectorMap, {
  ITooltipProps,
  Layer,
  Tooltip,
} from 'devextreme-react/vector-map';

import Button from 'devextreme-react/button';

import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { markers } from './data.ts';

const bounds = [-180, 85, 180, -60];

const customizeTooltip: ITooltipProps['customizeTooltip'] = (arg) => {
  if (arg.layer.type === 'marker') {
    return { text: arg.attribute('name') };
  }
  return null;
};

const markerClick = ({ target, component }) => {
  if (target?.layer.type === 'marker') {
    component.center(target.coordinates()).zoomFactor(10);
  }
};

const App = () => {
  const vectorMapRef = useRef(null);

  const reset = useCallback(() => {
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
