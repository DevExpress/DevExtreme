/* eslint-disable no-restricted-globals */
import {
  Component, ComponentBindings, JSXComponent, InternalState, Effect, Fragment,
} from '@devextreme-generator/declarations';
import React from 'react';
import { CheckBox, CheckBoxProps } from '../../../../js/renovation/ui/editors/check_box/check_box';

export const viewFunction = ({ options, componentProps }: App): JSX.Element => (
  <Fragment>
    {options && (
      <CheckBox
        id="container"
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...componentProps}
      />
    )}
  </Fragment>
);
@ComponentBindings()
class AppProps { }

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class App extends JSXComponent<AppProps>() {
  @InternalState() options?: Partial<CheckBoxProps>;

  @InternalState() value = false;

  valueChange(value: boolean | null): void {
    this.value = value;
  }

  @Effect({ run: 'once' })
  optionsUpdated(): void {
    (window as unknown as { onOptionsUpdated: (unknown) => void })
      .onOptionsUpdated = (newOptions: CheckBoxProps) => {
        const { value, ...restProps } = newOptions;
        this.value = value;

        this.options = {
          ...this.options,
          ...restProps,
        };
      };
  }

  get componentProps(): Partial<CheckBoxProps & { valueChange: (value: boolean | null) => void }> {
    return {
      ...this.options,
      value: this.value,
      valueChange: (value: boolean | null): void => { this.valueChange(value); },
    };
  }
}
