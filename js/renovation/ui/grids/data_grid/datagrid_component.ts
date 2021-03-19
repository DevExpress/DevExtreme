/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import DataGridBase from '../../../../ui/data_grid/ui.data_grid.base';
import $ from '../../../../core/renderer';

const DATA_GRID_NAME = 'dxDataGrid';

export class DataGridComponent extends DataGridBase {
  NAME = DATA_GRID_NAME;

  constructor(options) {
    super($('<div>') as any, options);
  }

  _initTemplateManager(): void {}

  // prevent render
  _updateDOMComponent(): void {}
}
