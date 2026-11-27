import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { PivotGridPreparedField } from '@ts/grids/pivot_grid/types';

import { CLASSES, DIV } from './const';

export const renderGroupConnector = (
  field: PivotGridPreparedField,
  nextField: PivotGridPreparedField | undefined,
  prevField: PivotGridPreparedField | undefined,
  $container: dxElementWrapper,
): void => {
  if (prevField?.groupName && prevField.groupName === field.groupName) {
    $(DIV)
      .addClass(CLASSES.groupConnector)
      .addClass(CLASSES.groupConnectorPrev)
      .appendTo($container);
  }

  if (nextField?.groupName && nextField.groupName === field.groupName) {
    $(DIV)
      .addClass(CLASSES.groupConnector)
      .addClass(CLASSES.groupConnectorNext)
      .appendTo($container);
  }
};
