import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { FieldChooserField } from '@ts/grids/pivot_grid/field_chooser/const';

import { CLASSES, DIV } from './const';

export const renderGroupConnector = (
  field: FieldChooserField,
  nextField: FieldChooserField | undefined,
  prevField: FieldChooserField | undefined,
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
