import type { Locator } from '@playwright/test';

const CLASSES = {
  root: 'dx-pivotgrid-vertical-headers',
};

export default class RowsArea {
  public readonly element: Locator;

  constructor(selector: Locator, idx?: number) {
    this.element = selector.locator(`.${CLASSES.root}`).nth(idx ?? 0);
  }

  public getCell(idx = 0): Locator {
    return this.element.locator('td').nth(idx);
  }

  public getCellByPosition(rowIdx = 0, cellIdx = 0): Locator {
    return this.element.locator('tr').nth(rowIdx).locator('td')
      .nth(cellIdx);
  }
}
