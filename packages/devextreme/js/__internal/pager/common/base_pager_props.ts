import messageLocalization from '../../../localization/message';
import type { EventCallback } from '../../core/r1/event_callback';

export type DisplayMode = 'adaptive' | 'compact' | 'full';

export interface BasePagerProps {
  gridCompatibility: boolean;
  className?: string;
  showInfo?: boolean;
  infoText?: string;
  lightModeEnabled?: boolean;
  displayMode: DisplayMode;
  maxPagesCount: number;
  pageCount: number;
  pagesCountText?: string;
  visible?: boolean;
  hasKnownLastPage?: boolean;
  pagesNavigatorVisible?: boolean | 'auto';
  showPageSizes?: boolean;
  pageSizes: (number | 'all')[];
  rtlEnabled?: boolean;
  showNavigationButtons: boolean;
  totalCount?: number;
  label: string;
  onKeyDown?: EventCallback<Event>;
}

export const BasePagerDefaultProps: BasePagerProps = {
  gridCompatibility: true,
  showInfo: false,
  displayMode: 'adaptive',
  maxPagesCount: 10,
  pageCount: 10,
  visible: true,
  hasKnownLastPage: true,
  pagesNavigatorVisible: 'auto',
  showPageSizes: true,
  pageSizes: [5, 10],
  showNavigationButtons: false,
  totalCount: 0,
  label: messageLocalization.format('dxPager-ariaLabel'),
};
