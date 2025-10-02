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

  getHeaderCells(): Selector {
    return this.element.child('td');
  }

  async getHeaderTexts(): Promise<string[]> {
    const result: string[] = [];
    const headersCells = this.getHeaderCells();
    const headerCount = await headersCells.count;

    for (let i = 0; i < headerCount; i += 1) {
      result.push(await headersCells.nth(i).textContent);
    }

    return result;
  }

  getCommandCell(index: number): CommandCell {
    return new CommandCell(this.element, index, this.widgetName);
  }
}
