import React from 'react';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box';
import DateBox from 'devextreme-react/date-box';
import DateRangeBox from 'devextreme-react/date-range-box';
import Button from 'devextreme-react/button';
import ValidationSummary from 'devextreme-react/validation-summary';
import {
  Validator,
  RequiredRule,
  CompareRule,
  EmailRule,
  PatternRule,
  StringLengthRule,
  RangeRule,
  AsyncRule,
  CustomRule,
} from 'devextreme-react/validator';
import notify from 'devextreme/ui/notify';
import {
  countries,
  nameLabel,
  passwordLabel,
  emailLabel,
  maskLabel,
  dateLabel,
  cityLabel,
  addressLabel,
  countryLabel,
} from './data.js';

const cityPattern = '^[^0-9]+$';
const namePattern = /^[^0-9]+$/;
const phonePattern = /^[02-9]\d{9}$/;
const phoneRules = {
  X: /[02-9]/,
};
const checkComparison = () => true;
const onFormSubmit = (e) => {
  notify(
    {
      message: 'You have submitted the form',
      position: {
        my: 'center top',
        at: 'center top',
      },
    },
    'success',
    3000,
  );
  e.preventDefault();
};
function App() {
  const currentDate = new Date();
  const maxDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 21));
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordMode, setPasswordMode] = React.useState('password');
  const [confirmPasswordMode, setConfirmPasswordMode] = React.useState('password');
  const validatorRef = React.useRef(null);
  const passwordButton = React.useMemo(
    () => ({
      icon: 'eyeopen',
      stylingMode: 'text',
      onClick: () => {
        setPasswordMode(passwordMode === 'text' ? 'password' : 'text');
      },
    }),
    [passwordMode, setPasswordMode],
  );
  const confirmPasswordButton = React.useMemo(
    () => ({
      icon: 'eyeopen',
      stylingMode: 'text',
      onClick: () => {
        setConfirmPasswordMode(confirmPasswordMode === 'text' ? 'password' : 'text');
      },
    }),
    [confirmPasswordMode, setConfirmPasswordMode],
  );
  const passwordComparison = React.useCallback(() => password, [password]);
  const onPasswordChanged = React.useCallback(
    (e) => {
      setPassword(e.value);
      if (confirmPassword) {
        validatorRef.current.instance.validate();
      }
    },
    [confirmPassword, setPassword],
  );
  const onConfirmPasswordChanged = React.useCallback((e) => {
    setConfirmPassword(e.value);
  }, []);
  return (
    <form
      action="your-action"
      onSubmit={onFormSubmit}
    >
      <div className="dx-fieldset">
        <div className="dx-fieldset-header">Credentials</div>
        <div className="dx-field">
          <div className="dx-field-label">Email</div>
          <div className="dx-field-value">
            <TextBox inputAttr={emailLabel}>
              <Validator>
                <RequiredRule message="Email is required" />
                <EmailRule message="Email is invalid" />
                <AsyncRule
                  message="Email is already registered"
                  validationCallback={asyncValidation}
                />
              </Validator>
            </TextBox>
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Password</div>
          <div className="dx-field-value">
            <TextBox
              mode={passwordMode}
              value={password}
              inputAttr={passwordLabel}
              onValueChanged={onPasswordChanged}
            >
              <TextBoxButton
                name="password"
                location="after"
                options={passwordButton}
              />
              <Validator>
                <RequiredRule message="Password is required" />
              </Validator>
            </TextBox>
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Confirm Password</div>
          <div className="dx-field-value">
            <TextBox
              value={confirmPassword}
              inputAttr={passwordLabel}
              onValueChanged={onConfirmPasswordChanged}
              mode={confirmPasswordMode}
            >
              <TextBoxButton
                name="password"
                location="after"
                options={confirmPasswordButton}
              />
              <Validator ref={validatorRef}>
                <RequiredRule message="Confirm Password is required" />
                <CompareRule
                  message="Password and Confirm Password do not match"
                  comparisonTarget={passwordComparison}
                />
              </Validator>
            </TextBox>
          </div>
        </div>
      </div>
      <div className="dx-fieldset">
        <div className="dx-fieldset-header">Personal Data</div>
        <div className="dx-field">
          <div className="dx-field-label">Name</div>
          <div className="dx-field-value">
            <TextBox
              value="Peter"
              inputAttr={nameLabel}
            >
              <Validator>
                <RequiredRule message="Name is required" />
                <PatternRule
                  message="Do not use digits in the Name"
                  pattern={namePattern}
                />
                <StringLengthRule
                  message="Name must have at least 2 symbols"
                  min={2}
                />
              </Validator>
            </TextBox>
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Date of birth</div>
          <div className="dx-field-value">
            <DateBox
              invalidDateMessage="The date must have the following format: MM/dd/yyyy"
              inputAttr={dateLabel}
            >
              <Validator>
                <RequiredRule message="Date of birth is required" />
                <RangeRule
                  message="You must be at least 21 years old"
                  max={maxDate}
                />
              </Validator>
            </DateBox>
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Vacation Dates</div>
          <div className="dx-field-value">
            <DateRangeBox>
              <Validator>
                <CustomRule
                  message="The vacation period must not exceed 25 days"
                  validationCallback={validateVacationDatesRange}
                />
                <CustomRule
                  message="Both start and end dates must be selected"
                  validationCallback={validateVacationDatesPresence}
                />
              </Validator>
            </DateRangeBox>
          </div>
        </div>
      </div>
      <div className="dx-fieldset">
        <div className="dx-fieldset-header">Billing address</div>
        <div className="dx-field">
          <div className="dx-field-label">Country</div>
          <div className="dx-field-value">
            <SelectBox
              dataSource={countries}
              validationMessagePosition="left"
              inputAttr={countryLabel}
            >
              <Validator>
                <RequiredRule message="Country is required" />
              </Validator>
            </SelectBox>
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">City</div>
          <div className="dx-field-value">
            <TextBox
              validationMessagePosition="left"
              inputAttr={cityLabel}
            >
              <Validator>
                <RequiredRule message="City is required" />
                <PatternRule
                  message="Do not use digits in the City name"
                  pattern={cityPattern}
                />
                <StringLengthRule
                  message="City must have at least 2 symbols"
                  min={2}
                />
              </Validator>
            </TextBox>
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Address</div>
          <div className="dx-field-value">
            <TextBox
              validationMessagePosition="left"
              inputAttr={addressLabel}
            >
              <Validator>
                <RequiredRule message="Address is required" />
              </Validator>
            </TextBox>
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">
            Phone <i>(optional)</i>
          </div>
          <div className="dx-field-value">
            <TextBox
              mask="+1 (X00) 000-0000"
              inputAttr={maskLabel}
              maskRules={phoneRules}
              maskInvalidMessage="The phone must have a correct USA phone format"
              validationMessagePosition="left"
            >
              <Validator>
                <PatternRule
                  message="The phone must have a correct USA phone format"
                  pattern={phonePattern}
                />
              </Validator>
            </TextBox>
          </div>
        </div>
      </div>

      <div className="dx-fieldset">
        <div className="dx-field">
          <div className="dx-field-label">
            <CheckBox
              id="check"
              defaultValue={false}
              text="I agree to the Terms and Conditions"
              validationMessagePosition="right"
            >
              <Validator>
                <CompareRule
                  message="You must agree to the Terms and Conditions"
                  comparisonTarget={checkComparison}
                />
              </Validator>
            </CheckBox>
          </div>
          <div className="dx-field-value">
            <Button
              width="120px"
              id="button"
              text="Register"
              type="default"
              useSubmitBehavior={true}
            />
          </div>
        </div>
        <ValidationSummary id="summary" />
      </div>
    </form>
  );
}
function sendRequest(value) {
  const invalidEmail = 'test@dx-email.com';
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value !== invalidEmail);
    }, 1000);
  });
}
function asyncValidation(params) {
  return sendRequest(params.value);
}
function validateVacationDatesRange({ value }) {
  const [startDate, endDate] = value;
  if (startDate === null || endDate === null) {
    return true;
  }
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const daysDifference = Math.abs((endDate - startDate) / millisecondsPerDay);
  return daysDifference < 25;
}
function validateVacationDatesPresence({ value }) {
  const [startDate, endDate] = value;
  if (startDate === null && endDate === null) {
    return true;
  }
  return startDate !== null && endDate !== null;
}
export default App;
