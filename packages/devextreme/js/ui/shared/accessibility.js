import $ from '../../core/renderer';
import eventsEngine from '../../common/core/events/core/events_engine';
import { normalizeKeyName } from '../../common/core/events/utils/index';
import { extend } from '../../core/utils/extend';
import domAdapter from '../../core/dom_adapter';
import { noop } from '../../core/utils/common';

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
        '.dx-treelist-headers .dx-treelist-filter-row .dx-editor-cell .dx-texteditor-input'
    ],
    rowsView: [
        `${FOCUSED_ROW_SELECTOR}`,
        `${GRID_ROW_SELECTOR}[tabindex]`,
        `${GRID_CELL_SELECTOR}[tabindex]`,
        `${GRID_CELL_SELECTOR}`,
        `${TREELIST_ROW_SELECTOR}[tabindex]`,
        `${TREELIST_CELL_SELECTOR}[tabindex]`,
        `${TREELIST_CELL_SELECTOR}`
    ],
    footer: ['.dx-datagrid-total-footer .dx-datagrid-summary-item', '.dx-treelist-total-footer .dx-treelist-summary-item'],
    filterPanel: ['.dx-datagrid-filter-panel .dx-icon-filter', '.dx-treelist-filter-panel .dx-icon-filter'],
    pager: ['.dx-datagrid-pager [tabindex]', '.dx-treelist-pager [tabindex]']
};

let isMouseDown = false;
let isHiddenFocusing = false;
let focusedElementInfo = null;

function processKeyDown(viewName, instance, event, action, $mainElement, executeKeyDown) {
    const isHandled = fireKeyDownEvent(instance, event.originalEvent, executeKeyDown);
    if(isHandled) {
        return;
    }

    const keyName = normalizeKeyName(event);

    if(keyName === 'enter' || keyName === 'space') {
        saveFocusedElementInfo(event.target, instance);
        action && action({ event: event });
    } else if(keyName === 'tab') {
        $mainElement.addClass(FOCUS_STATE_CLASS);
    } else {
        selectView(viewName, instance, event);
    }
}

export function saveFocusedElementInfo(target, instance) {
    const $target = $(target);
    const ariaLabel = $target.attr('aria-label');
    const $activeElements = getActiveAccessibleElements(ariaLabel, instance.element());
    const targetIndex = $activeElements.index($target);

    focusedElementInfo = extend({},
        { ariaLabel: ariaLabel, index: targetIndex },
        { viewInstance: instance });
}

function getActiveAccessibleElements(ariaLabel, viewElement) {
    const $viewElement = $(viewElement);
    let $activeElements;

    if(ariaLabel) {
        const escapedAriaLabel = ariaLabel?.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        $activeElements = $viewElement.find(`[aria-label="${escapedAriaLabel}"][tabindex]`);
    } else {
        $activeElements = $viewElement.find('[tabindex]');
    }

    return $activeElements;
}

function findFocusedViewElement(viewSelectors, element) {
    const root = element?.getRootNode() || domAdapter.getDocument();

    for(const index in viewSelectors) {
        const selector = viewSelectors[index];
        const $focusViewElement = $(root).find(selector).first();

        if($focusViewElement.length) {
            return $focusViewElement;
        }
    }
}

function fireKeyDownEvent(instance, event, executeAction) {
    const args = {
        event: event,
        handled: false
    };

    if(executeAction) {
        executeAction(args);
    } else {
        instance._createActionByOption('onKeyDown')(args);
    }

    return args.handled;
}

function onDocumentVisibilityChange() {
    isHiddenFocusing = domAdapter.getDocument().visibilityState === 'visible';
}

export function subscribeVisibilityChange() {
    eventsEngine.on(domAdapter.getDocument(), 'visibilitychange', onDocumentVisibilityChange);
}

export function unsubscribeVisibilityChange() {
    eventsEngine.off(domAdapter.getDocument(), 'visibilitychange', onDocumentVisibilityChange);
}

export function hiddenFocus(element, preventScroll) {
    isHiddenFocusing = true;
    element.focus({ preventScroll });
    isHiddenFocusing = false;
}

export function registerKeyboardAction(viewName, instance, $element, selector, action, executeKeyDown) {
    if(instance.option('useLegacyKeyboardNavigation')) {
        return noop;
    }

    const getMainElement = () => $(instance.element());
    const keyDownHandler = e => processKeyDown(viewName, instance, e, action, getMainElement(), executeKeyDown);
    const mouseDownHandler = () => {
        isMouseDown = true;
        getMainElement().removeClass(FOCUS_STATE_CLASS);
    };
    const focusinHandler = () => {
        const needShowOverlay = !isMouseDown && !isHiddenFocusing;
        if(needShowOverlay) {
            getMainElement().addClass(FOCUS_STATE_CLASS);
        }
        isMouseDown = false;
    };

    eventsEngine.on($element, 'keydown', selector, keyDownHandler);
    eventsEngine.on($element, 'mousedown', selector, mouseDownHandler);
    eventsEngine.on($element, 'focusin', selector, focusinHandler);
    return () => {
        eventsEngine.off($element, 'keydown', selector, keyDownHandler);
        eventsEngine.off($element, 'mousedown', selector, mouseDownHandler);
        eventsEngine.off($element, 'focusin', selector, focusinHandler);
    };
}

export function restoreFocus(instance) {
    if(!instance.option('useLegacyKeyboardNavigation') && focusedElementInfo) {
        const viewInstance = focusedElementInfo.viewInstance;
        if(viewInstance) {
            const $activeElements = getActiveAccessibleElements(focusedElementInfo.ariaLabel, viewInstance.element());
            const $targetElement = $activeElements.eq(focusedElementInfo.index);

            focusedElementInfo = null;

            eventsEngine.trigger($targetElement, 'focus');
        }
    }
}

export function selectView(viewName, instance, event) {
    const keyName = normalizeKeyName(event);

    if(event.ctrlKey && (keyName === 'upArrow' || keyName === 'downArrow')) {
        const viewNames = Object.keys(viewItemSelectorMap);
        let viewItemIndex = viewNames.indexOf(viewName);

        while(viewItemIndex >= 0 && viewItemIndex < viewNames.length) {
            viewItemIndex = keyName === 'upArrow' ? --viewItemIndex : ++viewItemIndex;
            const viewName = viewNames[viewItemIndex];
            const viewSelectors = viewItemSelectorMap[viewName];
            const $focusViewElement = findFocusedViewElement(viewSelectors, event.target);
            if($focusViewElement && $focusViewElement.length) {
                $focusViewElement.attr('tabindex', instance.option('tabindex') || 0);
                eventsEngine.trigger($focusViewElement, 'focus');
                $focusViewElement.removeClass(FOCUS_DISABLED_CLASS);
                break;
            }
        }
    }
}

export function setTabIndex(instance, $element) {
    if(!instance.option('useLegacyKeyboardnavigation')) {
        $element.attr('tabindex', instance.option('tabindex') || 0);
    }
}
