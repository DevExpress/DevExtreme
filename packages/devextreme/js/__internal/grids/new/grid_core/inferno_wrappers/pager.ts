import PagerWidget from '@js/ui/pager';

import { InfernoWrapper } from './widget_wrapper';

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

export class Pager extends InfernoWrapper<PagerProps, any> {
  // @ts-expect-error
  protected getComponentFabric(): typeof PagerWidget {
    return PagerWidget;
  }
}
