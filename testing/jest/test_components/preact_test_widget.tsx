import {
  Component,
  ComponentBindings,
  JSXComponent,
  Method,
  OneWay,
  TwoWay,
  Effect,
} from 'devextreme-generator/component_declaration/common';

export const view = (viewModel: PreactTestWidget) => (
  <div
    {...viewModel.props} // eslint-disable-line react/jsx-props-no-spreading
    {...viewModel.props.elementAttr} // eslint-disable-line react/jsx-props-no-spreading
  >
    {viewModel.props.text}
  </div>
);

@ComponentBindings()
export class PreactTestWidgetProps {
  @OneWay() text = 'default text';

  @TwoWay() count?: number = 1;

  @OneWay() elementAttr?: { [name: string]: any };

  @OneWay() subscribeEffect?: any;

  @OneWay() unsubscribeEffect?: any;
}

@Component({
  jQuery: {
    register: true,
  },
  view,
})
export default class PreactTestWidget extends JSXComponent(PreactTestWidgetProps) {
  @Effect()
  subscribe(): () => void {
    this.props.subscribeEffect?.();

    return () => this.props.unsubscribeEffect?.();
  }

  @Method()
  tick(): void {
    this.props.count += 1;
  }
}
