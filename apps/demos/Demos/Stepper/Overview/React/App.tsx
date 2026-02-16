import React, { useState } from 'react';

import type { ButtonGroupTypes } from 'devextreme-react/button-group';
import type { CheckBoxTypes } from 'devextreme-react/check-box';
import type { Orientation } from 'devextreme-react/common';

import { navigationModes, orientations } from './data.ts';

import Steppers from './Steppers.tsx';
import Options from './Options.tsx';

export default function App() {
  const [orientation, setOrientation] = useState<Orientation>(orientations[0].value);
  const [navigationMode, setNavigationMode] = useState<boolean>(navigationModes[0].value);
  const [selectOnFocus, setSelectOnFocus] = useState<boolean>(true);
  const [rtlMode, setRtlMode] = useState<boolean>(false);

  const onOrientationClick = (e: ButtonGroupTypes.ItemClickEvent): void => {
    setOrientation(e.itemData.value);
  };

  const onNavigationModeClick = (e: ButtonGroupTypes.ItemClickEvent): void => {
    setNavigationMode(e.itemData.value);
  };

  const onSelectOnFocusChanged = (e: CheckBoxTypes.ValueChangedEvent): void => {
    setSelectOnFocus(e.value);
  };

  const onRtlModeChanged = (e: CheckBoxTypes.ValueChangedEvent): void => {
    setRtlMode(e.value);
  };

  const widgetWrapperOrientationClass: string = `widget-wrapper-${orientation}`;

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
