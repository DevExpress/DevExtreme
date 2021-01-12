import React from 'react';
import Form, {
  ButtonItem,
  GroupItem,
  SimpleItem,
  Label,
  CompareRule,
  EmailRule,
  PatternRule,
  RangeRule,
  RequiredRule,
  StringLengthRule,
  AsyncRule
} from 'devextreme-react/form';
import notify from 'devextreme/ui/notify';
import 'devextreme-react/autocomplete';
import service from './data.js';

class App extends React.Component {
  constructor() {
    super();
    this.buttonOptions = {
      text: 'Register',
      type: 'success',
      useSubmitBehavior: true
    };
    this.checkBoxOptions = {
      text: 'I agree to the Terms and Conditions',
      value: false
    };
    this.cityEditorOptions = {
      dataSource: service.getCities(),
      minSearchLength: 2
    };
    this.countryEditorOptions = {
      dataSource: service.getCountries()
    };
    this.passwordOptions = {
      mode: 'password'
    };
    this.phoneEditorOptions = {
      mask: '+1 (X00) 000-0000',
      maskRules: {
        X: /[02-9]/
      },
      useMaskedValue: true,
      maskInvalidMessage: 'The phone must have a correct USA phone format'
    };
    this.maxDate = new Date().setFullYear(new Date().getFullYear() - 21);
    this.dateBoxOptions = {
      invalidDateMessage:
        'The date must have the following format: MM/dd/yyyy'
    };
    this.state = {
      customer: service.getCustomer()
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.passwordComparison = this.passwordComparison.bind(this);
  }

  render() {
    const {
      customer
    } = this.state;
    return (
      <React.Fragment>
        <form action="your-action" onSubmit={this.handleSubmit}>
          <Form
            formData={customer}
            readOnly={false}
            showColonAfterLabel={true}
            showValidationSummary={true}
            validationGroup="customerData"
          >
            <GroupItem caption="Credentials">
              <SimpleItem dataField="Email" editorType="dxTextBox">
                <RequiredRule message="Email is required" />
                <EmailRule message="Email is invalid" />
                <AsyncRule
                  message="Email is already registered"
                  validationCallback={asyncValidation} />
              </SimpleItem>
              <SimpleItem dataField="Password" editorType="dxTextBox" editorOptions={this.passwordOptions}>
                <RequiredRule message="Password is required" />
              </SimpleItem>
              <SimpleItem editorType="dxTextBox" editorOptions={this.passwordOptions}>
                <Label text="Confirm Password" />
                <RequiredRule message="Confirm Password is required" />
                <CompareRule
                  message="Password and Confirm Password do not match"
                  comparisonTarget={this.passwordComparison}
                />
              </SimpleItem>
            </GroupItem>
            <GroupItem caption="Personal Data">
              <SimpleItem dataField="Name">
                <RequiredRule message="Name is required" />
                <PatternRule message="Do not use digits in the Name"
                  pattern={/^[^0-9]+$/} />
              </SimpleItem>
              <SimpleItem dataField="Date"
                editorType="dxDateBox"
                editorOptions={this.dateBoxOptions}>
                <Label text="Date of birth" />
                <RequiredRule message="Date of birth is required" />
                <RangeRule max={this.maxDate} message="You must be at least 21 years old" />
              </SimpleItem>
            </GroupItem>
            <GroupItem caption="Billing address">
              <SimpleItem dataField="Country" editorType="dxSelectBox" editorOptions={this.countryEditorOptions}>
                <RequiredRule message="Country is required" />
              </SimpleItem>
              <SimpleItem dataField="City" editorType="dxAutocomplete" editorOptions={this.cityEditorOptions}>
                <PatternRule pattern={/^[^0-9]+$/} message="Do not use digits in the City name" />
                <StringLengthRule min={2} message="City must have at least 2 symbols" />
                <RequiredRule message="City is required" />
              </SimpleItem>
              <SimpleItem dataField="Address">
                <RequiredRule message="Address is required" />
              </SimpleItem>
              <SimpleItem dataField="Phone"
                helpText="Enter the phone number in USA phone format"
                editorOptions={this.phoneEditorOptions}
              >
                <PatternRule
                  message="The phone must have a correct USA phone format"
                  pattern={/^\+\s*1\s*\(\s*[02-9]\d{2}\)\s*\d{3}\s*-\s*\d{4}$/}
                />
              </SimpleItem>
              <SimpleItem dataField="Accepted"
                editorType="dxCheckBox"
                editorOptions={this.checkBoxOptions}>
                <Label visible={false} />
                <CompareRule message="You must agree to the Terms and Conditions"
                  comparisonTarget={this.checkComparison}
                />
              </SimpleItem>
            </GroupItem>
            <ButtonItem horizontalAlignment="left"
              buttonOptions={this.buttonOptions}
            />
          </Form>
        </form>
      </React.Fragment>
    );
  }

  checkComparison() {
    return true;
  }

  handleSubmit(e) {
    notify({
      message: 'You have submitted the form',
      position: {
        my: 'center top',
        at: 'center top'
      }
    }, 'success', 3000);
    e.preventDefault();
  }
  passwordComparison() {
    return this.state.customer.Password;
  }
}

function sendRequest(value) {
  const validEmail = 'test@dx-email.com';
  return new Promise((resolve) => {
    setTimeout(function() {
      resolve(value === validEmail);
    }, 1000);
  });
}

function asyncValidation(params) {
  return sendRequest(params.value);
}

export default App;
