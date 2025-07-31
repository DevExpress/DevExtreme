import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { TemplatesInfo } from '@ts/ui/form/form.layout_manager';

export const FIELD_EMPTY_ITEM_CLASS = 'dx-field-empty-item';

export function renderEmptyItem(info: TemplatesInfo): dxElementWrapper {
  const { $parent, rootElementCssClassList } = info;

  return $('<div>')
    .addClass(FIELD_EMPTY_ITEM_CLASS)
    .html('&nbsp;')
    .addClass(rootElementCssClassList.join(' '))
    .appendTo($parent);
}
