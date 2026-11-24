import type { WidgetName } from './types';
import Widget from './internal/widget';
import FocusableElement from './internal/focusable';

const CLASS = {
  item: 'dx-multiview-item',
};

export default class MultiView extends Widget {
  name: WidgetName = 'dxMultiView';

  public getItem(index = 0): FocusableElement {
    return new FocusableElement(this.element.locator(`.${CLASS.item}`).nth(index));
  }
}
