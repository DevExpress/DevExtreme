import React from 'react';

import Map from 'devextreme-react/map';
import SelectBox from 'devextreme-react/select-box';

import { mapTypes } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapTypeValue: mapTypes[0].key
    };
    this.keys = {
      // Specify your API keys for each map provider:
      //bing: "YOUR_BING_MAPS_API_KEY",
      //google: "YOUR_GOOGLE_MAPS_API_KEY",
      //googleStatic: "YOUR_GOOGLE_STATIC_MAPS_API_KEY"
    };
    this.onMapTypeChanged = this.onMapTypeChanged.bind(this);
  }
  onMapTypeChanged(e) {
    this.setState({
      mapTypeValue: e.value
    });
  }

  render() {
    return (
      <div>
        <Map
          defaultCenter={['Brooklyn Bridge', 'New York', 'NY']}
          defaultZoom={14}
          apiKey={this.keys}
          height={400}
          width="100%"
          provider="bing"
          type={this.state.mapTypeValue}>
        </Map>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Map Type</span>&nbsp;
            <SelectBox
              value={this.state.mapTypeValue}
              onValueChanged={this.onMapTypeChanged}
              dataSource={mapTypes}
              displayExpr="name"
              valueExpr="key"
            />
          </div>
        </div>
      </div>
    );
  }
}
export default App;
