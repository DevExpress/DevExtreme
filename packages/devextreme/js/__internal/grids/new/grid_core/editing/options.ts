import messageLocalization from '@js/localization/message';

import type { Key } from '../data_controller/types';
import type { Change } from './types';

export interface Options {
  editing?: {
    editCardKey?: Key;

    changes?: Change[];

    texts?: {
      addCard?: string;
    };
  };
}

export const defaultOptions = {
  editing: {
    changes: [],
    texts: {
      addCard: messageLocalization.format('dxCardView-editingAddCard'),
    },
  },
} satisfies Options;
