/* eslint-disable @typescript-eslint/no-explicit-any */

import type { EventInfo } from '@js/common/core/events';
import type { DxElement } from '@js/core/element';

import type { CardInfo, Column } from '../../grid_core/columns_controller/types';

export type ContextMenuTarget = 'toolbar' | 'headerPanel' | 'content';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ContextMenuPreparingEvent<TCardData = unknown, TKey = unknown> = EventInfo<any> & {
  items?: any[];

  readonly target: ContextMenuTarget;

  readonly targetElement: DxElement;

  readonly columnIndex?: number;

  readonly column?: Column;

  readonly cardIndex?: number;

  readonly card?: TCardData;
};

export interface Options<TCardData = CardInfo, TKey = unknown> {
  onContextMenuPreparing?: (args: ContextMenuPreparingEvent<TCardData, TKey>) => void;
}
