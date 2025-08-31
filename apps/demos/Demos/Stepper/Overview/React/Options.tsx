import React from 'react';
import { ButtonGroup, type ButtonGroupTypes } from 'devextreme-react/button-group';
import { CheckBox, type CheckBoxTypes } from 'devextreme-react/check-box';
import { type Orientation } from 'devextreme-react/common';

import { navigationModes, orientations } from './data.ts';

interface OptionsProps {
  orientation: Orientation,
  navigationMode: boolean,
  selectOnFocus: boolean,
  rtlMode: boolean,
  onOrientationClick: (e: ButtonGroupTypes.ItemClickEvent) => void;
  onNavigationModeClick: (e: ButtonGroupTypes.ItemClickEvent) => void;
  onSelectOnFocusChanged: (e: CheckBoxTypes.ValueChangedEvent) => void;
  onRtlModeChanged: (e: CheckBoxTypes.ValueChangedEvent) => void;
}

export default function Options({
  orientation,
  navigationMode,
  selectOnFocus,
  rtlMode,
  onOrientationClick,
  onNavigationModeClick,
  onSelectOnFocusChanged,
  onRtlModeChanged,
}: OptionsProps) {
  return (
    <React.Fragment>
      <div className="caption">Options</div>

      <div className="option">
        <div>Orientation</div>
        <ButtonGroup
          id="orientation"
          keyExpr="value"
          items={orientations}
          selectedItemKeys={[orientation]}
          onItemClick={onOrientationClick}
        />
      </div>
      <div className="option">
        <div>Navigation Mode</div>
        <ButtonGroup
          id="navigationMode"
          keyExpr="value"
          items={navigationModes}
          selectedItemKeys={[navigationMode]}
          onItemClick={onNavigationModeClick}
        />
      </div>
      <div className="option-separator"></div>
      <div className="option">
        <CheckBox
          id="selectOnFocus"
          text="Select step on focus"
          value={selectOnFocus}
          onValueChanged={onSelectOnFocusChanged}
        />
      </div>
      <div className="option">
        <CheckBox
          id="rtlMode"
          text="Right-to-left mode"
          value={rtlMode}
          onValueChanged={onRtlModeChanged}
        />
      </div>
    </React.Fragment>
  );
}
