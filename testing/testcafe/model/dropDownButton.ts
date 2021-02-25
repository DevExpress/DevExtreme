import DropDownList from './internal/dropDownList';

const ATTR = {
  popupId: 'aria-owns',
};

export default class DropDownButton extends DropDownList {
  name = 'dxDropDownButton';

  getPopupOwnerElement(): Selector {
    return this.element;
  }

  // eslint-disable-next-line class-methods-use-this
  getPopupIdAttr(): string {
    return ATTR.popupId;
  }
}
