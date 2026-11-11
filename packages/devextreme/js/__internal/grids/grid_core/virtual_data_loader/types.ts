import type { DeferredObj } from '@js/core/utils/deferred';
import type { ChangedEvent } from '@ts/grids/grid_core/data_source_adapter/types';

/** How many virtual (not loaded) items sit before and after the loaded window. */
export interface VirtualItemsCount {
  begin: number;
  end: number;
}

export type ItemSizes = Record<number, number>;

export interface VirtualDataLoaderCacheItem {
  pageIndex: number;
  itemsLength: number;
  itemsCount: number;
}

export interface ProcessedChange<TItem = unknown> {
  changeType: 'append' | 'prepend';
  items: TItem[];
  removeCount?: number;
}

export interface DelayedChange {
  isDelayed: boolean;
}

export type VirtualDataLoaderChange<TItem = unknown> = ProcessedChange<TItem>
| ChangedEvent
| DelayedChange;

export type ChangedCallback<TItem = unknown> = (change?: VirtualDataLoaderChange<TItem>) => void;

/** Gets only the loader's own changes: no adapter event is passed on */
export type LoaderChangedCallback<TItem = unknown> = (
  change?: ProcessedChange<TItem> | DelayedChange,
) => void;

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
  getItemSizes: () => ItemSizes;
  _setViewportPositionCore: (position: number) => void;
}

export interface VirtualDataLoaderDataOptions<TItem = unknown> {
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
  items: (isBase?: boolean) => TItem[];
  viewportItems: (items?: TItem[]) => TItem[];
  updateLoading: () => void;
  onChanged: (e: { changeType: 'pageIndex' }) => void;
  correctCount?: (items: TItem[], count: number, fromEnd?: boolean) => number;
}
