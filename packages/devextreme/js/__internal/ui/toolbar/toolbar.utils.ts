import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Item } from '@js/ui/toolbar';
import type Widget from '@ts/core/widget/widget';
import type { ListBase } from '@ts/ui/list/list.base';

import type Toolbar from './toolbar';

const BUTTON_GROUP_CLASS = 'dx-buttongroup';
const TOOLBAR_ITEMS = ['dxAutocomplete', 'dxButton', 'dxCheckBox', 'dxDateBox', 'dxMenu', 'dxSelectBox', 'dxTabs', 'dxTextBox', 'dxButtonGroup', 'dxDropDownButton'];

/**
 * CSS selector for keyboard-focusable elements inside template item containers.
 * Used to manage tabindex of inner elements so they don't appear in the global
 * Tab sequence while the toolbar is in toolbar-navigation mode.
 */
export const TEMPLATE_FOCUSABLE_SELECTOR = [
  'input:not([disabled])',
  'button:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
].join(', ');

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

  if (widget && TOOLBAR_ITEMS.includes(widget)) {
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

  // Template / custom items: use .dx-item-content as the focus target when the
  // template contains at least one keyboard-focusable descendant.
  const $content = $item.find('.dx-item-content').first();
  if ($content.length && $content.find(TEMPLATE_FOCUSABLE_SELECTOR).length > 0) {
    return $content;
  }

  return undefined;
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
