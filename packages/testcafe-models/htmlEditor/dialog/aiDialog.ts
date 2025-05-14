import {
  // ClientFunction,
  Selector,
} from 'testcafe';
import Popup from '../../popup';
// import type { WidgetName } from '../../types';

const SELECTORS = {
  wrapper: '.dx-aidialog.dx-popup-wrapper',
  content: '.dx-aidialog.dx-overlay-content',
  selectBox: '.dx-selectbox',
  textArea: '.dx-aidialog-controls .dx-texteditor',
};


export default class AIDialog extends Popup {
  public static className = SELECTORS.wrapper;

  public commandSelectBox: any;

  public optionSelectBox: any;

  public prompTextArea: any;

  public resulTextArea: any;

  constructor () {
    super(Selector(AIDialog.className));

    this.commandSelectBox = this.getContent().find(SELECTORS.selectBox).nth(0);
    this.optionSelectBox = this.getContent().find(SELECTORS.selectBox).nth(1);
    this.prompTextArea = this.getContent().find(SELECTORS.textArea).nth(0);
    this.resulTextArea = this.getContent().find(SELECTORS.textArea).nth(1);
  }
}
