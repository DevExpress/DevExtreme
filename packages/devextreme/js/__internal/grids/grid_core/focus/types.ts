import type { Callback } from '@js/core/utils/callbacks';

import type { DataChange } from '../data_controller/types';

export interface FocusDataControllerExtension {
  _updatePageIndexes: () => void;
  afterChanged: Callback<[DataChange]>;
  getLastChange: () => DataChange | undefined;
}
