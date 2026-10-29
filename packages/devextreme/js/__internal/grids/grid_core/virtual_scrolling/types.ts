export interface ChangedLoadParams {
  pageIndex: number;
  loadPageCount: number;
}

export interface VirtualScrollingResizingControllerExtension {
  hasResizeTimeout: () => boolean;
}
