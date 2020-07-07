import {
  Component,
  ComponentBindings,
  JSXComponent,
} from 'devextreme-generator/component_declaration/common';

export const view = () => null;

@ComponentBindings()
export class EmptyTestWidgetProps {}

@Component({
  jQuery: {
    register: true,
  },
  view,
})
export default class EmptyTestWidget extends JSXComponent(EmptyTestWidgetProps) {}
