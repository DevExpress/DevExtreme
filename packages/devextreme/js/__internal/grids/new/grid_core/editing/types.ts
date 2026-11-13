import type { DataChange as Change } from '@js/common/grids';

export type { Change };

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
