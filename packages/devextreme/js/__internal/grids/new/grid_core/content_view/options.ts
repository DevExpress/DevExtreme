import type { ScrollingBase } from '@js/common/grids';
import messageLocalization from '@js/localization/message';
import type { Properties as LoadPanelProps } from '@js/ui/load_panel';
import type { Template } from '@ts/grids/new/grid_core/types';

export interface Options {
  scrolling?: Pick<ScrollingBase, 'scrollByContent' | 'scrollByThumb' | 'showScrollbar' | 'useNative'>;

  errorRowEnabled?: boolean;

  loadPanel?: LoadPanelProps;

  noDataText?: string;

  noDataTemplate?: Template<{ text: string }>;
}

export const defaultOptions = {
  errorRowEnabled: true,
  noDataText: messageLocalization.format('dxDataGrid-noDataText'),
} satisfies Options;
