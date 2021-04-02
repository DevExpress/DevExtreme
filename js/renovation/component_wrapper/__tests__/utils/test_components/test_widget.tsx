/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  ComponentBindings,
  Effect,
  Event,
  JSXComponent,
  Method,
  OneWay,
  Ref,
  RefObject,
} from '@devextreme-generator/declarations';
import {
  keyboard,
} from '../../../../../events/short';

import BaseComponent from './base_test_widget';

export const view = (viewModel: TestWidget): JSX.Element => (
  <div
    ref={viewModel.rootRef}
    {...viewModel.props} // eslint-disable-line react/jsx-props-no-spreading
    {...viewModel.restAttributes} // eslint-disable-line react/jsx-props-no-spreading
    data-component-attr="component-attr-value"
    className={viewModel.className}
  >
    <span>{viewModel.props.text}</span>
  </div>
);

@ComponentBindings()
export class TestWidgetProps {
  @OneWay() height?: number;

  @OneWay() width?: number;

  @OneWay() text = 'default text';

  @OneWay() subscribeEffect?: any;

  @OneWay() unsubscribeEffect?: any;

  @Event() onKeyDown?: (e: any) => any;

  @Event({
    actionConfig: { someConfigs: 'action-config' },
  }) onEventProp?: (e: any) => any;
}

@Component({
  jQuery: {
    register: true,
    component: BaseComponent,
  },
  view,
})
export default class TestWidget extends JSXComponent(TestWidgetProps) {
  @Ref()
  rootRef!: RefObject<HTMLDivElement>;

  @Method()
  apiMethodCheck(arg1, arg2): string {
    return `${this.props.text} - ${arg1} - ${arg2}`;
  }

  @Method()
  eventPropCheck(arg): void {
    this.props.onEventProp?.(arg);
  }

  @Method()
  // eslint-disable-next-line class-methods-use-this
  methodWithElementParam(arg: HTMLDivElement | number): any {
    return { arg };
  }

  @Method()
  // eslint-disable-next-line class-methods-use-this
  methodReturnElement(arg: HTMLDivElement): HTMLDivElement {
    return arg;
  }

  @Method()
  getLastReceivedProps(): TestWidgetProps {
    return this.props;
  }

  @Effect({ run: 'always' })
  effectsCheck(): () => void {
    this.props.subscribeEffect?.(this.props);

    return (): void => this.props.unsubscribeEffect?.();
  }

  @Effect()
  registerKeyHandlerCheck(): undefined | (() => void) {
    const { onKeyDown } = this.props;

    if (onKeyDown) {
      const id = keyboard.on(this.rootRef.current, this.rootRef.current, (e) => onKeyDown(e));

      return (): void => keyboard.off(id);
    }

    return undefined;
  }

  get className(): string {
    return `dx-test-widget ${this.restAttributes.className}`;
  }
}
