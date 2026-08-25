import type { Column as DataGridColumn } from '@js/ui/data_grid';

import type { InternalColumnOptions } from '../grid_core/columns_controller/types';

export type Column = DataGridColumn & InternalColumnOptions;
