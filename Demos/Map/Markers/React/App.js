import React from 'react';

import Map from 'devextreme-react/map';
import Button from 'devextreme-react/button';
import CheckBox from 'devextreme-react/check-box';

import { markersData } from './data.js';

const markerUrl = 'https://js.devexpress.com/Demos/RealtorApp/images/map-marker.png';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.originMarkersData = markersData;
    this.state = {
      markerUrl: markerUrl,
      markersData: markersData
    };
    this.useCustomMarkers = this.useCustomMarkers.bind(this);
    this.showTooltips = this.showTooltips.bind(this);
  }
  useCustomMarkers(e) {
    this.setState({
      markerUrl: e.value ? markerUrl : null,
      markersData: this.originMarkersData
    });
  }
  showTooltips() {
    this.setState({
      markersData: this.state.markersData.map(function(item) {
        let newItem = JSON.parse(JSON.stringify(item));
        newItem.tooltip.isShown = true;
        return newItem;
      })
    });
  }

  render() {
    return (
      <div>
        <Map
          defaultCenter={['Brooklyn Bridge', 'New York', 'NY']}
          defaultZoom={11}
          height={440}
          width="100%"
          controls={true}
          markerIconSrc={this.state.markerUrl}
          markers={this.state.markersData}
          provider="bing">
        </Map>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <CheckBox
              defaultValue={true}
              text="Use custom marker icons"
              onValueChanged={this.useCustomMarkers}
            />
          </div>
          <div className="option">
            <Button
              text="Show all tooltips"
              onClick={this.showTooltips}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default App;
