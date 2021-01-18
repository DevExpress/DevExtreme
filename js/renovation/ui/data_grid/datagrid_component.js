import DataGridBase from '../../../ui/data_grid/ui.data_grid.base';
import $ from '../../../core/renderer';

const DATA_GRID_NAME = 'dxDataGrid';

export class DataGridComponent extends DataGridBase {
    constructor(options) {
        super($('<div>'), options);
        this.NAME = DATA_GRID_NAME;
    }

    _initTemplateManager() {}

    // prevent render
    _updateDOMComponent() {}
}
