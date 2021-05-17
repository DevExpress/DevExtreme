import {
  Component,
  ComponentBindings,
  JSXComponent,
} from '@devextreme-generator/declarations';
import BaseComponent from './non_templated_test_widget_jquery_wrapper';

export const view = (): JSX.Element => <div />;

@ComponentBindings()
export class NonTemplatedTestWidgetProps {}

@Component({
  jQuery: {
    register: true,
    component: BaseComponent,
  },
  view,
})
export default class NonTemplatedTestWidget extends JSXComponent(NonTemplatedTestWidgetProps) {}
