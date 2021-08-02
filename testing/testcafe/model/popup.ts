import Widget from './internal/widget';

const CLASS = {
  content: 'dx-overlay-content',
  wrapper: 'dx-overlay-wrapper',
};
export default class Popup extends Widget {
  name = 'dxPopup';

  content: Selector;

  wrapper: Selector;

  constructor(id: string) {
    super(id);

    this.content = this.element.find(`.${CLASS.content}`);
    this.wrapper = this.element.find(`.${CLASS.wrapper}`);
  }
}
