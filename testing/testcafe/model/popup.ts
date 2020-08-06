import Widget from './internal/widget';

const CLASS = {
  content: 'dx-overlay-content',
};
export default class Popup extends Widget {
  name = 'dxPopup';

  content: Selector;

  constructor(id: string) {
    super(id);

    this.content = this.element.find(`.${CLASS.content}`);
  }
}
