export default class Field {
  element: Selector;

  text: Promise<string>;

  constructor(element: Selector) {
    this.element = element;
    this.text = element.textContent;
  }
}
