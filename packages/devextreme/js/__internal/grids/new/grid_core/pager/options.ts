import type { Mode } from '@js/common';
import messageLocalization from '@js/localization/message';
import type { PagerConfiguration as Options } from '@js/ui/card_view';

export type PageSize = number | 'all';

export type PageSizes = PageSize[] | Mode;

export type PagerVisible = boolean | Mode;

export type { Options };

export const defaultOptions = {
  pager: {
    visible: 'auto',
    showPageSizeSelector: false,
    allowedPageSizes: 'auto',
    label: messageLocalization.format('dxPager-ariaLabel'),
  },
} satisfies Options;
