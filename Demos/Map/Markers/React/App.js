import React from 'react';

import Map from 'devextreme-react/map';
import Button from 'devextreme-react/button';
import CheckBox from 'devextreme-react/check-box';

import { markersData } from './data.js';

const markerUrl = 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/maps/map-marker.png';

const apiKey = {
  bing: 'Aq3LKP2BOmzWY47TZoT1YdieypN_rB6RY9FqBfx-MDCKjvvWBbT68R51xwbL-AqC',
};

export default function App() {
  const [currentMarkersData, setCurrentMarkersData] = React.useState(markersData);
  const [currentMarkerUrl, setCurrentMarkerUrl] = React.useState(markerUrl);

  const onCustomMarkersChange = React.useCallback((value) => {
    setCurrentMarkerUrl(value ? currentMarkerUrl : null);
    setCurrentMarkersData(markersData);
  }, [setCurrentMarkerUrl, setCurrentMarkersData]);

  const showTooltips = React.useCallback(() => {
    setCurrentMarkersData(currentMarkersData.map((item) => {
      const newItem = JSON.parse(JSON.stringify(item));
      newItem.tooltip.isShown = true;
      return newItem;
    }));
  }, [setCurrentMarkersData]);

  return (
    <React.Fragment>
      <Map
        defaultZoom={11}
        height={440}
        width="100%"
        controls={true}
        markerIconSrc={currentMarkerUrl}
        markers={currentMarkersData}
        provider="bing"
        apiKey={apiKey}
      >
      </Map>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <CheckBox
            defaultValue={true}
            text="Use custom marker icons"
            onValueChange={onCustomMarkersChange}
          />
        </div>
        <div className="option">
          <Button
            text="Show all tooltips"
            onClick={showTooltips}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
