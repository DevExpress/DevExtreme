import { columnChooserModule } from '@ts/grids/grid_core/column_chooser/m_column_chooser';

import gridCore from '../m_core';

export const ColumnChooserController = columnChooserModule.controllers.columnChooser;
export const ColumnChooserView = columnChooserModule.views.columnChooserView;

gridCore.registerModule('columnChooser', columnChooserModule);
