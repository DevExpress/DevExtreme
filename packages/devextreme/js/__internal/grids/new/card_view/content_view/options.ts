import * as Base from '../../grid_core/content_view/options';
import type { DataObject } from '../../grid_core/data_controller/types';

export interface Options extends Base.Options {
  cardsPerRow?: number | 'auto';
  cardMinWidth?: number;
  cardMaxWidth?: number;
  cardCover?: {
    imageExpr: string | ((data: DataObject) => string);
    altExpr: string | ((data: DataObject) => string);
  };
}

export const defaultOptions = {
  cardsPerRow: 3,
  ...Base.defaultOptions,
} satisfies Options;
