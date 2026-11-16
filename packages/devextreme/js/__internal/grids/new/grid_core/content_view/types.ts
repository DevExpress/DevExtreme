import type dxScrollable from '@js/ui/scroll_view/ui.scrollable';

export interface ContentViewPublicMethods {
  getScrollable: () => dxScrollable;
  beginCustomLoading: (text?: string) => void;
  endCustomLoading: () => void;
}
