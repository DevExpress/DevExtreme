import type { DeferredObj } from '@js/core/utils/deferred';
import type { ChangedEvent } from '@ts/grids/grid_core/data_source_adapter/types';

/** How many virtual (not loaded) items sit before and after the loaded window. */
export interface VirtualItemsCount {
  begin: number;
  end: number;
}

export interface VirtualDataLoaderCacheItem {
  pageIndex: number;
  itemsLength: number;
  itemsCount: number;
}

export interface ProcessedChange {
  changeType: 'append' | 'prepend';
  items: unknown[];
  removeCount?: number;
}

export interface DelayedChange {
  isDelayed: boolean;
}

export type VirtualDataLoaderChange = ProcessedChange | ChangedEvent | DelayedChange;

export type ChangedCallback = (change?: VirtualDataLoaderChange) => void;

export interface VirtualDataLoaderController {
  option: (name: string) => unknown;
  isVirtual: () => boolean;
  isVirtualMode: () => boolean;
  isAppendMode: () => boolean;
  getViewportItemIndex: () => number;
  viewportSize: () => number;
  viewportItemSize: () => number;
  getContentOffset: () => number;
  getViewportPosition: () => number;
  virtualItemsCount: () => VirtualItemsCount | undefined;
  getItemSizes: () => Record<number, number>;
  _setViewportPositionCore: (position: number) => void;
}

export interface VirtualDataLoaderDataOptions {
  pageSize: () => number;
  pageIndex: {
    (): number;
    (pageIndex: number): number | undefined;
  };
  pageCount: () => number;
  totalItemsCount: () => number;
  itemsCount: () => number;
  isLoading: () => boolean;
  hasKnownLastPage: () => boolean;
  load: () => DeferredObj<unknown> | undefined;
  items: (isBase?: boolean) => unknown[];
  viewportItems: (items?: unknown[]) => unknown[];
  updateLoading: () => void;
  onChanged: (e: { changeType: string }) => void;
  correctCount?: (items: unknown[], count: number, fromEnd?: boolean) => number;
}
