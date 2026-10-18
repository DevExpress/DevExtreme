import React, { useMemo } from 'react';
import { ButtonGroup } from 'devextreme-react/button-group';
import { CheckBox } from 'devextreme-react/check-box';
import { navigationModes, orientations } from './data.js';

export default function Options({
  orientation,
  navigationMode,
  selectOnFocus,
  rtlMode,
  onOrientationClick,
  onNavigationModeClick,
  onSelectOnFocusChanged,
  onRtlModeChanged,
}) {
  const selectedOrientation = useMemo(() => [orientation], [orientation]);
  const selectedNavigationMode = useMemo(() => [navigationMode], [navigationMode]);
  return (
    <>
      <div className="caption">Options</div>

      <div className="option">
        <div>Orientation</div>
        <ButtonGroup
          id="orientation"
          keyExpr="value"
          items={orientations}
          selectedItemKeys={selectedOrientation}
          onItemClick={onOrientationClick}
        />
      </div>
      <div className="option">
        <div>Navigation Mode</div>
        <ButtonGroup
          id="navigationMode"
          keyExpr="value"
          items={navigationModes}
          selectedItemKeys={selectedNavigationMode}
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
    </>
  );
}
