import {
  Component,
  ComponentBindings,
  JSXComponent,
} from '@devextreme-generator/declarations';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const view = () => <div />;

@ComponentBindings()
export class EmptyTestWidgetProps {}

@Component({
  jQuery: {
    register: true,
  },
  view,
})
export default class EmptyTestWidget extends JSXComponent(EmptyTestWidgetProps) {}
