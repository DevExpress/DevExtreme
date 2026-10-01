import type { dxElementWrapper } from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import type { ScrollEventInfo } from '@js/ui/scroll_view/ui.scrollable';
import type dxScrollable from '@js/ui/scroll_view/ui.scrollable';

export type RowsViewScrollEvent = Partial<ScrollEventInfo<dxScrollable>> & {
  component: dxScrollable;
  scrollOffset: { top: number; left: number };
  forceUpdateScrollPosition?: boolean;
};

export type ColumnWidth = number | string | undefined;

export interface ColumnViewTemplateOptions {
  container: dxElementWrapper;
  model: unknown;
  deferred?: DeferredObj<unknown>;
  onRendered?: () => void;
  change?: unknown;
}

export interface ColumnViewTemplate {
  allowRenderToDetachedContainer?: boolean;
  render: (options: ColumnViewTemplateOptions) => void;
}
