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
  overflowButton: 'dx-dropdownmenu-button',
  todayButton: 'dx-button-today',
  navigatorNextView: 'dx-calendar-navigator-next-view',
  navigatorPrevView: 'dx-calendar-navigator-previous-view',
  navigatorCaption: 'dx-calendar-caption-button',
  viewsWrapper: 'dx-calendar-views-wrapper',
};

export default class Popup extends Overlay {
  name: WidgetName = 'dxPopup';

  public static className = '.dx-popup-wrapper';

  public getToolbar(): Locator {
    return this.getWrapper().locator(`.${CLASS.topToolbar}`);
  }

  public getBottomToolbar(): Locator {
    return this.getWrapper().locator(`.${CLASS.bottomToolbar}`);
  }

  public getViewsWrapper(): Locator {
    return this.page.locator(`.${CLASS.viewsWrapper}`);
  }

  public getButton(index = 0): Button {
    return new Button(this.page, this.getWrapper().locator(`.${CLASS.button}`).nth(index));
  }

  public getOverflowButton(): Button {
    return new Button(this.page, this.getWrapper().locator(`.${CLASS.overflowButton}`).first());
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

  public getTodayButton(): Button {
    return new Button(this.page, this.getWrapper().locator(`.${CLASS.todayButton}`));
  }

  public getNavigatorPrevButton(): Button {
    return new Button(this.page, this.getWrapper().locator(`.${CLASS.navigatorPrevView}`));
  }

  public getNavigatorNextButton(): Button {
    return new Button(this.page, this.getWrapper().locator(`.${CLASS.navigatorNextView}`));
  }

  public getNavigatorCaption(): Button {
    return new Button(this.page, this.getWrapper().locator(`.${CLASS.navigatorCaption}`));
  }
}
