import React, { useCallback, useState } from 'react';
import CheckBox, { type CheckBoxTypes } from 'devextreme-react/check-box';
import SelectBox, { type SelectBoxTypes } from 'devextreme-react/select-box';
import NumberBox, { type NumberBoxTypes } from 'devextreme-react/number-box';
import Form, { type FormTypes } from 'devextreme-react/form';
import { companies } from './data.ts';
import type { Company } from './types.ts';

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
  const [labelMode, setLabelMode] = useState<FormTypes.Properties['labelMode']>('floating');
  const [labelLocation, setLabelLocation] = useState<FormTypes.Properties['labelLocation']>('left');
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const [showColon, setShowColon] = useState<boolean>(true);
  const [minColWidth, setMinColWidth] = useState<number>(300);
  const [colCount, setColCount] = useState<number>(2);
  const [company, setCompany] = useState<Company>(companies[0]);
  const [width, setWidth] = useState<number>();

  const onCompanyChanged = useCallback(({ value }: SelectBoxTypes.ValueChangedEvent): void => {
    setCompany(value);
  }, []);

  const onLabelModeChanged = useCallback(({ value }: SelectBoxTypes.ValueChangedEvent): void => {
    setLabelMode(value);
  }, []);

  const onLabelLocationChanged = useCallback(({ value }: SelectBoxTypes.ValueChangedEvent): void => {
    setLabelLocation(value);
  }, []);

  const onReadOnlyChanged = useCallback(({ value }: CheckBoxTypes.ValueChangedEvent): void => {
    setReadOnly(value);
  }, []);

  const onShowColonChanged = useCallback(({ value }: CheckBoxTypes.ValueChangedEvent): void => {
    setShowColon(value);
  }, []);

  const onMinColWidthChanged = useCallback(({ value }: SelectBoxTypes.ValueChangedEvent): void => {
    setMinColWidth(value);
  }, []);

  const onColumnsCountChanged = useCallback(({ value }: SelectBoxTypes.ValueChangedEvent): void => {
    setColCount(value);
  }, []);

  const onFormWidthChanged = useCallback(({ value }: NumberBoxTypes.ValueChangedEvent): void => {
    setWidth(value);
  }, []);

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
