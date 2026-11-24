import type { WidgetName } from './types';
import Widget from './internal/widget';
import FocusableElement from './internal/focusable';

const CLASS = {
  item: 'dx-tab',
};

export default class Tabs extends Widget {
  name: WidgetName = 'dxTabs';

  public getItem(index = 0): FocusableElement {
    return new FocusableElement(this.element.locator(`.${CLASS.item}`).nth(index));
  }
}
