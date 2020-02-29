import gridCore from './ui.data_grid.core';
import columnChooserModule from '../grid_core/ui.grid_core.column_chooser';

exports.ColumnChooserController = columnChooserModule.controllers.columnChooser;
exports.ColumnChooserView = columnChooserModule.views.columnChooserView;

gridCore.registerModule('columnChooser', columnChooserModule);
