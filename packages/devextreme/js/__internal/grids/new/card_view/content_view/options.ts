import type { DataRow } from '../../grid_core/columns_controller/types';
import * as Base from '../../grid_core/content_view/options';
import type { DataObject } from '../../grid_core/data_controller/types';
import type { Template } from '../../grid_core/types';

export interface Options extends Base.Options {
  cardsPerRow?: number | 'auto';
  cardMinWidth?: number;
  cardMaxWidth?: number;
  wordWrapEnabled?: boolean;
  cardCover?: {
    imageExpr?: string | ((data: DataObject) => string);
    altExpr?: string | ((data: DataObject) => string);
    maxHeight?: number;
    ratio?: string;
  };
  cardFooterTemplate?: Template<{ card: DataRow }>;
}

export const defaultOptions = {
  wordWrapEnabled: false,
  cardsPerRow: 3,
  cardCover: {
    ratio: '1 / 1',
  },
  ...Base.defaultOptions,
} satisfies Options;
