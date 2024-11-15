import React, { useCallback, useState } from 'react';
import Map from 'devextreme-react/map';
import Button from 'devextreme-react/button';
import CheckBox from 'devextreme-react/check-box';
import { markersData } from './data.ts';

const markerUrl = 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/maps/map-marker.png';

const apiKey = {
  azure: '6N8zuPkBsnfwniNAJkldM3cUgm3lXg3y9gkIKy59benICnnepK4DJQQJ99AIACYeBjFllM6LAAAgAZMPGFXE',
};

const App = () => {
  const [currentMarkersData, setCurrentMarkersData] = useState(markersData);
  const [currentMarkerUrl, setCurrentMarkerUrl] = useState(markerUrl);

  const onCustomMarkersChange = useCallback((value) => {
    setCurrentMarkerUrl(value ? currentMarkerUrl : null);
    setCurrentMarkersData(markersData);
  }, [currentMarkerUrl, setCurrentMarkerUrl, setCurrentMarkersData]);

  const showTooltips = useCallback(() => {
    setCurrentMarkersData(currentMarkersData.map((item) => {
      const newItem = JSON.parse(JSON.stringify(item));
      newItem.tooltip.isShown = true;
      return newItem;
    }));
  }, [currentMarkersData, setCurrentMarkersData]);

  return (
    <React.Fragment>
      <Map
        defaultZoom={11}
        height={440}
        width="100%"
        controls={true}
        markerIconSrc={currentMarkerUrl}
        markers={currentMarkersData}
        provider="azure"
        apiKey={apiKey}
      ></Map>
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
};

export default App;
