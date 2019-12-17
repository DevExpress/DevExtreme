import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import * as eventUtils from '../../events/utils';
import { extend } from '../../core/utils/extend';

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

    const keyName = eventUtils.normalizeKeyName(event);

    if(keyName === 'enter' || keyName === 'space') {
        saveFocusedElementInfo(event.target, instance);
        action && action({ event: event });
    } else if(keyName === 'tab') {
        $mainElement.addClass(FOCUS_STATE_CLASS);
    } else {
        module.exports.selectView(viewName, instance, event);
    }
}

function saveFocusedElementInfo(target, instance) {
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
        $activeElements = $viewElement.find(`[aria-label="${ariaLabel}"][tabindex]`);
    } else {
        $activeElements = $viewElement.find('[tabindex]');
    }

    return $activeElements;
}

function findFocusedViewElement(viewSelectors) {
    for(const index in viewSelectors) {
        const selector = viewSelectors[index];
        let $focusViewElement;

        $focusViewElement = $(selector).first();

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

module.exports = {
    hiddenFocus: function(element) {
        isHiddenFocusing = true;
        element.focus();
        isHiddenFocusing = false;
    },

    registerKeyboardAction: function(viewName, instance, $element, selector, action, executeKeyDown) {
        if(instance.option('useLegacyKeyboardNavigation')) {
            return;
        }

        const $mainElement = $(instance.element());

        eventsEngine.on($element, 'keydown', selector, e => processKeyDown(viewName, instance, e, action, $mainElement, executeKeyDown));
        eventsEngine.on($element, 'mousedown', selector, () => {
            isMouseDown = true;
            $mainElement.removeClass(FOCUS_STATE_CLASS);
        });
        eventsEngine.on($element, 'focusin', selector, () => {
            if(!isMouseDown && !isHiddenFocusing) {
                $mainElement.addClass(FOCUS_STATE_CLASS);
            }

            isMouseDown = false;
        });
    },

    restoreFocus: function(instance) {
        if(!instance.option('useLegacyKeyboardNavigation') && focusedElementInfo) {
            const viewInstance = focusedElementInfo.viewInstance;
            if(viewInstance) {
                const $activeElements = getActiveAccessibleElements(focusedElementInfo.ariaLabel, viewInstance.element());
                const $targetElement = $activeElements.eq(focusedElementInfo.index);

                focusedElementInfo = null;

                eventsEngine.trigger($targetElement, 'focus');
            }
        }
    },

    selectView: function(viewName, instance, event) {
        const keyName = eventUtils.normalizeKeyName(event);

        if(event.ctrlKey && (keyName === 'upArrow' || keyName === 'downArrow')) {
            const viewNames = Object.keys(viewItemSelectorMap);
            let viewItemIndex = viewNames.indexOf(viewName);

            while(viewItemIndex >= 0 && viewItemIndex < viewNames.length) {
                viewItemIndex = keyName === 'upArrow' ? --viewItemIndex : ++viewItemIndex;
                const viewName = viewNames[viewItemIndex];
                const viewSelectors = viewItemSelectorMap[viewName];
                const $focusViewElement = findFocusedViewElement(viewSelectors);
                if($focusViewElement && $focusViewElement.length) {
                    $focusViewElement.attr('tabindex', instance.option('tabindex') || 0);
                    eventsEngine.trigger($focusViewElement, 'focus');
                    $focusViewElement.removeClass(FOCUS_DISABLED_CLASS);
                    break;
                }
            }
        }
    },

    setTabIndex: function(instance, $element) {
        if(!instance.option('useLegacyKeyboardnavigation')) {
            $element.attr('tabindex', instance.option('tabindex') || 0);
        }
    }
};
