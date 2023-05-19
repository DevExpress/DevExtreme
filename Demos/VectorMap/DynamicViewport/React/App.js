import React from 'react';

import VectorMap, {
  Layer,
  ControlBar,
} from 'devextreme-react/vector-map';
import TextBox from 'devextreme-react/text-box';
import SelectBox from 'devextreme-react/select-box';
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import Switch from 'devextreme-react/switch';
import {
  viewportCoordinates, centerLabel, zoomLabel, continentLabel,
} from './data.js';

const bounds = [-180, 85, 180, -60];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coordinates: viewportCoordinates[0].coordinates,
      zoomFactor: '1.00',
      center: '0.000, 46.036',
      panVisible: true,
      zoomVisible: true,
    };

    this.storeMapInstance = (component) => {
      this.map = component.instance;
    };

    this.continentChanged = ({ value }) => {
      this.setState({
        coordinates: value,
      });
      this.map.viewport(value);
    };
    this.zoomFactorChanged = ({ zoomFactor }) => {
      this.setState({
        zoomFactor: zoomFactor.toFixed(2),
      });
    };
    this.centerChanged = ({ center }) => {
      const value = `${center[0].toFixed(3)}, ${center[1].toFixed(3)}`;
      this.setState({
        center: value,
      });
    };
    this.panVisibleChange = (value) => {
      this.setState({
        panVisible: value,
      });
    };
    this.zoomVisibleChange = (value) => {
      this.setState({
        zoomVisible: value,
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
          <ControlBar zoomVisible={this.state.zoomVisible} panVisible={this.state.panVisible} />
          <Layer dataSource={mapsData.world} />
        </VectorMap>

        <div className="options">
          <div className="caption">Options</div>
          <div className="wrapper-option">
            <div className="column">
              <div className="option">
                <span>Continent</span>
                <SelectBox
                  dataSource={viewportCoordinates}
                  displayExpr="continent"
                  valueExpr="coordinates"
                  inputAttr={continentLabel}
                  value={this.state.coordinates}
                  onValueChanged={this.continentChanged}
                  width={210}
                />
              </div>
              <div className="option">
                <span>Zoom factor</span>
                <TextBox
                  value={this.state.zoomFactor}
                  inputAttr={zoomLabel}
                  readOnly={true}
                  width={210}
                />
              </div>
              <div className="option">
                <span>Center</span>
                <TextBox
                  value={this.state.center}
                  readOnly={true}
                  inputAttr={centerLabel}
                  width={210}
                />
              </div>
            </div>
            <div className="column">
              <div className="option">
                <span>Pan control</span>
                <Switch
                  value={this.state.panVisible}
                  onValueChange={this.panVisibleChange} />
              </div>
              <div className="option">
                <span>Zoom bar</span>
                <Switch
                  value={this.state.zoomVisible}
                  onValueChange={this.zoomVisibleChange} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default App;
