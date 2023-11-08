import React from 'react';
import SelectBox from 'devextreme-react/select-box';
import TextBox from 'devextreme-react/text-box';
import DateBox from 'devextreme-react/date-box';
import DateRangeBox from 'devextreme-react/date-range-box';
import TextArea from 'devextreme-react/text-area';
import Button from 'devextreme-react/button';
import Validator, { RequiredRule } from 'devextreme-react/validator';
import notify from 'devextreme/ui/notify';
import {
  states,
  stylingModes,
  labelModes,
  notesLabel,
  birthDateLabel,
  hireDateLabel,
  nameLabel,
  addressLabel,
  phoneLabel,
  stateLabel,
  labelModeLabel,
  stylingModeLabel,
} from './data.js';

const phoneRules = {
  X: /[02-9]/,
};
function validateClick({ validationGroup }) {
  const result = validationGroup.validate();
  if (result.isValid) {
    notify('The task was saved successfully.', 'success');
  } else {
    notify('The task was not saved. Please check if all fields are valid.', 'error');
  }
}
export default function App() {
  const defaultStylingMode = 'outlined';
  const [stylingMode, setStylingMode] = React.useState(defaultStylingMode);
  const [labelMode, setLabelMode] = React.useState('static');
  const changeStylingMode = React.useCallback(
    ({ value }) => {
      setStylingMode(value);
    },
    [setStylingMode],
  );
  const labelModeChange = React.useCallback(
    ({ value }) => {
      setLabelMode(value);
    },
    [setStylingMode],
  );
  return (
    <React.Fragment>
      <div className="options">
        <div className="caption">Options</div>
        <div className="editors-modes">
          <div className="option">
            <SelectBox
              label="Styling Mode"
              labelMode="outside"
              stylingMode={defaultStylingMode}
              items={stylingModes}
              inputAttr={stylingModeLabel}
              value={stylingMode}
              onValueChanged={changeStylingMode}
            />
          </div>
          <div className="option">
            <SelectBox
              label="Label Mode"
              labelMode="outside"
              stylingMode={defaultStylingMode}
              items={labelModes}
              inputAttr={labelModeLabel}
              value={labelMode}
              onValueChanged={labelModeChange}
            />
          </div>
        </div>
      </div>
      <div className="widgets-container">
        <div className="title">Edit Profile</div>
        <TextBox
          id="name"
          stylingMode={stylingMode}
          defaultValue="Olivia Peyton"
          inputAttr={nameLabel}
          placeholder="Type..."
          label="Name"
          labelMode={labelMode}
        >
          <Validator>
            <RequiredRule />
          </Validator>
        </TextBox>
        <TextBox
          id="address"
          stylingMode={stylingMode}
          placeholder="Type..."
          inputAttr={addressLabel}
          label="Address"
          labelMode={labelMode}
        >
          <Validator>
            <RequiredRule />
          </Validator>
        </TextBox>
        <DateBox
          id="hire-date"
          stylingMode={stylingMode}
          placeholder="Select..."
          label="Hire Date"
          inputAttr={hireDateLabel}
          labelMode={labelMode}
        >
          <Validator>
            <RequiredRule />
          </Validator>
        </DateBox>
        <DateBox
          id="birth-date"
          defaultValue="6/3/1981"
          stylingMode={stylingMode}
          placeholder="Birth Date"
          label="Birth Date"
          inputAttr={birthDateLabel}
          labelMode={labelMode}
        >
          <Validator>
            <RequiredRule />
          </Validator>
        </DateBox>
        <SelectBox
          id="state"
          items={states}
          stylingMode={stylingMode}
          inputAttr={stateLabel}
          placeholder="Select..."
          label="State"
          labelMode={labelMode}
          validationMessagePosition="left"
        >
          <Validator>
            <RequiredRule />
          </Validator>
        </SelectBox>
        <TextBox
          id="phone"
          stylingMode={stylingMode}
          mask="+1 (000) 000-0000"
          inputAttr={phoneLabel}
          maskRules={phoneRules}
          label="Phone"
          labelMode={labelMode}
        >
          <Validator>
            <RequiredRule />
          </Validator>
        </TextBox>
        <DateRangeBox
          id="vacation-dates"
          startDate="6/3/2023"
          startDateLabel="Start Vacation Date"
          endDate="12/3/2023"
          endDateLabel="End Vacation Date"
          stylingMode={stylingMode}
          labelMode={labelMode}
        />
        <TextArea
          id="notes"
          stylingMode={stylingMode}
          defaultValue="Olivia loves to sell. She has been selling DevAV products since 2012."
          placeholder="Type..."
          label="Notes"
          labelMode={labelMode}
          inputAttr={notesLabel}
        />
      </div>
      <Button
        onClick={validateClick}
        text="Save"
        icon="save"
        type="default"
        id="validate"
      />
    </React.Fragment>
  );
}
