import React, { useCallback, useState } from 'react';
import { Button } from 'devextreme-react/button';
import { CheckBox } from 'devextreme-react/check-box';
import { LoadPanel } from 'devextreme-react/load-panel';
import { employee } from './data.js';

const position = { of: '#employee' };
const defaultEmployeeInfo = {};
export default function App() {
  const [employeeInfo, setEmployeeInfo] = useState(defaultEmployeeInfo);
  const [loadPanelVisible, setLoadPanelVisible] = useState(false);
  const [showIndicator, setShowIndicator] = useState(true);
  const [shading, setShading] = useState(true);
  const [showPane, setShowPane] = useState(true);
  const [hideOnOutsideClick, setHideOnOutsideClick] = useState(false);
  const hideLoadPanel = useCallback(() => {
    setLoadPanelVisible(false);
    setEmployeeInfo(employee);
  }, [setLoadPanelVisible, setEmployeeInfo]);
  const onClick = useCallback(() => {
    setEmployeeInfo({});
    setLoadPanelVisible(true);
    setTimeout(hideLoadPanel, 3000);
  }, [setEmployeeInfo, setLoadPanelVisible]);
  const onShowIndicatorChange = useCallback(
    (e) => {
      setShowIndicator(e.value);
    },
    [setShowIndicator],
  );
  const onShadingChange = useCallback(
    (e) => {
      setShading(e.value);
    },
    [setShading],
  );
  const onShowPaneChange = useCallback(
    (e) => {
      setShowPane(e.value);
    },
    [setShowPane],
  );
  const onHideOnOutsideClickChange = useCallback(
    (e) => {
      setHideOnOutsideClick(e.value);
    },
    [setHideOnOutsideClick],
  );
  return (
    <React.Fragment>
      <div className="header">John Heart</div>
      &nbsp;
      <Button
        text="Load Data"
        onClick={onClick}
      ></Button>
      <div id="employee">
        <p>
          Birth date: <b>{employeeInfo.Birth_Date}</b>
        </p>

        <p className="address">
          Address:
          <br />
          <b>{employeeInfo.City}</b>
          <br />
          <span>{employeeInfo.Zipcode}</span>
          <span>{employeeInfo.Address}</span>
        </p>

        <p>
          Phone: <b>{employeeInfo.Mobile_Phone}</b>
          <br />
          Email: <b>{employeeInfo.Email}</b>
        </p>
      </div>
      <LoadPanel
        shadingColor="rgba(0,0,0,0.4)"
        position={position}
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
    </React.Fragment>
  );
}
