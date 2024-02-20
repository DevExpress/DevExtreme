import React, { useCallback, useState } from 'react';
import { Lookup, DropDownOptions, LookupTypes } from 'devextreme-react/lookup';
import { SelectBox } from 'devextreme-react';
import { SelectBoxTypes } from 'devextreme-react/select-box';
import { employees, applyValueModeLabel, lookupLabel } from './data.ts';

const applyValueModes = ['instantly', 'useButtons'];

const getDisplayExpr = (item: { FirstName: string; LastName: string; }) => (item ? `${item.FirstName} ${item.LastName}` : '');

function App() {
  const [selectedValue, setSelectedValue] = useState(null);
  const [applyValueMode, setApplyValueMode] = useState<LookupTypes.ApplyValueMode>('instantly');

  const onValueChanged = useCallback((e: LookupTypes.ValueChangedEvent) => {
    setSelectedValue(e.value);
  }, [setSelectedValue]);

  const changeApplyValueMode = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setApplyValueMode(e.value);
  }, [setApplyValueMode]);

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
