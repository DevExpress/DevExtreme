import type { ColumnChooser, ColumnChooserSelectionConfig } from '@js/common/grids';

import { defaultOptions as columnChooserDefaultOptions } from '../../../grid_core/column_chooser/const';

export interface Options {
  columnChooser?: Omit<ColumnChooser, 'selection'> & {
    // TODO: change d.ts files. Recursive selection isn't supported in CardView yet.
    selection: Omit<ColumnChooserSelectionConfig, 'recursive'>;
  };
}

export const defaultOptions = columnChooserDefaultOptions as Options;
