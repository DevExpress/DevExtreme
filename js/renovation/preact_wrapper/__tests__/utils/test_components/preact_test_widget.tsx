import {
  Component,
  ComponentBindings,
  Effect,
  Event,
  JSXComponent,
  Method,
  OneWay,
  Ref,
  TwoWay,
} from 'devextreme-generator/component_declaration/common';
import {
  keyboard,
} from '../../../../../events/short';

export const view = (viewModel: PreactTestWidget) => (
  <div
    ref={viewModel.rootRef as any}
    {...viewModel.props} // eslint-disable-line react/jsx-props-no-spreading
    {...viewModel.restAttributes} // eslint-disable-line react/jsx-props-no-spreading
    data-component-attr="component-attr-value"
    className={viewModel.className}
  >
    <span>{viewModel.props.text}</span>
  </div>
);

@ComponentBindings()
export class PreactTestWidgetProps {
  @OneWay() height?: number;

  @OneWay() width?: number;

  @OneWay() text = 'default text';

  @TwoWay() twoWayProp?: number = 1;

  @OneWay() subscribeEffect?: any;

  @OneWay() unsubscribeEffect?: any;

  @OneWay() objectProp? = { someVal: true };

  @Event() onKeyDown?: (e: any) => any;

  @Event({
    actionConfig: { someConfigs: 'action-config' },
  }) onEventProp?: (e: any) => any;
}

@Component({
  jQuery: {
    register: true,
  },
  view,
})
export default class PreactTestWidget extends JSXComponent(PreactTestWidgetProps) {
  @Ref()
  rootRef!: HTMLDivElement;

  @Method()
  apiMethodCheck(arg1, arg2): string {
    return `${this.props.text} - ${arg1} - ${arg2}`;
  }

  @Method()
  updateTwoWayPropCheck(): void {
    this.props.twoWayProp += 1;
  }

  @Method()
  eventPropCheck(arg): void {
    this.props.onEventProp?.(arg);
  }

  @Method()
  getLastProps(): PreactTestWidgetProps {
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
      const id = keyboard.on(this.rootRef, this.rootRef, (e) => onKeyDown(e));

      return (): void => keyboard.off(id);
    }

    return undefined;
  }

  get className(): string {
    return `dx-test-widget ${this.restAttributes.className}`;
  }
}
