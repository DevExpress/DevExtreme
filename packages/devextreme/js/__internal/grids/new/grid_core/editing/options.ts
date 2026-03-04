import type * as dxForm from '@js/ui/form';
import type * as dxPopup from '@js/ui/popup';

import type { DataObject, Key } from '../data_controller/types';
import type { Action } from '../types';
import type { Change } from './types';

export interface EditingTexts {
  confirmDeleteMessage: string;
  confirmDeleteTitle: string;
  deleteCard: string;
  editCard: string;
  saveCard: string;
  addCard: string;
  cancel: string;
}

export interface Options {
  editing?: {
    editCardKey?: Key;

    allowAdding?: boolean;
    allowDeleting?: boolean;
    allowUpdating?: boolean;

    changes?: Change[];

    confirmDelete?: boolean;

    form?: dxForm.Options;
    popup?: dxPopup.Options;

    texts?: Partial<EditingTexts>;
  };

  onEditCanceled?: Action<{
    changes: Change[];
  }>;
  onEditCanceling?: Action<{
    changes: Change[]; cancel: boolean;
  }>;
  onEditingStart?: Action<{
    key: Key; data: DataObject; cancel: boolean;
  }>;
  onInitNewCard?: Action<{
    promise?: Promise<void>; data: DataObject;
  }>;
  onCardInserting?: Action<{
    cancel: boolean | Promise<boolean>; data: DataObject;
  }>;
  onCardInserted?: Action<{
    data: DataObject;
  }>;
  onCardRemoving?: Action<{
    cancel: boolean | Promise<boolean>; key: Key; data: DataObject;
  }>;
  onCardRemoved?: Action<{
    data: DataObject; key: Key;
  }>;
  onCardUpdating?: Action<{
    cancel: boolean | Promise<boolean>; key: Key; oldData: DataObject; newData: DataObject;
  }>;
  onCardUpdated?: Action<{
    data: DataObject; key: Key;
  }>;
  onSaved?: Action<{
    changes: Change[];
  }>;
  onSaving?: Action<{
    promise?: Promise<void>;
    cancel: boolean;
    changes: Change[];
  }>;
}

export const defaultOptions = {
  editing: {
    changes: [],

    allowAdding: false,
    allowDeleting: false,
    allowUpdating: false,
    confirmDelete: true,

    form: {},
    popup: {},

    texts: {
      confirmDeleteMessage: undefined,
      confirmDeleteTitle: '',
      deleteCard: undefined,
      editCard: undefined,
      saveCard: undefined,
      addCard: undefined,
      cancel: undefined,
    },
  },
} satisfies Options;
