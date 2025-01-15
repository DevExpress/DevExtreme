import PagerWidget from '@js/ui/pagination';

import { InfernoWrapper } from './widget_wrapper';

// TODO: remove when public .d.ts for pager is created
export interface PagerProps {
  pageIndex?: number;
  pageSize?: number;

  pageIndexChanged?: (value: number) => void;
  pageSizeChanged?: (value: number) => void;

  isGridCompatibility?: boolean;

  pageSizes?: number[];

  pageCount?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Pager extends InfernoWrapper<PagerProps, any> {
  protected getComponentFabric(): typeof PagerWidget {
    return PagerWidget;
  }
}
