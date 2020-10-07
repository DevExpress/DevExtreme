import {
  Component,
  ComponentBindings,
  JSXComponent,
  Method,
  OneWay,
  TwoWay,
} from 'devextreme-generator/component_declaration/common';

import BaseComponent from './base_test_widget';

export const view = ({ restAttributes }: OptionsCheckWidget): JSX.Element => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div {...restAttributes} />
);

@ComponentBindings()
export class OptionsCheckWidgetProps {
  @OneWay() text = 'default text';

  @TwoWay() twoWayProp = 1;

  @OneWay() objectProp = { someVal: true };

  @OneWay() oneWayWithoutValue?: number;

  @OneWay() oneWayWithValue = 10;

  @OneWay() oneWayNullWithValue: number | null = 20;

  @TwoWay() twoWayWithValue = '10';

  @TwoWay() twoWayNullWithValue: string | null = '20';

  @OneWay() propWithElement?: HTMLDivElement | number;
}

@Component({
  jQuery: {
    register: true,
    component: BaseComponent,
  },
  view,
})
export default class OptionsCheckWidget extends JSXComponent(OptionsCheckWidgetProps) {
  @Method()
  updateTwoWayPropCheck(): void {
    this.props.twoWayProp += 1;
  }

  @Method()
  getLastPreactReceivedProps(): OptionsCheckWidgetProps {
    return this.props;
  }
}
