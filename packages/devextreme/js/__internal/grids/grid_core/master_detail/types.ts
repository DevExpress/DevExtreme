import type { dxElementWrapper } from '@js/core/renderer';

import type { RowRenderOptions, ViewRow } from '../views/types';

export interface MasterDetailRowsViewExtension {
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  renderMasterDetailCell(
    $row: dxElementWrapper,
    row: ViewRow,
    options: RowRenderOptions,
  ): dxElementWrapper;
}
