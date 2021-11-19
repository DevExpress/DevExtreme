/* eslint-disable no-restricted-globals */
import {
  Component, ComponentBindings, JSXComponent, InternalState, Effect,
} from '@devextreme-generator/declarations';
import React from 'react';
import { Scheduler } from '../../../../js/renovation/ui/scheduler/scheduler';

export const viewFunction = ({ options }: App): JSX.Element => (
  <Scheduler
    id="container"
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...options}
  />
);

@ComponentBindings()
class AppProps { }

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class App extends JSXComponent<AppProps>() {
  @InternalState() options = {};

  @Effect({ run: 'once' })
  optionsUpdated(): void {
    (window as unknown as { onOptionsUpdated: (unknown) => void })
      .onOptionsUpdated = (newOptions) => {
        this.options = {
          ...this.options,
          ...newOptions,
        };
      };
  }
}
