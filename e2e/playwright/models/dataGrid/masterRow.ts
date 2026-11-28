import type { Locator } from '@playwright/test';
import GridElement from '../gridCore/element';

const CLASS = {
  dataGrid: 'dx-datagrid',
  cell: 'dx-master-detail-cell',
};

export default class MasterRow extends GridElement {
  // Only the element of the detail grid: a DataGrid model here would import the module that
  // imports this one.
  public getDataGrid(): GridElement {
    return new GridElement(this.element.locator(`.${CLASS.dataGrid}`));
  }

  public getCell(): Locator {
    return this.element.locator(`.${CLASS.cell}`);
  }
}
