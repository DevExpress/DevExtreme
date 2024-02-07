import React, { useCallback, useState } from 'react';
import CheckBox from 'devextreme-react/check-box';
import SelectBox from 'devextreme-react/select-box';
import TextArea from 'devextreme-react/text-area';
import service from './data.js';

const content = service.getContent();
const { valueChangeEvents } = service;
const notesLabel = { 'aria-label': 'Notes' };
const eventLabel = { 'aria-label': 'Event' };
function App() {
  const [value, setValue] = useState(content);
  const [valueForEditableTestArea, setValueForEditableTestArea] = useState(content);
  const [maxLength, setMaxLength] = useState(null);
  const [eventValue, setEventValue] = useState(valueChangeEvents[0].name);
  const [autoResizeEnabled, setAutoResizeEnabled] = useState(false);
  const [height, setHeight] = useState(90);
  const onCheckboxValueChanged = useCallback((e) => {
    const str = content;
    setValue(e.value ? str.substring(0, 100) : str);
    setMaxLength(e.value ? 100 : null);
  }, []);
  const onAutoResizeChanged = useCallback((e) => {
    setAutoResizeEnabled(e.value);
    setHeight(e.value ? undefined : 90);
  }, []);
  const onSelectBoxValueChanged = useCallback((e) => {
    setEventValue(e.value);
  }, []);
  const onTextAreaValueChanged = useCallback((e) => {
    setValueForEditableTestArea(e.value);
  }, []);
  return (
    <React.Fragment>
      <div className="dx-fieldset">
        <div className="dx-fieldset-header">Default Mode</div>
        <div className="dx-field">
          <CheckBox
            defaultValue={false}
            onValueChanged={onCheckboxValueChanged}
            text="Limit text length"
          ></CheckBox>
        </div>
        <div className="dx-field">
          <CheckBox
            value={autoResizeEnabled}
            onValueChanged={onAutoResizeChanged}
            text="Enable auto resize"
          ></CheckBox>
        </div>
      </div>
      <div className="textarea-wrapper">
        <TextArea
          height={height}
          maxLength={maxLength}
          defaultValue={value}
          inputAttr={notesLabel}
          autoResizeEnabled={autoResizeEnabled}
        />
      </div>
      <div className="full-width-content">
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Event Handling and API</div>
          <div className="dx-field">
            <div className="dx-field-label">Synchronize text areas </div>
            <div className="dx-field-value">
              <SelectBox
                items={valueChangeEvents}
                valueExpr="name"
                displayExpr="title"
                inputAttr={eventLabel}
                value={eventValue}
                onValueChanged={onSelectBoxValueChanged}
              />
            </div>
          </div>
        </div>
        <div className="textarea-wrapper">
          <TextArea
            height={90}
            value={valueForEditableTestArea}
            valueChangeEvent={eventValue}
            inputAttr={notesLabel}
            onValueChanged={onTextAreaValueChanged}
          />
          <TextArea
            height={90}
            value={valueForEditableTestArea}
            readOnly={true}
            inputAttr={notesLabel}
            valueChangeEvent={eventValue}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
export default App;
