import React from 'react';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box';
import DateBox from 'devextreme-react/date-box';
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
} from 'devextreme-react/validator';

import notify from 'devextreme/ui/notify';
import service from './data.js';
import {
  nameLabel, passwordLabel, emailLabel, maskLabel, dateLabel, cityLabel, addressLabel,
} from '../../../Common/EditorsRightToLeftSupport/React/data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    const currentDate = new Date();
    this.maxDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 21));
    this.validatorInstance = null;
    this.countries = service.getCountries();
    this.cityPattern = '^[^0-9]+$';
    this.namePattern = /^[^0-9]+$/;
    this.phonePattern = /^[02-9]\d{9}$/;
    this.phoneRules = {
      X: /[02-9]/,
    };
    this.state = {
      password: '',
      confirmPassword: '',
      passwordMode: 'password',
      confirmPasswordMode: 'password',
    };
    this.passwordButton = {
      icon: '../../../../images/icons/eye.png',
      type: 'default',
      onClick: () => {
        this.setState({
          passwordMode: (this.state.passwordMode === 'text' ? 'password' : 'text'),
        });
      },
    };
    this.confirmPasswordButton = {
      icon: '../../../../images/icons/eye.png',
      type: 'default',
      onClick: () => {
        this.setState({
          confirmPasswordMode: (this.state.confirmPasswordMode === 'text' ? 'password' : 'text'),
        });
      },
    };

    this.passwordComparison = this.passwordComparison.bind(this);
    this.onPasswordChanged = this.onPasswordChanged.bind(this);
    this.onInit = this.onInit.bind(this);
    this.onConfirmPasswordChanged = this.onConfirmPasswordChanged.bind(this);
  }

  render() {
    return (
      <form action="your-action" onSubmit={this.onFormSubmit}>
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
                    validationCallback={asyncValidation} />
                </Validator>
              </TextBox>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Password</div>
            <div className="dx-field-value">
              <TextBox
                mode={this.state.passwordMode}
                value={this.state.password}
                inputAttr={passwordLabel}
                onValueChanged={this.onPasswordChanged}>
                <TextBoxButton
                  name="password"
                  location="after"
                  options={this.passwordButton}
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
                value={this.state.confirmPassword}
                inputAttr={passwordLabel}
                onValueChanged={this.onConfirmPasswordChanged}
                mode={this.state.confirmPasswordMode}>
                <TextBoxButton
                  name="password"
                  location="after"
                  options={this.confirmPasswordButton}
                />
                <Validator onInitialized={this.onInit}>
                  <RequiredRule message="Confirm Password is required" />
                  <CompareRule message="Password and Confirm Password do not match" comparisonTarget={this.passwordComparison} />
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
              <TextBox value="Peter" inputAttr={nameLabel}>
                <Validator>
                  <RequiredRule message="Name is required" />
                  <PatternRule message="Do not use digits in the Name" pattern={this.namePattern} />
                  <StringLengthRule message="Name must have at least 2 symbols" min={2} />
                </Validator>
              </TextBox>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Date of birth</div>
            <div className="dx-field-value">
              <DateBox
                invalidDateMessage="The date must have the following format: MM/dd/yyyy" inputAttr={dateLabel}>
                <Validator>
                  <RequiredRule message="Date of birth is required" />
                  <RangeRule message="You must be at least 21 years old" max={this.maxDate} />
                </Validator>
              </DateBox>
            </div>
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Billing address</div>
          <div className="dx-field">
            <div className="dx-field-label">Country</div>
            <div className="dx-field-value">
              <SelectBox dataSource={this.countries} validationMessagePosition="left">
                <Validator>
                  <RequiredRule message="Country is required" />
                </Validator>
              </SelectBox>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">City</div>
            <div className="dx-field-value">
              <TextBox validationMessagePosition="left" inputAttr={cityLabel}>
                <Validator>
                  <RequiredRule message="City is required" />
                  <PatternRule message="Do not use digits in the City name" pattern={this.cityPattern} />
                  <StringLengthRule message="City must have at least 2 symbols" min={2} />
                </Validator>
              </TextBox>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Address</div>
            <div className="dx-field-value">
              <TextBox validationMessagePosition="left" inputAttr={addressLabel}>
                <Validator>
                  <RequiredRule message="Address is required" />
                </Validator>
              </TextBox>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Phone <i>(optional)</i></div>
            <div className="dx-field-value">
              <TextBox
                mask="+1 (X00) 000-0000"
                inputAttr={maskLabel}
                maskRules={this.phoneRules}
                maskInvalidMessage="The phone must have a correct USA phone format"
                validationMessagePosition="left">
                <Validator>
                  <PatternRule message="The phone must have a correct USA phone format" pattern={this.phonePattern} />
                </Validator>
              </TextBox>
            </div>
          </div>
          <div>
            <CheckBox
              id="check"
              defaultValue={false}
              text="I agree to the Terms and Conditions">
              <Validator>
                <CompareRule message="You must agree to the Terms and Conditions" comparisonTarget={this.checkComparison} />
              </Validator>
            </CheckBox>
          </div>
        </div>

        <div className="dx-fieldset">
          <ValidationSummary id="summary" />
          <Button
            width="100%"
            id="button"
            text="Register"
            type="success"
            useSubmitBehavior={true} />
        </div>
      </form>
    );
  }

  onInit(e) {
    this.validatorInstance = e.component;
  }

  passwordComparison() {
    return this.state.password;
  }

  checkComparison() {
    return true;
  }

  onPasswordChanged(e) {
    this.setState({
      password: e.value,
    });
    if (this.state.confirmPassword) {
      this.validatorInstance.validate();
    }
  }

  onConfirmPasswordChanged(e) {
    this.setState({
      confirmPassword: e.value,
    });
  }

  onFormSubmit(e) {
    notify({
      message: 'You have submitted the form',
      position: {
        my: 'center top',
        at: 'center top',
      },
    }, 'success', 3000);

    e.preventDefault();
  }
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

export default App;
