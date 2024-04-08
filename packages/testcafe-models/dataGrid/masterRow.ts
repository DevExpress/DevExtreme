// eslint-disable-next-line import/no-cycle
import DataGrid from './index';

const CLASS = {
  dataGrid: 'dx-datagrid',
  cell: 'dx-master-detail-cell',
};

export default class MasterRow {
  element: Selector;

  constructor(element: Selector) {
    this.element = element;
  }

  getDataGrid(): DataGrid {
    return new DataGrid(this.element.find(`.${CLASS.dataGrid}`));
  }

  getCell(): Selector {
    return this.element.find(`.${CLASS.cell}`);
  }
}
