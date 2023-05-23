import { Selector } from 'testcafe';
import { WidgetName } from '../helpers/createWidget';
import Button from './button';
import Overlay from './overlay';

const CLASS = {
  button: 'dx-button',
  content: 'dx-overlay-content',
  wrapper: 'dx-overlay-wrapper',
  topToolbar: 'dx-popup-title',
  bottomToolbar: 'dx-popup-bottom',
  closeButton: 'dx-popup-cancel',
  doneButton: 'dx-popup-done',
  todayButton: 'dx-button-today',
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

  getApplyButton(): Button {
    return new Button(this.getWrapper().find(`.${CLASS.button}.${CLASS.doneButton}`));
  }

  getCloseButton(): Button {
    return new Button(this.getWrapper().find(`.${CLASS.button}.${CLASS.closeButton}`));
  }

  getTodayButton(): Button {
    return new Button(this.getWrapper().find(`.${CLASS.todayButton}`));
  }
}
