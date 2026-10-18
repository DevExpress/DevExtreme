import type { Locator } from '@playwright/test';

const CLASSES = {
  root: 'dx-pivotgrid-horizontal-headers',
};

export default class ColumnsArea {
  public readonly element: Locator;

  constructor(selector: Locator, idx?: number) {
    this.element = selector.locator(`thead.${CLASSES.root}`).nth(idx ?? 0);
  }

  public getCell(rowIdx = 0, cellIdx = 0): Locator {
    return this.element.locator('tr').nth(rowIdx).locator('td')
      .nth(cellIdx);
  }

  public getCells(): Locator {
    return this.element.locator('td');
  }
}
