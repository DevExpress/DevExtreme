import { expectClass } from '../internal/classMatcher';
import GridElement from './element';

const CLASS = {
  focusVisible: 'dx-focused',
  focusHidden: 'dx-cell-focus-disabled',
};

export default class GridFocusableElement extends GridElement {
  public expectFocusVisible(present = true): Promise<void> {
    return expectClass(this.element, CLASS.focusVisible, present);
  }

  public expectFocusHidden(present = true): Promise<void> {
    return expectClass(this.element, CLASS.focusHidden, present);
  }
}
