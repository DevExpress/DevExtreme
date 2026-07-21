import type { ScrollEventInfo } from '@js/ui/scroll_view/ui.scrollable';
import type dxScrollable from '@js/ui/scroll_view/ui.scrollable';

export type RowsViewScrollEvent = Partial<ScrollEventInfo<dxScrollable>> & {
  component: dxScrollable;
  forceUpdateScrollPosition?: boolean;
};
