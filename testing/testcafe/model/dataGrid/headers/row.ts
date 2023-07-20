import FocusableElement from '../../internal/focusable';
import HeaderCell from './cell';
import CommandCell from '../commandCell';

export default class HeaderRow extends FocusableElement {
  widgetName: string;

  constructor(element: Selector, widgetName: string) {
    super(element);
    this.widgetName = widgetName;
  }

  getHeaderCell(index: number): HeaderCell {
    return new HeaderCell(this.element, index, this.widgetName);
  }

  getCommandCell(index: number): CommandCell {
    return new CommandCell(this.element, index, this.widgetName);
  }
}
