import { columnChooserModule } from '@js/ui/grid_core/ui.grid_core.column_chooser';
import gridCore from '../module_core';

export const ColumnChooserController = columnChooserModule.controllers.columnChooser;
export const ColumnChooserView = columnChooserModule.views.columnChooserView;

gridCore.registerModule('columnChooser', columnChooserModule);
