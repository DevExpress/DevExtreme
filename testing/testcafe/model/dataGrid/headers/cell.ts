import { Selector } from 'testcafe';
import FocusableElement from '../../internal/focusable';
import Widget from '../../internal/widget';

const CLASS = {
  hiddenColumn: 'hidden-column',
  filterMenu: 'dx-header-filter-menu',
  list: 'dx-list',
};

export default class HeaderCell {
  element: Selector;

  body = Selector('body');

  isFocused: Promise<boolean>;

  isHidden: Promise<boolean>;

  constructor(headerRow: Selector, index: number, widgetName: string) {
    this.element = headerRow.find(`td[aria-colindex='${index + 1}']`);
    this.isFocused = this.element.focused;
    this.isHidden = this.element.hasClass(Widget.addClassPrefix(widgetName, CLASS.hiddenColumn));
  }

  getFilterIcon(): Selector {
    return this.element.find('.dx-column-indicators > .dx-header-filter');
  }

  getEditor(): FocusableElement {
    return new FocusableElement(this.element.find('.dx-texteditor-input, .dx-checkbox'));
  }
}
