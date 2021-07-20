import {
  Component,
  ComponentBindings,
  JSXComponent,
} from '@devextreme-generator/declarations';

export const view = (): JSX.Element => <div />;

@ComponentBindings()
export class EmptyTestWidgetProps { empty = true; }

@Component({
  jQuery: {
    register: true,
  },
  view,
})
export default class EmptyTestWidget extends JSXComponent(EmptyTestWidgetProps) {}
