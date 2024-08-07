import type { EventCallback } from '../../core/r1/event_callback';
import { BasePagerDefaultProps, type BasePagerProps } from './base_pager_props';

export interface PagerProps extends BasePagerProps {
  [key: string]: unknown;
  pageSize: number;
  pageIndex: number;
  pageIndexChange: EventCallback<number>;
  pageSizeChange: EventCallback<number>;
}

export const PagerDefaultProps: PagerProps = {
  ...BasePagerDefaultProps,
  pageSize: 5,
  pageIndex: 1,
  pageIndexChange: () => { },
  pageSizeChange: () => { },
};
