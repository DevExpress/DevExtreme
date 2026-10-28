import type { dxElementWrapper } from '@js/core/renderer';
import type { VirtualDataLoaderDataOptions } from '@ts/grids/grid_core/virtual_data_loader/types';
import type Scrollable from '@ts/ui/scroll_view/scrollable';

export interface ChangedLoadParams {
  pageIndex: number;
  loadPageCount: number;
}

export interface VirtualScrollingResizingControllerExtension {
  hasResizeTimeout: () => boolean;
}

export interface ViewportParams {
  skip: number;
  take: number;
}

export interface VirtualScrollDataOptions extends VirtualDataLoaderDataOptions {
  changingDuration: () => number;
  loadedOffset?: () => number;
  loadedItemCount?: () => number;
  renderedItemsRange?: () => ViewportParams | undefined;
}

export type ExternalScrollable = Scrollable | dxElementWrapper;

export interface ScrollEventsStrategy {
  on: (scrollable: ExternalScrollable, eventName: string, handler: () => void) => void;
  off: (scrollable: ExternalScrollable, eventName: string, handler: () => void) => void;
}

export interface ExternalScrollers {
  scrollTo: (position: number) => void;
  dispose: () => void;
}
