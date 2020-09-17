const CLASS = {
  selected: 'dx-gallery-indicator-item-selected',
};

export default class Indicator {
  element: Selector;

  isSelected: Promise<boolean>;

  constructor(element: Selector) {
    this.element = element;
    this.isSelected = element.hasClass(CLASS.selected);
  }
}
