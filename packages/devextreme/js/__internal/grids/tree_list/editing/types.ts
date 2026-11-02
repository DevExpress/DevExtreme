import type { EditingTexts } from '@js/ui/tree_list';
import type { EditingDefaultOptions } from '@ts/grids/grid_core/editing/types';

export type TreeListEditingDefaultOptions = EditingDefaultOptions & {
  editing: { texts?: EditingTexts };
};
