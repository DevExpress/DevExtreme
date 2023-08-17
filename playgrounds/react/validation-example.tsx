import * as React from 'react';
import { Button } from 'devextreme-react/button';
import { TextBox } from 'devextreme-react/text-box';
import { ValidationGroup } from 'devextreme-react/validation-group';
import { ValidationSummary } from 'devextreme-react/validation-summary';
import { EmailRule, RequiredRule, Validator } from 'devextreme-react/validator';
import Example from './example-block';

const validate = (params: any): void => {
  const result = params.validationGroup.validate();
  if (result.isValid) {
    // form data is valid
    params.validationGroup.reset();
  }
};

export default class extends React.Component<any, any> {
  public render(): React.ReactNode {
    return (
      <Example title="Validation" state={this.state}>
        <ValidationGroup>
          <TextBox defaultValue="email@mail.com">
            <Validator>
              <EmailRule message="Email is invalid." />
              <RequiredRule message="Email is required." />
            </Validator>
          </TextBox>
          <br />
          <TextBox defaultValue="password">
            <Validator>
              <RequiredRule message="Password is required." />
            </Validator>
          </TextBox>
          <ValidationSummary />
          <br />
          <Button
            text="Submit"
            onClick={validate}
          />
        </ValidationGroup>
      </Example>
    );
  }
}
