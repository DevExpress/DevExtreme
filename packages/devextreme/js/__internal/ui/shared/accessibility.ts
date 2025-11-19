import eventsEngine from '@js/common/core/events/core/events_engine';
import { normalizeKeyName } from '@js/common/core/events/utils/index';
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';

const FOCUS_STATE_CLASS = 'dx-state-focused';
const FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
const FOCUSED_ROW_SELECTOR = '.dx-row-focused';
const GRID_ROW_SELECTOR = '.dx-datagrid-rowsview .dx-row';
const GRID_CELL_SELECTOR = `${GRID_ROW_SELECTOR} > td`;
const TREELIST_ROW_SELECTOR = '.dx-treelist-rowsview .dx-row';
const TREELIST_CELL_SELECTOR = `${TREELIST_ROW_SELECTOR} > td`;
const viewItemSelectorMap = {
  groupPanel: ['.dx-datagrid-group-panel .dx-group-panel-item[tabindex]'],
  columnHeaders: ['.dx-datagrid-headers .dx-header-row > td.dx-datagrid-action', '.dx-treelist-headers .dx-header-row > td.dx-treelist-action'],
  filterRow: [
    '.dx-datagrid-headers .dx-datagrid-filter-row .dx-editor-cell .dx-texteditor-input',
    '.dx-treelist-headers .dx-treelist-filter-row .dx-editor-cell .dx-texteditor-input',
  ],
  rowsView: [
    `${FOCUSED_ROW_SELECTOR}`,
    `${GRID_ROW_SELECTOR}[tabindex]`,
    `${GRID_CELL_SELECTOR}[tabindex]`,
    `${GRID_CELL_SELECTOR}`,
    `${TREELIST_ROW_SELECTOR}[tabindex]`,
    `${TREELIST_CELL_SELECTOR}[tabindex]`,
    `${TREELIST_CELL_SELECTOR}`,
  ],
  footer: ['.dx-datagrid-total-footer .dx-datagrid-summary-item', '.dx-treelist-total-footer .dx-treelist-summary-item'],
  filterPanel: ['.dx-datagrid-filter-panel .dx-icon-filter', '.dx-treelist-filter-panel .dx-icon-filter'],
  pager: ['.dx-datagrid-pager [tabindex]', '.dx-treelist-pager [tabindex]'],
};

let isMouseDown = false;
let isHiddenFocusing = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let focusedElementInfo: any = null;
let needToSkipFocusin = false;

function getActiveAccessibleElements(ariaLabel?: string, viewElement?): dxElementWrapper {
  const $viewElement = $(viewElement);
  let $activeElements: dxElementWrapper = $();

  if (ariaLabel) {
    const escapedAriaLabel = ariaLabel?.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    $activeElements = $viewElement.find(`[aria-label="${escapedAriaLabel}"][tabindex]`);
  } else {
    $activeElements = $viewElement.find('[tabindex]');
  }

  return $activeElements;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function saveFocusedElementInfo(target, instance): void {
  const $target = $(target);
  const ariaLabel = $target.attr('aria-label');
  const $activeElements = getActiveAccessibleElements(ariaLabel, instance.element());
  const targetIndex = $activeElements.index($target);

  focusedElementInfo = extend(
    {},
    { ariaLabel, index: targetIndex },
    { viewInstance: instance },
  );
}

function fireKeyDownEvent(instance, event, executeAction): boolean {
  const args = {
    event,
    handled: false,
  };

  if (executeAction) {
    executeAction(args);
  } else {
    instance._createActionByOption('onKeyDown')(args);
  }

  return args.handled;
}

function findFocusedViewElement(
  instanceRootDomNode,
  viewSelectors,
  element,
  // @ts-expect-error ts-error
): dxElementWrapper | undefined {
  const root = instanceRootDomNode ?? element?.getRootNode() ?? domAdapter.getDocument();

  if (!root) {
    return;
  }

  const $root = $(root);

  // eslint-disable-next-line no-restricted-syntax,guard-for-in
  for (const index in viewSelectors) {
    const selector = viewSelectors[index];
    const $focusViewElement = $root.find(selector).first();

    if ($focusViewElement.length) {
      // eslint-disable-next-line consistent-return
      return $focusViewElement;
    }
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function selectView(viewName: string, instance, event): void {
  const keyName = normalizeKeyName(event);

  if (event.ctrlKey && (keyName === 'upArrow' || keyName === 'downArrow')) {
    const viewNames = Object.keys(viewItemSelectorMap);
    let viewItemIndex = viewNames.indexOf(viewName);

    const instanceRootDomNode = instance?.component?.element?.();

    while (viewItemIndex >= 0 && viewItemIndex < viewNames.length) {
      viewItemIndex += keyName === 'upArrow' ? -1 : 1;
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const viewName = viewNames[viewItemIndex];
      const viewSelectors = viewItemSelectorMap[viewName];
      const $focusViewElement = findFocusedViewElement(
        instanceRootDomNode,
        viewSelectors,
        event.target,
      );
      if ($focusViewElement?.length) {
        $focusViewElement.attr('tabindex', instance.option('tabindex') || 0);
        // @ts-expect-error ts-error
        eventsEngine.trigger($focusViewElement, 'focus');
        $focusViewElement.removeClass(FOCUS_DISABLED_CLASS);
        break;
      }
    }
  }
}

function processKeyDown(viewName, instance, event, action, $mainElement, executeKeyDown): void {
  const isHandled = fireKeyDownEvent(instance, event.originalEvent, executeKeyDown);
  if (isHandled) {
    return;
  }

  const keyName = normalizeKeyName(event);

  if (keyName === 'enter' || keyName === 'space') {
    saveFocusedElementInfo(event.target, instance);
    action?.({ event });
  } else if (keyName === 'tab') {
    $mainElement.addClass(FOCUS_STATE_CLASS);
  } else {
    selectView(viewName, instance, event);
  }
}

function onDocumentVisibilityChange(): void {
  const focusedElement = domAdapter.getActiveElement();

  needToSkipFocusin = focusedElement && !focusedElement.closest(`.${FOCUS_STATE_CLASS}`);
}

export function subscribeVisibilityChange(): void {
  eventsEngine.on(domAdapter.getDocument(), 'visibilitychange', onDocumentVisibilityChange);
}

export function unsubscribeVisibilityChange(): void {
  eventsEngine.off(domAdapter.getDocument(), 'visibilitychange', onDocumentVisibilityChange);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function hiddenFocus(element, preventScroll?: boolean): void {
  isHiddenFocusing = true;
  element.focus({ preventScroll });
  isHiddenFocusing = false;
}

export function registerKeyboardAction(
  viewName: string,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  instance,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  $element,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  selector,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  action,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  executeKeyDown?,
): () => void {
  const { useLegacyKeyboardNavigation } = instance.option();
  if (useLegacyKeyboardNavigation) {
    return noop;
  }

  const getMainElement = (): dxElementWrapper => $(instance.element());
  const keyDownHandler = (e): void => processKeyDown(
    viewName,
    instance,
    e,
    action,
    getMainElement(),
    executeKeyDown,
  );
  const mouseDownHandler = (): void => {
    isMouseDown = true;
    getMainElement().removeClass(FOCUS_STATE_CLASS);
  };
  const focusinHandler = (): void => {
    if (needToSkipFocusin) {
      needToSkipFocusin = false;
      return;
    }

    const needShowOverlay = !isMouseDown && !isHiddenFocusing;
    if (needShowOverlay) {
      getMainElement().addClass(FOCUS_STATE_CLASS);
    }
    isMouseDown = false;
  };
  const mouseUpHandler = (): void => {
    isMouseDown = false;
  };

  eventsEngine.on($element, 'keydown', selector, keyDownHandler);
  eventsEngine.on($element, 'mousedown', selector, mouseDownHandler);
  eventsEngine.on($element, 'focusin', selector, focusinHandler);
  eventsEngine.on($element, 'mouseup contextmenu', selector, mouseUpHandler);
  return (): void => {
    // @ts-expect-error ts-error
    eventsEngine.off($element, 'keydown', selector, keyDownHandler);
    // @ts-expect-error ts-error
    eventsEngine.off($element, 'mousedown', selector, mouseDownHandler);
    // @ts-expect-error ts-error
    eventsEngine.off($element, 'focusin', selector, focusinHandler);
    // @ts-expect-error ts-error
    eventsEngine.off($element, 'mouseup contextmenu', selector, mouseUpHandler);
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function restoreFocus(instance): void {
  if (!instance.option('useLegacyKeyboardNavigation') && focusedElementInfo) {
    const { viewInstance } = focusedElementInfo;
    if (viewInstance) {
      const $activeElements = getActiveAccessibleElements(
        focusedElementInfo.ariaLabel,
        viewInstance.element(),
      );
      const $targetElement = $activeElements.eq(focusedElementInfo.index);

      focusedElementInfo = null;

      // @ts-expect-error ts-error
      eventsEngine.trigger($targetElement, 'focus');
    }
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function setTabIndex(instance, $element: dxElementWrapper): void {
  const { useLegacyKeyboardNavigation } = instance.option();
  if (!useLegacyKeyboardNavigation) {
    $element.attr('tabindex', instance.option('tabindex') || 0);
  }
}
