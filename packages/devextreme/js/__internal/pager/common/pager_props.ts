import type { EventCallback } from '../../core/r1/event_callback';
import { BasePagerDefaultProps, type BasePagerProps } from './base_pager_props';

export interface PagerProps extends BasePagerProps {
  [key: string]: unknown;
  pageSize: number;
  pageIndex: number;
  pageIndexChanged?: EventCallback<number>;
  pageSizeChanged?: EventCallback<number>;
  pageIndexChangedInternal: EventCallback<number>;
  pageSizeChangedInternal: EventCallback<number>;
}

export const PagerDefaultProps: PagerProps = {
  ...BasePagerDefaultProps,
  pageSize: 5,
  pageIndex: 1,
  pageIndexChangedInternal: () => { },
  pageSizeChangedInternal: () => { },
};
