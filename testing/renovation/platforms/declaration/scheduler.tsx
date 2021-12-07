/* eslint-disable no-restricted-globals */
import {
  Component, ComponentBindings, JSXComponent, InternalState, Effect,
} from '@devextreme-generator/declarations';
import React from 'react';
import { Scheduler } from '../../../../js/renovation/ui/scheduler/scheduler';

export const viewFunction = ({ componentProps }: App): JSX.Element => (
  <Scheduler
    id="container"
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...componentProps}
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

  @InternalState() currentDate = new Date();

  @InternalState() currentView: string;

  currentDateChange(date: Date): void {
    this.currentDate = date;
  }

  currentViewChange(view: string): void {
    this.currentView = view;
  }

  @Effect({ run: 'once' })
  optionsUpdated(): void {
    (window as unknown as { onOptionsUpdated: (unknown) => void })
      .onOptionsUpdated = (newOptions) => {
        const {
          currentDate,
          currentView,
          ...restProps
        } = newOptions;

        if (currentDate) {
          this.currentDate = currentDate;
        }

        if (currentView) {
          this.currentView = currentView;
        }

        this.options = {
          ...this.options,
          ...restProps,
        };
      };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get componentProps(): any {
    return {
      ...this.options,
      currentDate: this.currentDate,
      currentView: this.currentView,
      currentDateChange: (date: Date): void => this.currentDateChange(date),
      currentViewChange: (view: string): void => this.currentViewChange(view),
    };
  }
}
