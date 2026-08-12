import type { Selector } from 'testcafe';

const CLASSES = {
  root: 'dx-pivotgrid-horizontal-headers',
};

export default class ColumnsArea {
  public readonly element: Selector;

  constructor(selector: Selector, idx?: number) {
    this.element = selector.find(`thead.${CLASSES.root}`).nth(idx ?? 0);
  }

  getCell(rowIdx = 0, cellIdx = 0): Selector {
    return this.element.find('tr').nth(rowIdx).find('td').nth(cellIdx);
  }

  getCells(): Selector {
    return this.element.find('td');
  }
}
