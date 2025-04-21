import React, { useState } from 'react';
import { navigationModes, orientations } from './data.js';
import Steppers from './Steppers.js';
import Options from './Options.js';

export default function App() {
  const [orientation, setOrientation] = useState(orientations[0].value);
  const [navigationMode, setNavigationMode] = useState(navigationModes[0].value);
  const [selectOnFocus, setSelectOnFocus] = useState(true);
  const [rtlMode, setRtlMode] = useState(false);
  const onOrientationClick = (e) => {
    setOrientation(e.itemData.value);
  };
  const onNavigationModeClick = (e) => {
    setNavigationMode(e.itemData.value);
  };
  const onSelectOnFocusChanged = (e) => {
    setSelectOnFocus(e.value);
  };
  const onRtlModeChanged = (e) => {
    setRtlMode(e.value);
  };
  const widgetWrapperOrientationClass = `widget-wrapper-${orientation}`;
  return (
    <div className="stepper-demo">
      <div className="widget-container">
        <div className={`widget-wrapper ${widgetWrapperOrientationClass}`}>
          <Steppers
            orientation={orientation}
            navigationMode={navigationMode}
            selectOnFocus={selectOnFocus}
            rtlMode={rtlMode}
          />
        </div>
      </div>

      <div className="options">
        <Options
          orientation={orientation}
          navigationMode={navigationMode}
          selectOnFocus={selectOnFocus}
          rtlMode={rtlMode}
          onOrientationClick={onOrientationClick}
          onNavigationModeClick={onNavigationModeClick}
          onSelectOnFocusChanged={onSelectOnFocusChanged}
          onRtlModeChanged={onRtlModeChanged}
        />
      </div>
    </div>
  );
}
