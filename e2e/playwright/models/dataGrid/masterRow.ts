import type { Locator } from '@playwright/test';
import GridElement from '../gridCore/element';

const CLASS = {
  cell: 'dx-master-detail-cell',
};

export default class MasterRow extends GridElement {
  public getCell(): Locator {
    return this.element.locator(`.${CLASS.cell}`);
  }
}
