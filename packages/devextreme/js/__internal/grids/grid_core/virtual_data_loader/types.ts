import type { DeferredObj } from '@js/core/utils/deferred';

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

export type ChangedCallback = (args?: unknown) => void;

export interface ProcessedChange {
  changeType?: unknown;
  items?: unknown[];
  removeCount?: number;
}

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
  virtualItemsCount: () => VirtualItemsCount;
  getItemSizes: () => number[];
  _setViewportPositionCore: (position: number) => void;
}

export interface VirtualDataLoaderDataOptions {
  pageSize: () => number;
  pageIndex: (pageIndex?: number) => number;
  pageCount: () => number;
  totalItemsCount: () => number;
  itemsCount: () => number;
  isLoading: () => boolean;
  hasKnownLastPage: () => boolean;
  load: () => DeferredObj<unknown>;
  items: (isBase?: boolean) => unknown[];
  viewportItems: (items?: unknown[]) => unknown[];
  updateLoading: () => void;
  onChanged: (e: { changeType: string }) => void;
  correctCount?: (items: unknown[], count: number, fromEnd?: boolean) => number;
}
