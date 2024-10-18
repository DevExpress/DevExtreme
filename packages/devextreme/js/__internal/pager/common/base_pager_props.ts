import type { DisplayMode } from '@js/common';
import type { PageSize } from '@js/ui/pagination_types';

import messageLocalization from '../../../localization/message';
import type { EventCallback } from '../../core/r1/event_callback';
import { BaseWidgetDefaultProps, type BaseWidgetProps } from '../base_props';

export interface BasePagerProps extends BaseWidgetProps {
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
  showPageSizeSelector?: boolean;
  allowedPageSizes: (number | PageSize)[];
  rtlEnabled?: boolean;
  showNavigationButtons?: boolean;
  itemCount?: number;
  label?: string;
  onKeyDown?: EventCallback<Event>;
}

export const BasePagerDefaultProps: BasePagerProps = {
  ...BaseWidgetDefaultProps,
  isGridCompatibilityMode: false,
  showInfo: false,
  displayMode: 'adaptive',
  maxPagesCount: 10,
  pageCount: 1,
  visible: true,
  hasKnownLastPage: true,
  pagesNavigatorVisible: 'auto',
  showPageSizeSelector: true,
  allowedPageSizes: [5, 10],
  showNavigationButtons: false,
  itemCount: 1,
  label: messageLocalization.format('dxPagination-ariaLabel'),
};
