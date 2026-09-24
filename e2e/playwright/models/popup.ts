import type { Locator } from '@playwright/test';
import type { WidgetName } from './types';
import Button from './button';
import Overlay from './overlay';

const CLASS = {
  button: 'dx-button',
  topToolbar: 'dx-popup-title',
  bottomToolbar: 'dx-popup-bottom',
  closeButton: 'dx-closebutton',
  doneButton: 'dx-popup-done',
  cancelButton: 'dx-popup-cancel',
};

export default class Popup extends Overlay {
  public static className = '.dx-popup-wrapper';

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxPopup'; }

  public getToolbar(): Locator {
    return this.getWrapper().locator(`.${CLASS.topToolbar}`);
  }

  public getBottomToolbar(): Locator {
    return this.getWrapper().locator(`.${CLASS.bottomToolbar}`);
  }

  public getButton(index = 0): Button {
    return new Button(this.page, this.getWrapper().locator(`.${CLASS.button}`).nth(index));
  }

  public getCloseButton(): Button {
    return new Button(this.page, this.getWrapper().locator(`.${CLASS.closeButton}`));
  }

  public getApplyButton(): Button {
    return new Button(this.page, this.getWrapper().locator(`.${CLASS.button}.${CLASS.doneButton}`));
  }

  public getCancelButton(): Button {
    return new Button(
      this.page,
      this.getWrapper().locator(`.${CLASS.button}.${CLASS.cancelButton}`),
    );
  }
}
