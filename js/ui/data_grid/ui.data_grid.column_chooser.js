import gridCore from './ui.data_grid.core';
import { columnChooserModule } from '../grid_core/ui.grid_core.column_chooser';

export const ColumnChooserController = columnChooserModule.controllers.columnChooser;
export const ColumnChooserView = columnChooserModule.views.columnChooserView;

gridCore.registerModule('columnChooser', columnChooserModule);
