import { Selector } from 'testcafe';
import Popup from '../popup';

const CLASS = {
  dateBoxPopup: 'dx-datebox-wrapper',
  popupDone: 'dx-popup-done',
  button: 'dx-button',
};

export class DateBoxPopup extends Popup {
  constructor() {
    super(`.${CLASS.dateBoxPopup}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getDoneButton(): Selector {
    return Selector(`.${CLASS.popupDone}.${CLASS.button}`);
  }
}
