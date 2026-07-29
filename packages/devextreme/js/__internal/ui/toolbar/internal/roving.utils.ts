import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type Widget from '@ts/core/widget/widget';
import { DISABLED_STATE_CLASS, type SupportedKeys, WIDGET_CLASS } from '@ts/core/widget/widget';
import { OVERLAY_STACK } from '@ts/ui/overlay/overlay';
import {
  DROP_DOWN_MENU_BUTTON_CLASS,
  MENU_CLASS,
  NATIVE_FOCUSABLE_SELECTOR,
  TEXTEDITOR_CLASS,
  TEXTEDITOR_INPUT_CLASS,
  TOOLBAR_COMPONENTS_SELECTOR,
} from '@ts/ui/toolbar/constants';
import type { RovingTabIndexHost } from '@ts/ui/toolbar/internal/keyboard.navigation';
import { getItemComponentInstance, getItemFocusTarget } from '@ts/ui/toolbar/toolbar.utils';

function getChildComponentOpened(instance: Widget | undefined): boolean {
  return !!instance?.option('opened');
}

function isTextEditingElement(target: HTMLElement): boolean {
  if (target.isContentEditable) {
    return true;
  }
  const tagName = target.tagName.toLowerCase();
  if (tagName === 'textarea') {
    return true;
  }
  if (tagName === 'input') {
    const { type } = target as HTMLInputElement;
    return type !== 'checkbox' && type !== 'radio' && type !== 'button' && type !== 'submit';
  }
  return false;
}

function isItemDisabled($item: dxElementWrapper, hostDisabledState: boolean): boolean {
  if (hostDisabledState) {
    return true;
  }
  if ($item.hasClass(DISABLED_STATE_CLASS)) {
    return true;
  }
  const $component = $item.find(`.${WIDGET_CLASS}`).first();
  return $component.length > 0 && $component.hasClass(DISABLED_STATE_CLASS);
}

export function focusElement($el: dxElementWrapper | undefined): void {
  const element = $el?.get(0);
  if (element instanceof HTMLElement) {
    element.focus();
  }
}

export function closeItemComponent($item: dxElementWrapper): boolean {
  const itemInstance = getItemComponentInstance($item);
  if (!itemInstance) {
    return false;
  }

  if (!getChildComponentOpened(itemInstance)) {
    return false;
  }

  itemInstance.option('opened', false);
  return true;
}

export function isItemComponentOpened($item: dxElementWrapper): boolean {
  return getChildComponentOpened(getItemComponentInstance($item));
}

export function isFocusOnItemAnchor($item: dxElementWrapper, target: HTMLElement): boolean {
  if (isTextEditingElement(target)) {
    return false;
  }
  const anchor = getItemFocusTarget($item)?.get(0);
  if (!anchor) {
    return true;
  }
  return anchor === target || !anchor.contains(target);
}

export function getPlainItemFocusTargets($item: dxElementWrapper): dxElementWrapper {
  if ($item.hasClass(DROP_DOWN_MENU_BUTTON_CLASS)) {
    return $();
  }

  const $components = $item.find(TOOLBAR_COMPONENTS_SELECTOR);
  if ($components.length) {
    return $();
  }

  return $item.find(NATIVE_FOCUSABLE_SELECTOR);
}

export function applyItemTabIndex($item: dxElementWrapper, tabIndex: number): void {
  const $focusTarget = getItemFocusTarget($item);
  if (!$focusTarget?.length) {
    return;
  }

  const $plainTargets = getPlainItemFocusTargets($item);
  if ($plainTargets.length > 1) {
    $plainTargets.attr('tabIndex', -1);
  }

  $focusTarget.attr('tabIndex', tabIndex);

  if ($focusTarget.hasClass(TEXTEDITOR_CLASS)) {
    $focusTarget.find(`.${TEXTEDITOR_INPUT_CLASS}`).attr('tabIndex', -1);
  }

  const $menu = $item.find(`.${MENU_CLASS}`);
  if ($menu.length) {
    $menu.attr('tabIndex', -1);
    $menu.find('[tabindex]').attr('tabIndex', -1);
  }
}

export function wrapSpaceKey(keys: SupportedKeys): void {
  const originalSpace = keys.space;
  if (!originalSpace) {
    return;
  }

  keys.space = (e, options): ReturnType<typeof originalSpace> => {
    if (isTextEditingElement(e.target as HTMLElement)) {
      return undefined;
    }
    return originalSpace(e, options);
  };
}

const ROVING_NAVIGATION_KEYS = [
  'leftArrow',
  'rightArrow',
  'upArrow',
  'downArrow',
  'home',
  'end',
] as const;

export function releaseNavigationKeys(keys: SupportedKeys): void {
  ROVING_NAVIGATION_KEYS.forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete keys[key];
  });
}

export function getAvailableItems(
  $visibleItems: dxElementWrapper,
  hostDisabledState: boolean,
  resolveFocusTarget: ($item: dxElementWrapper) => dxElementWrapper | undefined,
): dxElementWrapper {
  const elements = $visibleItems.toArray().filter(
    (item) => !isItemDisabled($(item), hostDisabledState)
      && !!resolveFocusTarget($(item))?.length,
  );

  return $(elements) as unknown as dxElementWrapper;
}

export function focusItemFocusTarget($item: dxElementWrapper): void {
  focusElement(getItemFocusTarget($item));
}

export function handleMenuActivation(
  $focused: dxElementWrapper,
  e: KeyboardEvent,
): void {
  if (!$focused.length || isItemComponentOpened($focused)) {
    return;
  }

  const $menu = $focused.find(`.${MENU_CLASS}`).first();
  if ($menu.length) {
    e.preventDefault();
    e.stopPropagation();
    focusElement($menu);
  }
}

export function beforeRovingMoveFocus(host: RovingTabIndexHost): void {
  const $prev = $(host.option().focusedElement);
  if ($prev.length) {
    closeItemComponent($prev);
  }
}

export function afterRovingMoveFocus(host: RovingTabIndexHost): void {
  const $focused = $(host.option().focusedElement);
  if ($focused.length) {
    focusItemFocusTarget($focused);
  }
}

export function isElementInOverlayContent(element: Element | null | undefined): boolean {
  if (!element) {
    return false;
  }
  return OVERLAY_STACK.some((overlay) => !!overlay.$content()?.get(0)?.contains(element));
}
