import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import * as Base from '@ts/grids/new/grid_core/content_view/options';
import type { DataObject } from '@ts/grids/new/grid_core/data_controller/types';
import type { Template } from '@ts/grids/new/grid_core/types';

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

  cardTemplate?: Template<DataRow>;

  cardHeader?: {
    captionExpr?: string | ((data: DataObject) => string);
    visible?: boolean;
  };
}

export const defaultOptions = {
  cardsPerRow: 3,
  cardCover: {
    ratio: '1 / 1',
  },
  ...Base.defaultOptions,
} satisfies Options;
