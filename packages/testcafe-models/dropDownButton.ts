import type { WidgetName } from './types';
import DropDownList from './internal/dropDownList';

const ATTR = {
  popupId: 'aria-owns',
};

const CLASS = {
  focused: 'dx-state-focused',
  buttonGroup: 'dx-buttongroup',
};

export default class DropDownButton extends DropDownList {
  public get isFocused(): Promise<boolean> {
    return this.element.find(`.${CLASS.buttonGroup}`).hasClass(CLASS.focused);
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxDropDownButton'; }

  getPopupOwnerElement(): Selector {
    return this.element;
  }

  // eslint-disable-next-line class-methods-use-this
  getPopupIdAttr(): string {
    return ATTR.popupId;
  }
}
