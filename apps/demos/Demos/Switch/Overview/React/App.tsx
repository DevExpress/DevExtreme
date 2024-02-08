import React, { useCallback, useState } from 'react';
import Switch, { SwitchTypes } from 'devextreme-react/switch';

function App() {
  const [value, setValue] = useState(false);

  const valueChanged = useCallback((e: SwitchTypes.ValueChangedEvent) => {
    setValue(e.value);
  }, []);

  return (
    <div>
      <div className="dx-fieldset">
        <div className="dx-field">
          <div className="dx-field-label">Switched on</div>
          <div className="dx-field-value">
            <Switch defaultValue={true} />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Switched off</div>
          <div className="dx-field-value">
            <Switch defaultValue={false} />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Value change handling</div>
          <div className="dx-field-value">
            <Switch
              value={value}
              onValueChanged={valueChanged}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Disabled</div>
          <div className="dx-field-value">
            <Switch
              value={value}
              disabled={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
