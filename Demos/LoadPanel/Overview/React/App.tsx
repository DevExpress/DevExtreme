import React from 'react';
import { Button } from 'devextreme-react/button';
import { CheckBox, ICheckBoxOptions } from 'devextreme-react/check-box';
import { LoadPanel } from 'devextreme-react/load-panel';
import { employee } from './data.ts';

const position = { of: '#employee' };
const defaultEmployeeInfo: Partial<typeof employee> = {};
export default function App() {
  const [employeeInfo, setEmployeeInfo] = React.useState(defaultEmployeeInfo);
  const [loadPanelVisible, setLoadPanelVisible] = React.useState(false);
  const [showIndicator, setShowIndicator] = React.useState(true);
  const [shading, setShading] = React.useState(true);
  const [showPane, setShowPane] = React.useState(true);
  const [hideOnOutsideClick, setHideOnOutsideClick] = React.useState(false);

  const hideLoadPanel = React.useCallback(() => {
    setLoadPanelVisible(false);
    setEmployeeInfo(employee);
  }, [setLoadPanelVisible, setEmployeeInfo]);

  const onClick = React.useCallback(() => {
    setEmployeeInfo({});
    setLoadPanelVisible(true);
    setTimeout(hideLoadPanel, 3000);
  }, [setEmployeeInfo, setLoadPanelVisible]);

  const onShowIndicatorChange = React.useCallback((e: { value: any; }) => {
    setShowIndicator(e.value);
  }, [setShowIndicator]) as ICheckBoxOptions['onValueChanged'];

  const onShadingChange = React.useCallback((e: { value: any; }) => {
    setShading(e.value);
  }, [setShading]) as ICheckBoxOptions['onValueChanged'];

  const onShowPaneChange = React.useCallback((e: { value: any; }) => {
    setShowPane(e.value);
  }, [setShowPane]) as ICheckBoxOptions['onValueChanged'];

  const onHideOnOutsideClickChange = React.useCallback((e: { value: any; }) => {
    setHideOnOutsideClick(e.value);
  }, [setHideOnOutsideClick]) as ICheckBoxOptions['onValueChanged'];

  return (
    <React.Fragment>
      <div className="header">John Heart</div>
      &nbsp;
      <Button text="Load Data" onClick={onClick}></Button>

      <div id="employee">
        <p>
          Birth date: <b>{employeeInfo.Birth_Date}</b>
        </p>

        <p className="address">
          Address:<br />
          <b>{employeeInfo.City}</b><br />
          <span>{employeeInfo.Zipcode}</span>
          <span>{employeeInfo.Address}</span>
        </p>

        <p>
          Phone: <b>{employeeInfo.Mobile_Phone}</b><br />
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
