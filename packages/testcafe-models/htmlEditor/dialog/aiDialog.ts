import Button from '../../button';
import { Selector } from 'testcafe';
import Popup from '../../popup';

const CLASSES = {
  wrapper: 'dx-popup-wrapper',
  dialog: 'dx-aidialog',
  button: 'dx-button',
};


export default class AIDialog extends Popup {
  public static className = `.${CLASSES.wrapper}.${CLASSES.dialog}`;

  constructor () {
    super(Selector(AIDialog.className));
  }

  getSplitButton(): Button {
    return new Button(this.getBottomToolbar().find(`.${CLASSES.button}`).nth(5));
  }
}
