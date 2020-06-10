import React from 'react';

import Map from 'devextreme-react/map';
import SelectBox from 'devextreme-react/select-box';

import { markersData, routesData } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: routesData
    };
    this.updateRouteMode = this.updateRouteMode.bind(this);
    this.updateRouteColor = this.updateRouteColor.bind(this);
  }

  render() {
    return (
      <div>
        <Map
          defaultCenter='Brooklyn Bridge,New York,NY'
          defaultZoom={14}
          height={440}
          width="100%"
          controls={true}
          markers={markersData}
          routes={this.state.routes}
          provider="bing"
        />
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Set mode</span>&nbsp;
            <SelectBox
              defaultValue="driving"
              items={['driving', 'walking']}
              onValueChanged={this.updateRouteMode}
            />
          </div>
          <div className="option">
            <span>Route color</span>&nbsp;
            <SelectBox
              defaultValue="blue"
              items={['blue', 'green', 'red']}
              onValueChanged={this.updateRouteColor}
            />
          </div>
        </div>
      </div>
    );
  }

  updateRouteMode(e) {
    this.setState({
      routes: this.state.routes.map((item) => {
        item.mode = e.value;
        return item;
      })
    });
  }

  updateRouteColor(e) {
    this.setState({
      routes: this.state.routes.map((item) => {
        item.color = e.value;
        return item;
      })
    });
  }
}
export default App;
