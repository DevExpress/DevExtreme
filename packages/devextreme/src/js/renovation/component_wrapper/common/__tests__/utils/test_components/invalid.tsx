import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from '@devextreme-generator/declarations';

import BaseTestComponent from './component_wrapper/base';

export const view = ({ restAttributes }: InvalidTestWidget): JSX.Element => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div {...restAttributes} />
);

@ComponentBindings()
export class InvalidTestWidgetProps {
  @OneWay() text = 'default text';
}

@Component({
  jQuery: {
    register: true,
    component: BaseTestComponent,
  },
  view,
})
export default class InvalidTestWidget extends JSXComponent(InvalidTestWidgetProps) {
}
