import * as Base from '../../grid_core/content_view/options';
import type { DataObject } from '../../grid_core/data_controller/types';

export interface Options extends Base.Options {
  cardsPerRow?: number | 'auto';
  cardMinWidth?: number;
  cardMaxWidth?: number;
  cardCover?: {
    imageExpr?: string | ((data: DataObject) => string);
    altExpr?: string | ((data: DataObject) => string);
    maxHeight?: number;
    ratio?: string;
  };
}

export const defaultOptions = {
  cardsPerRow: 3,
  cardCover: {
    ratio: '1 / 1',
  },
  ...Base.defaultOptions,
} satisfies Options;
