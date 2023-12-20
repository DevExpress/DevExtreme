import React, { useCallback, useState } from 'react';
import TextBox from 'devextreme-react/text-box';

const nameLabel = { 'aria-label': 'Name' };
const fullNameLabel = { 'aria-label': 'Full Name' };
const passwordLabel = { 'aria-label': 'Password' };
const maskLabel = { 'aria-label': 'Mask' };
const emailLabel = { 'aria-label': 'Email' };
const rules = { X: /[02-9]/ };
function App() {
  const [emailValue, setEmailValue] = useState('smith@corp.com');
  const valueChanged = useCallback((data) => {
    setEmailValue(`${data.value.replace(/\s/g, '').toLowerCase()}@corp.com`);
  }, []);
  return (
    <div>
      <div className="dx-fieldset">
        <div className="dx-field">
          <div className="dx-field-label">Default mode</div>
          <div className="dx-field-value">
            <TextBox
              defaultValue="John Smith"
              inputAttr={nameLabel}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">With placeholder</div>
          <div className="dx-field-value">
            <TextBox
              placeholder="Enter full name here..."
              inputAttr={fullNameLabel}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">With clear button</div>
          <div className="dx-field-value">
            <TextBox
              defaultValue="John Smith"
              inputAttr={nameLabel}
              showClearButton={true}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Password mode</div>
          <div className="dx-field-value">
            <TextBox
              mode="password"
              inputAttr={passwordLabel}
              placeholder="Enter password"
              showClearButton={true}
              defaultValue="f5lzKs0T"
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Text mask</div>
          <div className="dx-field-value">
            <TextBox
              mask="+1 (X00) 000-0000"
              inputAttr={maskLabel}
              maskRules={rules}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Disabled</div>
          <div className="dx-field-value">
            <TextBox
              defaultValue="John Smith"
              inputAttr={nameLabel}
              disabled={true}
            />
          </div>
        </div>
      </div>
      <div className="dx-fieldset">
        <div className="dx-fieldset-header">Events and API</div>
        <div className="dx-field">
          <div className="dx-field-label">Full Name</div>
          <div className="dx-field-value">
            <TextBox
              defaultValue="Smith"
              inputAttr={fullNameLabel}
              showClearButton={true}
              placeholder="Enter full name"
              valueChangeEvent="keyup"
              onValueChanged={valueChanged}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Email (read only)</div>
          <div className="dx-field-value">
            <TextBox
              readOnly={true}
              inputAttr={emailLabel}
              hoverStateEnabled={false}
              value={emailValue}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
