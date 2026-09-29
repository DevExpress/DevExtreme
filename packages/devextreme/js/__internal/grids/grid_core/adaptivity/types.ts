import type { DataController } from '../data_controller/data_controller';
import type { RowKey } from '../m_types';

export interface AdaptivityDataController extends DataController {
  getAdaptiveExpandedKey: () => RowKey | undefined;
  setAdaptiveExpandedKey: (key: RowKey) => void;
  toggleExpandAdaptiveDetailRow: (key?: RowKey, alwaysExpanded?: boolean) => void;
}

export interface AdaptiveDetailRowTarget {
  key: RowKey | undefined;
  rowIndex: number;
}
