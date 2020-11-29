import FocusableElement from '../internal/focusable';

export class SelectableElement extends FocusableElement {
  get selected(): Promise<boolean> {
    return this.element.hasClass('dx-selection');
  }
}
