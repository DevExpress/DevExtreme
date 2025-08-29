import type { ColumnChooser, ColumnChooserSelectionConfig } from '@js/common/grids';

import { getDefaultOptions as getDefaultOptionsFromColumnChooser } from '../../../grid_core/column_chooser/m_column_chooser.utils';

export interface Options {
  columnChooser?: Omit<ColumnChooser, 'selection'> & {
    // TODO: change d.ts files. Recursive selection isn't supported in CardView yet.
    selection?: Omit<ColumnChooserSelectionConfig, 'recursive'>;
  };
}

export const defaultOptions = getDefaultOptionsFromColumnChooser() as Options;
