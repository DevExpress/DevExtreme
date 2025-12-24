import React, { useCallback, useState } from 'react';
import { Button } from 'devextreme-react/button';
import { CheckBox } from 'devextreme-react/check-box';
import type { CheckBoxTypes } from 'devextreme-react/check-box';
import { LoadPanel } from 'devextreme-react/load-panel';

import { employee } from './data.ts';
import type { Employee } from './types.ts';

export default function App() {
  const [employeeInfo, setEmployeeInfo] = useState<Employee | null>(null);
  const [loadPanelVisible, setLoadPanelVisible] = useState<boolean>(false);
  const [showIndicator, setShowIndicator] = useState<boolean>(true);
  const [shading, setShading] = useState<boolean>(true);
  const [showPane, setShowPane] = useState<boolean>(true);
  const [hideOnOutsideClick, setHideOnOutsideClick] = useState<boolean>(false);

  const hideLoadPanel = useCallback(() => {
    setLoadPanelVisible(false);
    setEmployeeInfo(employee);
  }, []);

  const onClick = useCallback(() => {
    setEmployeeInfo(null);
    setLoadPanelVisible(true);
    setTimeout(hideLoadPanel, 3000);
  }, [hideLoadPanel]);

  const onShowIndicatorChange = useCallback(({ value }: CheckBoxTypes.ValueChangedEvent): void => {
    setShowIndicator(value);
  }, []);

  const onShadingChange = useCallback(({ value }: CheckBoxTypes.ValueChangedEvent): void => {
    setShading(value);
  }, []);

  const onShowPaneChange = useCallback(({ value }: CheckBoxTypes.ValueChangedEvent): void => {
    setShowPane(value);
  }, []);

  const onHideOnOutsideClickChange = useCallback(({ value }: CheckBoxTypes.ValueChangedEvent): void => {
    setHideOnOutsideClick(value);
  }, []);

  return (
    <>
      <div className="header">John Heart</div>
      &nbsp;
      <Button text="Load Data" onClick={onClick}></Button>

      <div id="employee">
        <p>
          Birth date: <b>{employeeInfo?.Birth_Date}</b>
        </p>

        <p className="address">
          Address:<br />
          <b>{employeeInfo?.City}</b><br />
          <span>{employeeInfo?.Zipcode}</span>
          <span>{employeeInfo?.Address}</span>
        </p>

        <p>
          Phone: <b>{employeeInfo?.Mobile_Phone}</b><br />
          Email: <b>{employeeInfo?.Email}</b>
        </p>
      </div>

      <LoadPanel
        shadingColor="rgba(0, 0, 0, 0.4)"
        position={{ of: '#employee' }}
        onHiding={hideLoadPanel}
        visible={loadPanelVisible}
        showIndicator={showIndicator}
        shading={shading}
        showPane={showPane}
        hideOnOutsideClick={hideOnOutsideClick}
      />

      <div className="options">
        <div className="caption">Options</div>

        <div className="option">
          <CheckBox
            text="With indicator"
            value={showIndicator}
            onValueChanged={onShowIndicatorChange}
          />
        </div>

        <div className="option">
          <CheckBox
            text="With overlay"
            value={shading}
            onValueChanged={onShadingChange}
          />
        </div>

        <div className="option">
          <CheckBox
            text="With pane"
            value={showPane}
            onValueChanged={onShowPaneChange}
          />
        </div>

        <div className="option">
          <CheckBox
            text="Hide on outside click"
            value={hideOnOutsideClick}
            onValueChanged={onHideOnOutsideClickChange}
          />
        </div>
      </div>
    </>
  );
}
