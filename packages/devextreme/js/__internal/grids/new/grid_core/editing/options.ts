import messageLocalization from '@js/localization/message';

import type { Key } from '../data_controller/types';
import type { Change } from './types';

export interface Options {
  editing?: {
    editCardKey?: Key;

    allowAdding?: boolean;
    allowDeleting?: boolean;
    allowUpdating?: boolean;

    changes?: Change[];

    texts?: {
      addCard?: string;
    };
  };
}

export const defaultOptions = {
  editing: {
    changes: [],

    allowAdding: false,
    allowDeleting: false,
    allowUpdating: false,

    texts: {
      addCard: messageLocalization.format('dxCardView-editingAddCard'),
    },
  },
} satisfies Options;
