import FocusableElement from '../../internal/focusable';
import Widget from '../../internal/widget';

const CLASS = {
  hiddenColumn: 'hidden-column',
};

export default class HeaderCell extends FocusableElement {
  isHidden: Promise<boolean>;

  constructor(headerRow: Selector, index: number, widgetName: string) {
    super(headerRow.find(`td[aria-colindex='${index + 1}']`));
    this.isHidden = this.element.hasClass(Widget.addClassPrefix(widgetName, CLASS.hiddenColumn));
  }

  getFilterIcon(): Selector {
    return this.element.find('.dx-column-indicators > .dx-header-filter');
  }
}
