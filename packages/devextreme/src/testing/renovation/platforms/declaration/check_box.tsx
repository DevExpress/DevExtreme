/* eslint-disable no-restricted-globals */
import {
  Component, ComponentBindings, JSXComponent, InternalState,
} from '@devextreme-generator/declarations';
import React from 'react';
import { CheckBox, CheckBoxProps } from '../../../../js/renovation/ui/editors/check_box/check_box';

export const viewFunction = ({ componentProps }: App): JSX.Element => (
  <CheckBox
    id="container"
    value={componentProps.value}
    text="checkBox"
    valueChange={componentProps.valueChange}
  />
);
@ComponentBindings()
class AppProps { }

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class App extends JSXComponent<AppProps>() {
  @InternalState() value = null;

  valueChange(value: boolean | null): void {
    this.value = value;
  }

  get componentProps(): Partial<CheckBoxProps & { valueChange: (value: boolean | null) => void }> {
    return {
      value: this.value,
      valueChange: (value: boolean | null): void => { this.valueChange(value); },
    };
  }
}
