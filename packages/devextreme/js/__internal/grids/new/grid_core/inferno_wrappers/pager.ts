import PagerWidget from '@js/ui/pager';

import { createWidgetWrapper } from './widget_wrapper';

// TODO: remove when public .d.ts for pager is created
interface PagerProps {
  pageIndex?: number;
  pageSize?: number;

  pageIndexChange?: (value: number) => void;
  pageSizeChange?: (value: number) => void;

  gridCompatibility?: boolean;

  pageSizes?: number[];

  pageCount?: number;
}

export const Pager = createWidgetWrapper<PagerProps, any>(PagerWidget);
