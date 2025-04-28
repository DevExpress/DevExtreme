import type { Mode } from '@js/common';
import messageLocalization from '@js/localization/message';
import type { PagerBase } from '@js/ui/pagination';

export type PageSize = number | 'all';

export type PageSizes = PageSize[] | Mode;

export type PagerVisible = boolean | Mode;

export interface PagerOptions extends PagerBase {
  allowedPageSizes?: PageSizes;
  visible?: PagerVisible;
}

export interface Options {
  pager?: PagerOptions;
}

export const defaultOptions = {
  pager: {
    visible: 'auto',
    showPageSizeSelector: false,
    allowedPageSizes: 'auto',
    label: messageLocalization.format('dxPager-ariaLabel'),
  },
} satisfies Options;
