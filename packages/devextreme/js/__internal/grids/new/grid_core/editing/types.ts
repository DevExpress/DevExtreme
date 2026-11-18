import type { DataChange as Change } from '@js/common/grids';
import type { SimpleItem } from '@js/ui/form';

import type { Column } from '../columns_controller/types';

export type { Change };

export type ColumnFormItem = SimpleItem & { column?: Column };

export interface EditingProperties {
  editingChanges?: Change[];
  allowDeleting?: boolean;
  allowUpdating?: boolean;
  allowAdding?: boolean;
}

export interface EditingPublicMethods {
  addCard: () => Promise<void>;
  cancelEditData: () => void;
  deleteCard: (cardIndex: number) => void;
  editCard: (cardIndex: number) => void;
  hasEditData: () => boolean;
  saveEditData: () => Promise<void>;
}
