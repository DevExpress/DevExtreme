import { Selector } from 'testcafe';
import Widget from './internal/widget';

const CLASS = {
  content: 'dx-overlay-content',
  wrapper: 'dx-overlay-wrapper',
  toolbar: 'dx-popup-title',
};
export default class Popup extends Widget {
  name = 'dxPopup';

  content: Selector;

  wrapper: Selector;

  toolbar: Selector;

  constructor(id: string | Selector) {
    super(id);

    this.content = this.element.find(`.${CLASS.content}`);
    this.wrapper = this.element.find(`.${CLASS.wrapper}`);
    this.toolbar = this.element.find(`.${CLASS.toolbar}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getWrapper(): Selector {
    return Selector(`.${CLASS.wrapper}`);
  }
}
