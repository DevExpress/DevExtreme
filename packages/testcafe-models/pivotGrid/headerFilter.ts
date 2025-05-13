const CLASSES = {
  icon: 'dx-header-filter',
};

export default class HeaderFilter {
  public readonly element: Selector;

  public readonly ariaLabel: Promise<string | null>;

  constructor(selector: Selector) {
    this.element = selector.find(`.${CLASSES.icon}`);
    this.ariaLabel = this.element.getAttribute('aria-label');
  }
}
