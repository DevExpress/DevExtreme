import {
  Component,
  ComponentBindings,
  JSXComponent,
} from '@devextreme-generator/declarations';
import NonTemplatedTestComponent from './component_wrapper/non_templated';

export const view = (): JSX.Element => <div />;

@ComponentBindings()
export class NonTemplatedTestWidgetProps { nonTemplated = true; }

@Component({
  jQuery: {
    register: true,
    component: NonTemplatedTestComponent,
  },
  view,
})
export default class NonTemplatedTestWidget extends JSXComponent(NonTemplatedTestWidgetProps) {}
