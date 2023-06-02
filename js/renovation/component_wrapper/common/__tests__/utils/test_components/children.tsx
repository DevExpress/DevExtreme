import {
  Component,
  ComponentBindings,
  JSXComponent,
  Slot,
} from '@devextreme-generator/declarations';
import TemplatedTestComponent from './component_wrapper/templated';

export const view = ({
  props: {
    children,
  },
  restAttributes,
}: ChildrenTestWidget): JSX.Element => (
  <div
    {...restAttributes}
  >
    <div>Here is Top content</div>
    {children}
    <div>Here is Bottom content</div>
  </div>
);

@ComponentBindings()
export class ChildrenTestWidgetProps {
  @Slot() children?: JSX.Element;
}

@Component({
  jQuery: {
    register: true,
    component: TemplatedTestComponent,
  },
  view,
})
export default class ChildrenTestWidget extends JSXComponent(ChildrenTestWidgetProps) {
}
