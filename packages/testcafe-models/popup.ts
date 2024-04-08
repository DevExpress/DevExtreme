import { Selector } from 'testcafe';
import type { WidgetName } from './types';
import Button from './button';
import Overlay from './overlay';

const CLASS = {
  button: 'dx-button',
  content: 'dx-overlay-content',
  wrapper: 'dx-overlay-wrapper',
  topToolbar: 'dx-popup-title',
  bottomToolbar: 'dx-popup-bottom',
  closeButton: 'dx-closebutton',
  doneButton: 'dx-popup-done',
  cancelButton: 'dx-popup-cancel',
  todayButton: 'dx-button-today',
  navigatorNextView: 'dx-calendar-navigator-next-view',
  navigatorPrevView: 'dx-calendar-navigator-previous-view',
  navigatorCaption: 'dx-calendar-caption-button',
  viewsWrapper: 'dx-calendar-views-wrapper',
};
export default class Popup extends Overlay {
  public static className = '.dx-popup-wrapper';

  public static footerToolbarClassName = '.dx-popup-bottom';

  topToolbar: Selector;

  constructor(id: string | Selector) {
    super(id);

    this.topToolbar = this.element.find(`.${CLASS.topToolbar}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxPopup'; }

  // eslint-disable-next-line class-methods-use-this
  getToolbar(): Selector {
    return Selector(`.${CLASS.topToolbar}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getBottomToolbar(): Selector {
    return Selector(`.${CLASS.bottomToolbar}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getViewsWrapper(): Selector {
    return Selector(`.${CLASS.viewsWrapper}`);
  }

  getCloseButton(): Button {
    return new Button(this.getWrapper().find(`.${CLASS.closeButton}`));
  }

  getApplyButton(): Button {
    return new Button(this.getWrapper().find(`.${CLASS.button}.${CLASS.doneButton}`));
  }

  getCancelButton(): Button {
    return new Button(this.getWrapper().find(`.${CLASS.button}.${CLASS.cancelButton}`));
  }

  getTodayButton(): Button {
    return new Button(this.getWrapper().find(`.${CLASS.todayButton}`));
  }

  getNavigatorPrevButton(): Button {
    return new Button(this.getWrapper().find(`.${CLASS.navigatorPrevView}`));
  }

  getNavigatorNextButton(): Button {
    return new Button(this.getWrapper().find(`.${CLASS.navigatorNextView}`));
  }

  getNavigatorCaption(): Button {
    return new Button(this.getWrapper().find(`.${CLASS.navigatorCaption}`));
  }
}
