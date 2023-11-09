import React from 'react';
import CheckBox, { CheckBoxTypes } from 'devextreme-react/check-box';
import SelectBox, { SelectBoxTypes } from 'devextreme-react/select-box';
import NumberBox, { NumberBoxTypes } from 'devextreme-react/number-box';
import Form, { FormTypes } from 'devextreme-react/form';
import service from './data.ts';

const labelModes = ['outside', 'static', 'floating', 'hidden'];
const labelLocations = ['left', 'top'];
const columnsCount = ['auto', 1, 2, 3];
const minColumnWidths = [150, 200, 300];
const widthLabel = { 'aria-label': 'Width' };
const companyLabel = { 'aria-label': 'Company' };
const labelModeLabel = { 'aria-label': 'Label Mode' };
const labelLocationLabel = { 'aria-label': 'Label Location' };
const columnCountLabel = { 'aria-label': 'Column Count' };
const minCountWidthLabel = { 'aria-label': 'Min Count Width' };

const App = () => {
  const companies = service.getCompanies();
  const [labelMode, setLabelMode] = React.useState<FormTypes.Properties['labelMode']>('floating');
  const [labelLocation, setLabelLocation] = React.useState<FormTypes.Properties['labelLocation']>('left');
  const [readOnly, setReadOnly] = React.useState(false);
  const [showColon, setShowColon] = React.useState(true);
  const [minColWidth, setMinColWidth] = React.useState(300);
  const [colCount, setColCount] = React.useState(2);
  const [company, setCompany] = React.useState(companies[0]);
  const [width, setWidth] = React.useState();

  const onCompanyChanged = React.useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setCompany(e.value);
  }, [setCompany]);

  const onLabelModeChanged = React.useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setLabelMode(e.value);
  }, [setLabelMode]);

  const onLabelLocationChanged = React.useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setLabelLocation(e.value);
  }, [setLabelLocation]);

  const onReadOnlyChanged = React.useCallback((e: CheckBoxTypes.ValueChangedEvent) => {
    setReadOnly(e.value);
  }, [setReadOnly]);

  const onShowColonChanged = React.useCallback((e: CheckBoxTypes.ValueChangedEvent) => {
    setShowColon(e.value);
  }, [setShowColon]);

  const onMinColWidthChanged = React.useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setMinColWidth(e.value);
  }, [setMinColWidth]);

  const onColumnsCountChanged = React.useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setColCount(e.value);
  }, [setColCount]);

  const onFormWidthChanged = React.useCallback((e: NumberBoxTypes.ValueChangedEvent) => {
    setWidth(e.value);
  }, [setWidth]);

  const companySelectorLabelMode: SelectBoxTypes.Properties['labelMode'] = labelMode === 'outside'
    ? 'hidden'
    : labelMode;

  return (
    <div id="form-demo">
      <div className="widget-container">
        {labelMode === 'outside' && (<div>Select company:</div>)}
        <SelectBox
          displayExpr="Name"
          dataSource={companies}
          inputAttr={companyLabel}
          labelMode={companySelectorLabelMode}
          label='Select company'
          value={company}
          onValueChanged={onCompanyChanged}
        />
        <Form
          id="form"
          labelMode={labelMode}
          formData={company}
          readOnly={readOnly}
          showColonAfterLabel={showColon}
          labelLocation={labelLocation}
          minColWidth={minColWidth}
          colCount={colCount}
          width={width}
        />
      </div>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Label mode:</span>
          <SelectBox
            items={labelModes}
            inputAttr={labelModeLabel}
            value={labelMode}
            onValueChanged={onLabelModeChanged}
          />
        </div>
        <div className="option">
          <span>Label location:</span>
          <SelectBox
            items={labelLocations}
            inputAttr={labelLocationLabel}
            value={labelLocation}
            onValueChanged={onLabelLocationChanged}
          />
        </div>
        <div className="option">
          <span>Columns count:</span>
          <SelectBox
            items={columnsCount}
            value={colCount}
            inputAttr={columnCountLabel}
            onValueChanged={onColumnsCountChanged}
          />
        </div>
        <div className="option">
          <span>Min column width:</span>
          <SelectBox
            items={minColumnWidths}
            value={minColWidth}
            inputAttr={minCountWidthLabel}
            onValueChanged={onMinColWidthChanged}
          />
        </div>
        <div className="option">
          <span>Form width:</span>
          <NumberBox
            max={550}
            value={width}
            inputAttr={widthLabel}
            onValueChanged={onFormWidthChanged}
          />
        </div>
        <div className="option">
          <CheckBox
            text="readOnly"
            value={readOnly}
            onValueChanged={onReadOnlyChanged}
          />
        </div>
        <div className="option">
          <CheckBox
            text="showColonAfterLabel"
            value={showColon}
            onValueChanged={onShowColonChanged}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
