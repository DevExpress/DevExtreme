import RadioButton from './button';

const CLASS = {
  itemContent: 'dx-item-content',
};

export default class RadioGroupItem {
  content: Selector;

  element: Selector;

  radioButton: RadioButton;

  text: Promise<string>;

  constructor(element: Selector) {
    this.content = element.find(`.${CLASS.itemContent}`);
    this.element = element;
    this.radioButton = new RadioButton(element);
    this.text = element.textContent;
  }
}
