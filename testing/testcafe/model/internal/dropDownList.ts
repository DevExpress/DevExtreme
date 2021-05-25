import { Selector, t } from 'testcafe';
import List from '../list';
import TextBox from '../textBox';

const ATTR = {
  popupId: 'aria-owns',
};

const CLASS = {
  dropDownButton: 'dx-dropdowneditor-button',
};

export default abstract class DropDownList extends TextBox {
  dropDownButton: Selector;

  constructor(id: string) {
    super(id);
    this.dropDownButton = this.element.find(`.${CLASS.dropDownButton}`);
  }

  getPopupOwnerElement(): Selector {
    return this.input;
  }

  // eslint-disable-next-line class-methods-use-this
  getPopupIdAttr(): string {
    return ATTR.popupId;
  }

  async isPopupRendered(): Promise<boolean> {
    const popupOwnerElement = this.getPopupOwnerElement();
    const popupIdAttr = this.getPopupIdAttr();
    const hasPopupId = popupOwnerElement.hasAttribute(popupIdAttr);
    return hasPopupId;
  }

  async isOpened(): Promise<boolean> {
    const isPopupRendered = this.isPopupRendered();
    if (!await isPopupRendered) {
      return isPopupRendered;
    }

    const popup = await this.getPopup();
    const overlayContent = popup.parent();
    const isOverlayClosed = await overlayContent.hasClass('dx-state-invisible');
    return Promise.resolve(!isOverlayClosed);
  }

  async getPopup(): Promise<Selector> {
    const popupOwnerElement = this.getPopupOwnerElement();
    const popupIdAttr = this.getPopupIdAttr();
    const popupId = await popupOwnerElement.getAttribute(popupIdAttr);
    return Selector(`#${popupId}`);
  }

  async getList(): Promise<List> {
    await t.expect(await this.isOpened()).ok();

    return new List(await this.getPopup());
  }
}
