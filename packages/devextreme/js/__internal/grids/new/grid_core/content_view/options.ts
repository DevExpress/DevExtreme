import messageLocalization from '@js/localization/message';
import type { BaseContentViewOptions as Options } from '@js/ui/card_view';

export type { Options };

export const defaultOptions = {
  errorRowEnabled: true,
  noDataText: messageLocalization.format('dxDataGrid-noDataText'),
} satisfies Options;
