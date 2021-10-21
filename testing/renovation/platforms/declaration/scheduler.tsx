/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/prop-types */
import {
  Component, ComponentBindings, JSXComponent, Fragment, InternalState, Effect,
} from '@devextreme-generator/declarations';
import React from 'react';
import { getComponentOptions } from './helpers/getComponentOptions';
import { Scheduler } from '../../../../js/renovation/ui/scheduler/scheduler';

export const viewFunction = ({ options }): JSX.Element => (
  <Fragment>
    <Scheduler
      className="test-scheduler"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...options}
    />
  </Fragment>
);

@ComponentBindings()
class AppProps { }

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class App extends JSXComponent<AppProps>() {
  @InternalState() options = getComponentOptions();

  @Effect({ run: 'once' })
  optionsUpdated(): void {
    (window as any).onOptionsUpdated = (newOptions) => {
      this.options = {
        ...this.options,
        ...newOptions,
      };
    };
  }
}
