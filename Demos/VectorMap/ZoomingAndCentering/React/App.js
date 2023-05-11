import React from 'react';

import VectorMap, {
  Layer,
  Tooltip,
} from 'devextreme-react/vector-map';

import Button from 'devextreme-react/button';

import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { markers } from './data.js';

const bounds = [-180, 85, 180, -60];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.storeVectorMap = (component) => {
      this.vectorMap = component.instance;
    };

    this.reset = () => {
      this.vectorMap.center(null);
      this.vectorMap.zoomFactor(null);
    };
  }

  customizeTooltip(arg) {
    if (arg.layer.type === 'marker') {
      return { text: arg.attribute('name') };
    }
    return null;
  }

  markerClick(e) {
    if (e.target && e.target.layer.type === 'marker') {
      e.component.center(e.target.coordinates()).zoomFactor(10);
    }
  }

  render() {
    return (
      <React.Fragment>
        <VectorMap
          ref={this.storeVectorMap}
          id="vector-map"
          onClick={this.markerClick}
          bounds={bounds}>
          <Layer
            dataSource={mapsData.world}
            hoverEnabled={false}>
          </Layer>
          <Layer
            dataSource={markers}
          />
          <Tooltip enabled={true}
            customizeTooltip={this.customizeTooltip}
          ></Tooltip>
        </VectorMap>
        <Button
          text="Reset"
          id="reset"
          onClick={this.reset}
        ></Button>
      </React.Fragment>
    );
  }
}
export default App;
