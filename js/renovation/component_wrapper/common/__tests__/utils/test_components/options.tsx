import {
  Component,
  ComponentBindings,
  JSXComponent,
  Method,
  Nested,
  OneWay,
  Template,
  TwoWay,
} from '@devextreme-generator/declarations';

import BaseTestComponent from './component_wrapper/base';

export const view = ({ restAttributes }: OptionsTestWidget): JSX.Element => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div {...restAttributes} />
);

@ComponentBindings()
export class OptionsTestWidgetProps {
  @OneWay() text = 'default text';

  @TwoWay() twoWayProp = 1;

  @OneWay() objectProp = { someVal: true };

  @OneWay() oneWayWithoutValue?: number;

  @OneWay() oneWayWithValue = 10;

  @OneWay() oneWayNullWithValue: number | null = 20;

  @TwoWay() twoWayWithValue = '10';

  @TwoWay() twoWayNullWithValue: string | null = '20';

  @OneWay() propWithElement?: HTMLDivElement | number;

  @Nested() nestedObject?: { nestedProp: string } = { nestedProp: 'default value' };

  @Nested() nestedArray?: { nestedProp: string }[];

  @Template() contentTemplate = (): JSX.Element => <div />;
}

@Component({
  jQuery: {
    register: true,
    component: BaseTestComponent,
  },
  view,
})
export default class OptionsTestWidget extends JSXComponent(OptionsTestWidgetProps) {
  @Method()
  updateTwoWayPropCheck(): void {
    this.props.twoWayProp += 1;
  }

  @Method()
  getLastReceivedProps(): OptionsTestWidgetProps {
    return this.props;
  }
}
