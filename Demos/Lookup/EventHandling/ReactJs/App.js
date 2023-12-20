import React, { useCallback, useState } from 'react';
import { Lookup, DropDownOptions } from 'devextreme-react/lookup';
import { SelectBox } from 'devextreme-react';
import { employees, applyValueModeLabel, lookupLabel } from './data.js';

const applyValueModes = ['instantly', 'useButtons'];
const getDisplayExpr = (item) => (item ? `${item.FirstName} ${item.LastName}` : '');
function App() {
  const [selectedValue, setSelectedValue] = useState(null);
  const [applyValueMode, setApplyValueMode] = useState('instantly');
  const onValueChanged = useCallback(
    (e) => {
      setSelectedValue(e.value);
    },
    [setSelectedValue],
  );
  const changeApplyValueMode = useCallback(
    (e) => {
      setApplyValueMode(e.value);
    },
    [setApplyValueMode],
  );
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
