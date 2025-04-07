import type { DataChange as Change } from '@js/common/grids';

export type { Change };

export interface EditingProperties {
  editingChanges?: Change[];
  allowDeleting?: boolean;
  allowUpdating?: boolean;
  allowAdding?: boolean;
}
