import type { HeaderFilterItem } from '@ts/grids/grid_core/header_filter/types';

export interface FieldChooserHeaderFilterItem extends HeaderFilterItem {
  children?: FieldChooserHeaderFilterItem[] | null;
  items?: FieldChooserHeaderFilterItem[];
}
