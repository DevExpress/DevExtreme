import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from '@devextreme-generator/declarations';
import BaseTestComponent from './component_wrapper/base';
import { TestWidgetProps } from './base';

export const view = (): JSX.Element => <div />;

@ComponentBindings()
export class AriaTestWidgetProps extends TestWidgetProps {
  @OneWay() aria?: Record<string, string> = {};
}

@Component({
  jQuery: {
    register: true,
    component: BaseTestComponent,
  },
  view,
})
export default class AriaTestWidget extends JSXComponent(AriaTestWidgetProps) {
  keyDown(): void {
  }
}
