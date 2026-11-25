import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { FieldChooserField } from '@ts/grids/pivot_grid/field_chooser/const';

import { DIV } from './const';

export const renderGroupConnector = (
  field: FieldChooserField,
  nextField: FieldChooserField | undefined,
  prevField: FieldChooserField | undefined,
  $container: dxElementWrapper,
): void => {
  if (prevField?.groupName && prevField.groupName === field.groupName) {
    $(DIV).addClass('dx-group-connector').addClass('dx-group-connector-prev').appendTo($container);
  }

  if (nextField?.groupName && nextField.groupName === field.groupName) {
    $(DIV).addClass('dx-group-connector').addClass('dx-group-connector-next').appendTo($container);
  }
};
