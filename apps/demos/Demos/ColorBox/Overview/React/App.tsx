import React, { useCallback, useState } from 'react';
import ColorBox, { ColorBoxTypes } from 'devextreme-react/color-box';

const defaultModeLabel = { 'aria-label': 'Default mode' };
const alphaChannelLabel = { 'aria-label': 'With alpha channel editing' };
const customButtonCaptionsLabel = { 'aria-label': 'Custom button captions' };
const readOnlyLabel = { 'aria-label': 'Read only' };
const disabledLabel = { 'aria-label': 'Disabled' };
const eventHandlingLabel = { 'aria-label': 'Event Handling' };

function App() {
  const [color, setColor] = useState('#f05b41');

  const handleColorChange = useCallback(({ value }: ColorBoxTypes.ValueChangedEvent) => {
    setColor(value);
  }, []);

  return (
    <div className="form">
      <div className="dx-fieldset">
        <div className="dx-field">
          <div className="dx-field-label">Default mode</div>
          <div className="dx-field-value">
            <ColorBox
              defaultValue="#f05b41"
              inputAttr={defaultModeLabel}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">With alpha channel editing</div>
          <div className="dx-field-value">
            <ColorBox
              defaultValue="#f05b41"
              editAlphaChannel
              inputAttr={alphaChannelLabel}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Custom button captions</div>
          <div className="dx-field-value">
            <ColorBox
              defaultValue="#f05b41"
              applyButtonText="Apply"
              cancelButtonText="Decline"
              inputAttr={customButtonCaptionsLabel}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Read only</div>
          <div className="dx-field-value">
            <ColorBox
              defaultValue="#f05b41"
              readOnly={true}
              inputAttr={readOnlyLabel}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Disabled</div>
          <div className="dx-field-value">
            <ColorBox
              defaultValue="#f05b41"
              disabled={true}
              inputAttr={disabledLabel}
            />
          </div>
        </div>
      </div>
      <div className="dx-fieldset">
        <div className="dx-fieldset-header">Event Handling</div>
        <div className="hero-block">
          <div
            className="color-block"
            style={{ backgroundColor: color }}
          >
            <div className="superhero"></div>
          </div>
          <div className="hero-color-box">
            <ColorBox
              value={color}
              applyValueMode="instantly"
              inputAttr={eventHandlingLabel}
              onValueChanged={handleColorChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
