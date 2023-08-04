import React from 'react';
import { CheckBox } from 'devextreme-react/check-box';

const checkedLabel = { 'aria-label': 'Checked' };
const uncheckedLabel = { 'aria-label': 'Unchecked' };
const indeterminateLabel = { 'aria-label': 'Indeterminate' };
const threeStateModeLabel = { 'aria-label': 'Three state mode' };
const handleValueChangeLabel = { 'aria-label': 'Handle value change' };
const disabledLabel = { 'aria-label': 'Disabled' };
const customSizeLabel = { 'aria-label': 'Custom size' };

function App() {
  const [checkBoxValue, setCheckBoxValue] = React.useState(null);

  const onValueChanged = React.useCallback((args) => {
    setCheckBoxValue(args.value);
  }, []);

  return (
    <div className="form">
      <div className="dx-fieldset">
        <div className="dx-field">
          <div className="dx-field-label">Checked</div>
          <div className="dx-field-value">
            <CheckBox defaultValue={true} elementAttr={checkedLabel} />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Unchecked</div>
          <div className="dx-field-value">
            <CheckBox defaultValue={false} elementAttr={uncheckedLabel} />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Indeterminate</div>
          <div className="dx-field-value">
            <CheckBox defaultValue={null} elementAttr={indeterminateLabel} />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Three state mode</div>
          <div className="dx-field-value">
            <CheckBox
              enableThreeStateBehavior={true}
              defaultValue={null}
              elementAttr={threeStateModeLabel}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Handle value change</div>
          <div className="dx-field-value">
            <CheckBox
              value={checkBoxValue}
              elementAttr={handleValueChangeLabel}
              onValueChanged={onValueChanged}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Disabled</div>
          <div className="dx-field-value">
            <CheckBox
              disabled={true}
              value={checkBoxValue}
              elementAttr={disabledLabel}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Custom size</div>
          <div className="dx-field-value">
            <CheckBox
              defaultValue={null}
              iconSize={30}
              elementAttr={customSizeLabel}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">With label</div>
          <div className="dx-field-value">
            <CheckBox defaultValue={true} text="Label" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
