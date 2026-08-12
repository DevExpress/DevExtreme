import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Item } from '@js/ui/toolbar';
import { getComponentInstance } from '@ts/core/utils/m_public_component';
import type Widget from '@ts/core/widget/widget';
import { BUTTON_GROUP_CLASS } from '@ts/ui/button_group';
import {
  DROP_DOWN_MENU_BUTTON_CLASS,
  MENU_CLASS,
  NATIVE_FOCUSABLE_SELECTOR,
  TEXTEDITOR_CLASS,
  TOOLBAR_COMPONENTS_SELECTOR,
  TOOLBAR_ITEMS,
} from '@ts/ui/toolbar/constants';
import type ToolbarMenuList from '@ts/ui/toolbar/internal/toolbar.menu.list';
import type Toolbar from '@ts/ui/toolbar/toolbar';

function resolveFocusTarget(
  instance: Widget,
): dxElementWrapper | undefined {
  const $focusTarget = instance._focusTarget?.() ?? $(instance.element());
  const $buttonGroup = $focusTarget.find(`.${BUTTON_GROUP_CLASS}`).first();

  return $buttonGroup.length ? $buttonGroup : $focusTarget;
}

export function getItemComponentInstance($item: dxElementWrapper): Widget | undefined {
  const $component = $item.find(TOOLBAR_COMPONENTS_SELECTOR).first();
  return $component.length ? getComponentInstance<Widget>($component) : undefined;
}

export function getItemFocusTarget($item: dxElementWrapper): dxElementWrapper | undefined {
  if ($item.hasClass(DROP_DOWN_MENU_BUTTON_CLASS)) {
    return $item;
  }

  const $components = $item.find(TOOLBAR_COMPONENTS_SELECTOR);

  if (!$components.length) {
    const $nativeFocusable = $item.find(NATIVE_FOCUSABLE_SELECTOR).first();
    return $nativeFocusable.length ? $nativeFocusable : undefined;
  }

  const $component = $components.first();
  const itemInstance = getComponentInstance<Widget>($component);

  if (!itemInstance) {
    return undefined;
  }

  if ($component.hasClass(MENU_CLASS)) {
    return $item;
  }
  if ($component.hasClass(TEXTEDITOR_CLASS)) {
    return $(itemInstance.element());
  }

  return resolveFocusTarget(itemInstance);
}

export function toggleItemFocusableElementTabIndex(
  context: Toolbar | ToolbarMenuList | undefined,
  item: Item,
): void {
  if (!context) return;

  const $item = context._findItemElementByItem(item);
  if (!$item.length) {
    return;
  }

  const itemData = context._getItemData($item);
  const { disabled } = context.option();
  const isItemNotFocusable = !!(itemData.options?.disabled || itemData.disabled || disabled);

  const { widget } = itemData;

  if (widget && TOOLBAR_ITEMS.includes(widget)) {
    const $component = $item.find(widget.toLowerCase().replace('dx', '.dx-'));
    if ($component.length) {
      const itemInstance = getComponentInstance<Widget>($component);

      if (!itemInstance) {
        return;
      }

      const $focusTarget = resolveFocusTarget(itemInstance);

      const tabIndex = itemData.options?.tabIndex;
      $focusTarget?.attr('tabIndex', isItemNotFocusable ? -1 : (tabIndex ?? 0));
    }
  }
}
