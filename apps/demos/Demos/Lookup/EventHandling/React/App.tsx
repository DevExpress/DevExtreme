import React, { useCallback, useState } from 'react';
import type { ApplyValueMode } from 'devextreme-react/common';
import { Lookup, DropDownOptions } from 'devextreme-react/lookup';
import type { LookupTypes } from 'devextreme-react/lookup';
import { SelectBox } from 'devextreme-react';
import type { SelectBoxTypes } from 'devextreme-react/select-box';
import { employees, applyValueModeLabel, lookupLabel } from './data.ts';
import type { Employee } from './types.ts';

const applyValueModes: ApplyValueMode[] = ['instantly', 'useButtons'];

const getDisplayExpr = (employee?: Employee): string => (employee ? `${employee.FirstName} ${employee.LastName}` : '');

function App() {
  const [selectedValue, setSelectedValue] = useState<Employee | null>(null);
  const [applyValueMode, setApplyValueMode] = useState<ApplyValueMode>('instantly');

  const onValueChanged = useCallback(({ value }: LookupTypes.ValueChangedEvent): void => {
    setSelectedValue(value);
  }, []);

  const changeApplyValueMode = useCallback(({ value }: SelectBoxTypes.ValueChangedEvent): void => {
    setApplyValueMode(value);
  }, []);

  return (
    <div>
      <div className="dx-fieldset">
        <div className="dx-field">
          <Lookup
            value={selectedValue}
            items={employees}
            displayExpr={getDisplayExpr}
            placeholder="Select employee"
            inputAttr={lookupLabel}
            onValueChanged={onValueChanged}
            applyValueMode={applyValueMode}
          >
            <DropDownOptions showTitle={false} />
          </Lookup>
        </div>
      </div>
      {selectedValue && (
        <div className="selected">
          <div className="frame">
            <img src={selectedValue.Picture} />
          </div>
          <div id="selected-employee-notes">{selectedValue.Notes}</div>
        </div>
      )}

      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <div className="label">Apply Value Mode</div>
          <SelectBox
            items={applyValueModes}
            inputAttr={applyValueModeLabel}
            value={applyValueMode}
            onValueChanged={changeApplyValueMode}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
