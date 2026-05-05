import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Item } from '@js/ui/toolbar';
import type Widget from '@ts/core/widget/widget';
import type { ListBase } from '@ts/ui/list/list.base';

import type Toolbar from './toolbar';

const BUTTON_GROUP_CLASS = 'dx-buttongroup';
const TOOLBAR_ITEMS = ['dxAutocomplete', 'dxButton', 'dxCheckBox', 'dxDateBox', 'dxMenu', 'dxSelectBox', 'dxTabs', 'dxTextBox', 'dxButtonGroup', 'dxDropDownButton'];

const getItemInstance = ($element: dxElementWrapper): Widget => {
  // @ts-expect-error ts-error
  const itemData = $element?.data();
  // @ts-expect-error ts-error
  const dxComponents = itemData?.dxComponents;
  const widgetName = dxComponents?.[0];

  return (widgetName && itemData[widgetName]) as Widget;
};

/**
 * Resolves the focusable DOM element for a toolbar item widget.
 * Returns undefined for non-widget items (templates, separators, labels).
 */
export function resolveItemFocusTarget(
  $item: dxElementWrapper,
  itemData: Item,
): dxElementWrapper | undefined {
  const { widget } = itemData;

  if (!widget || !TOOLBAR_ITEMS.includes(widget)) {
    return undefined;
  }

  const $widget = $item.find(widget.toLowerCase().replace('dx', '.dx-'));
  if (!$widget.length) {
    return undefined;
  }

  const itemInstance = getItemInstance($widget);
  if (!itemInstance) {
    return undefined;
  }

  let $focusTarget = itemInstance._focusTarget?.();

  if (widget === 'dxDropDownButton') {
    $focusTarget = $focusTarget?.find(`.${BUTTON_GROUP_CLASS}`);
  } else {
    $focusTarget = $focusTarget ?? $(itemInstance.element());
  }

  return $focusTarget?.length ? $focusTarget : undefined;
}

export function toggleItemFocusableElementTabIndex(
  context: Toolbar | ListBase | undefined,
  item: Item,
): void {
  if (!context) return;

  const $item = context._findItemElementByItem(item);
  if (!$item.length) {
    return;
  }

  const itemData = context._getItemData($item);
  const isItemNotFocusable = !!(itemData.options?.disabled || itemData.disabled || context.option('disabled'));

  const $focusTarget = resolveItemFocusTarget($item, itemData);
  if (!$focusTarget) {
    return;
  }

  const tabIndex = itemData.options?.tabIndex;
  if (isItemNotFocusable) {
    $focusTarget.attr('tabIndex', -1);
  } else {
    $focusTarget.attr('tabIndex', tabIndex ?? 0);
  }
}
