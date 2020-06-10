import React from 'react';

import VectorMap, {
  Layer
} from 'devextreme-react/vector-map';
import TextBox from 'devextreme-react/text-box';
import SelectBox from 'devextreme-react/select-box';
import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';

import { viewportCoordinates } from './data.js';

const bounds = [-180, 85, 180, -60];

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      coordinates: viewportCoordinates[0].coordinates,
      zoomFactor: '1.00',
      center: '0.000, 46.036'
    };

    this.storeMapInstance = (component) =>{
      this.map = component.instance;
    };

    this.continentChanged = ({ value }) => {
      this.setState({
        coordinates: value
      });
      this.map.viewport(value);
    };
    this.zoomFactorChanged = ({ zoomFactor }) => {
      this.setState({
        zoomFactor: zoomFactor.toFixed(2)
      });
    };

    this.centerChanged = ({ center }) => {
      const value = `${center[0].toFixed(3)}, ${center[1].toFixed(3)}`;
      this.setState({
        center: value
      });
    };
  }

  render() {
    return (
      <div>
        <VectorMap
          id="vector-map"
          bounds={bounds}
          ref={this.storeMapInstance}
          onZoomFactorChanged={this.zoomFactorChanged}
          onCenterChanged={this.centerChanged}>
          <Layer dataSource={mapsData.world} />
        </VectorMap>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Continent</span>&nbsp;
            <SelectBox
              dataSource={viewportCoordinates}
              displayExpr="continent"
              valueExpr="coordinates"
              value={this.state.coordinates}
              onValueChanged={this.continentChanged}
            />
          </div>
          <div className="option">
            <span>Zoom factor</span>&nbsp;
            <TextBox
              value={this.state.zoomFactor}
              readOnly={true}
            />
          </div>
          <div className="option">
            <span>Center</span>&nbsp;
            <TextBox
              value={this.state.center}
              readOnly={true}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default App;
