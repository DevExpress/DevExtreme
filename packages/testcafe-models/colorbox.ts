import type { WidgetName } from './types';
import Widget from './internal/widget';
import Popup from './popup';

const CLASS = {
  input: 'dx-texteditor-input',
  popup: 'dx-popup',
};

export default class ColorBox extends Widget {
  input: Selector;

  constructor(id: string | Selector) {
    super(id);

    this.input = this.element.find(`.${CLASS.input}`);
  }

  getPopup(): Popup {
    return new Popup(this.element.find(`.${CLASS.popup}`));
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxColorBox'; }
}
