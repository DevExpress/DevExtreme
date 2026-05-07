import type { DisplayMode } from '@js/common';
import type { PageSize } from '@js/ui/pagination_types';
import { BaseWidgetDefaultProps, type BaseWidgetProps } from '@ts/core/r1/base_props';

import type { EventCallback } from '../../core/r1/event_callback';

export interface BasePaginationProps extends BaseWidgetProps {
  isGridCompatibilityMode?: boolean;
  className?: string;
  showInfo?: boolean;
  infoText?: string;
  lightModeEnabled?: boolean;
  displayMode?: DisplayMode;
  maxPagesCount: number;
  pageCount: number;
  pagesCountText?: string;
  visible?: boolean;
  hasKnownLastPage?: boolean;
  pagesNavigatorVisible?: boolean | 'auto';
  showPageSizeSelector?: boolean | 'auto';
  allowedPageSizes: (number | PageSize)[];
  rtlEnabled?: boolean;
  showNavigationButtons?: boolean;
  itemCount?: number;
  label?: string;
  onKeyDown?: EventCallback<Event>;
}

export const BasePaginationDefaultProps: BasePaginationProps = {
  ...BaseWidgetDefaultProps,
  isGridCompatibilityMode: false,
  showInfo: false,
  displayMode: 'adaptive',
  maxPagesCount: 10,
  pageCount: 1,
  visible: true,
  hasKnownLastPage: true,
  pagesNavigatorVisible: 'auto',
  showPageSizeSelector: 'auto',
  allowedPageSizes: [5, 10],
  showNavigationButtons: false,
  itemCount: 1,
  label: undefined,
};
