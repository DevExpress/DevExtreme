import * as React from 'react';
import { ClickEvent } from 'devextreme/ui/button';
import { ValueChangedEvent } from 'devextreme/ui/text_box';
import { ValidatedEvent } from 'devextreme/ui/validator';
import {
  Button, TextBox, ValidationSummary, Validator,
} from 'devextreme-react';
import { RequiredRule } from 'devextreme-react/validator';
import Example from './example-block';

class ValidatorExample extends React.Component<any, any> {
  private _currentValue = '';

  private _adapter: any;

  private _callbacks: (() => void)[] = [];

  constructor(props: unknown) {
    super(props);
    this.state = {
      isValid: true,
    };

    this._adapter = {
      getValue: () => this._currentValue,
      validationRequestsCallbacks: this._callbacks,
      applyValidationResults: (e: ValidatedEvent) => {
        this.setState({ isValid: e.isValid });
      },
    };
  }

  private _onValueChanged = (e: ValueChangedEvent) => {
    this._currentValue = e.value;

    this._callbacks.forEach((callback: Function) => {
      callback();
    });
  };

  private _onSubmit = (e: ClickEvent) => {
    e.validationGroup.validate();
  };

  public render(): React.ReactNode {
    const { isValid } = this.state;
    return (
      <div>
        <Example title="Standalone Validator example">
          <div style={{ border: isValid ? 'none' : '1px solid red' }}>
            <TextBox onValueChanged={this._onValueChanged} />
          </div>
          <Validator adapter={this._adapter}>
            <RequiredRule message="This field is required" />
          </Validator>
          <ValidationSummary />
          <Button
            text="Submit"
            onClick={this._onSubmit}
          />
        </Example>
      </div>
    );
  }
}

export default ValidatorExample;
