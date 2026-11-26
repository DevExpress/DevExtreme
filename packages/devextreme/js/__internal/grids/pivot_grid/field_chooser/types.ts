import type { ApplyChangesMode } from '@js/common/grids';
import type { DxEvent } from '@js/events';
import type { Properties as FieldChooserProperties } from '@js/ui/pivot_grid_field_chooser';
import type { WidgetProperties } from '@ts/core/widget/widget';
import type { HeaderFilterItem, HeaderFilterViewOptions } from '@ts/grids/grid_core/header_filter/types';

import type { PivotGridDataSource } from '../data_source/data_source';
import type { DataSourceState } from '../data_source/types';
import type { RovingTabIndex } from '../keyboard_navigation/roving_tab_index';
import type { PivotGridField } from '../types';
import type { FieldChooserBase } from './field_chooser_base';

export interface FieldChooserHeaderFilterItem extends HeaderFilterItem {
  children?: FieldChooserHeaderFilterItem[] | null;
  items?: FieldChooserHeaderFilterItem[];
}

/** currentTarget is the field element that matched the delegated selector. */
export type FieldChooserFieldEvent<TNativeEvent extends Event = Event> = DxEvent<TNativeEvent> & {
  currentTarget: HTMLElement;
};

/** The copy of a field that the header filter gets as its options. */
export type FieldChooserHeaderFilterField = Omit<PivotGridField, 'selector'>
  & Pick<HeaderFilterViewOptions, 'selector'>
  & { index: number };

export interface FieldChooserBaseProperties extends WidgetProperties<FieldChooserBase> {
  dataSource?: PivotGridDataSource | null;
  allowFieldDragging: boolean;
  applyChangesMode: ApplyChangesMode;
  state?: Partial<DataSourceState> | null;
  onFieldContextMenuKeyDown: (
    (e: DxEvent<KeyboardEvent>, navigation: RovingTabIndex) => void
  ) | null;
  headerFilter: FieldChooserProperties['headerFilter'];
  remoteSort: boolean;
  encodeHtml?: boolean;
}
