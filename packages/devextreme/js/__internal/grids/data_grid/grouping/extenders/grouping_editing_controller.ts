import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { EditingController } from '@ts/grids/grid_core/editing/m_editing';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

import type { GroupItem } from '../types';
import { isGroupRow } from '../utils';

export const groupingEditingControllerExtender = (
  Base: ModuleType<EditingController>,
): ModuleType<EditingController> => class GroupingEditingExtender extends Base {
  protected _isProcessedItem(item: RawItemData | GroupItem): boolean {
    return isGroupRow(item);
  }
};
