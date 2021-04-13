/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import DataGridBase from '../../../../ui/data_grid/ui.data_grid.base';

const DATA_GRID_NAME = 'dxDataGrid';

export class DataGridComponent extends DataGridBase {
  NAME = DATA_GRID_NAME;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(element: unknown, options: unknown) {
    super(element, options);
  }

  _initTemplates(): void {}

  // prevent render
  _updateDOMComponent(): void {}
}
