import type { EventCallback } from '../../core/r1/event_callback';
import { BasePaginationDefaultProps, type BasePaginationProps } from './base_pagination_props';

export interface PaginationProps extends BasePaginationProps {
  [key: string]: unknown;
  pageSize: number;
  pageIndex: number;
  pageIndexChanged?: EventCallback<number>;
  pageSizeChanged?: EventCallback<number>;
  pageIndexChangedInternal: EventCallback<number>;
  pageSizeChangedInternal: EventCallback<number>;
}

export const PaginationDefaultProps: PaginationProps = {
  ...BasePaginationDefaultProps,
  pageSize: 5,
  pageIndex: 1,
  pageIndexChangedInternal: () => { },
  pageSizeChangedInternal: () => { },
};
