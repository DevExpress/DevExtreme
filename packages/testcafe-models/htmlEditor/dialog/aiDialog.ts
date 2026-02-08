import Button from '../../button';
import { Selector } from 'testcafe';
import Popup from '../../popup';
import TextArea from '../../textArea';

const CLASSES = {
  wrapper: 'dx-popup-wrapper',
  dialog: 'dx-aidialog',
  button: 'dx-button',
  textArea: 'dx-textarea',
  menuButton: 'dx-dropdownmenu-button',
};

export default class AIDialog extends Popup {
  public static className = `.${CLASSES.wrapper}.${CLASSES.dialog}`;

  constructor () {
    super(Selector(AIDialog.className));
  }

  getSplitButton(): Button {
    return new Button(this.getBottomToolbar().find(`.${CLASSES.button}`).nth(3));
  }

  getGenerateButton(): Button {
    return new Button(this.getBottomToolbar().find(`.${CLASSES.button}`).nth(0));
  }

  getCancelButton(): Button {
    return new Button(this.getBottomToolbar().find(`.${CLASSES.button}`).nth(0));
  }

  getMenuButton(): Button {
    return new Button(this.getBottomToolbar().find(`.${CLASSES.menuButton}`).nth(0));
  }

  getPromptTextArea(): TextArea {
    return new TextArea(this.getWrapper().find(`.${CLASSES.textArea}`).nth(0));
  }
}
