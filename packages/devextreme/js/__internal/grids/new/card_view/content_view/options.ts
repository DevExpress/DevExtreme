import type * as dxToolbar from '@js/ui/toolbar';

import type { CardInfo } from '../../grid_core/columns_controller/types';
import * as Base from '../../grid_core/content_view/options';
import type { DataObject } from '../../grid_core/data_controller/types';
import type { Template } from '../../grid_core/types';

export interface Options extends Base.Options {
  cardsPerRow?: number | 'auto';
  cardMinWidth?: number;
  cardMaxWidth?: number;
  wordWrapEnabled?: boolean;
  cardCover?: {
    template?: Template<{ card: CardInfo }>;
    imageExpr?: string | ((data: DataObject) => string);
    altExpr?: string | ((data: DataObject) => string);
    maxHeight?: number;
    aspectRatio?: string;
  };
  cardHeader?: {
    template?: Template<{ card: CardInfo }>;
    visible?: boolean;
    items?: (string | dxToolbar.Item)[];
  };

  cardTemplate?: Template<{ card: CardInfo }>;
  cardContentTemplate?: Template<{ card: CardInfo }>;
  cardFooterTemplate?: Template<{ card: CardInfo }>;
  fieldHintEnabled?: boolean;
}

export const defaultOptions = {
  wordWrapEnabled: false,
  cardsPerRow: 3,
  cardCover: {
    aspectRatio: '1 / 1',
  },
  fieldHintEnabled: false,
  ...Base.defaultOptions,
} satisfies Options;
