import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";
import eventUtils from "../../events/utils";

const FOCUS_STATE_CLASS = "dx-state-focused",
    DATA_ROW_SELECTOR = ".dx-datagrid-rowsview .dx-datagrid-content .dx-data-row",
    viewItemSelectorMap = {
        headerColumns: [".dx-datagrid-headers .dx-header-row > td.dx-datagrid-action"],
        filterRow: [".dx-datagrid-headers .dx-datagrid-filter-row .dx-editor-cell input"],
        rowsView: [`${DATA_ROW_SELECTOR} > td[tabindex]`, `${DATA_ROW_SELECTOR} > td:not([class*=dx-command])`],
        filterPanel: [".dx-datagrid-filter-panel .dx-icon-filter"],
        pager: [".dx-datagrid-pager [tabindex]", ".dx-datagrid-pager .dx-selection"]
    };

var isMouseDown = false,
    isHiddenFocusing = false;

function processKeyDown(viewName, component, event, action, $mainElement) {
    var keyName = eventUtils.normalizeKeyName(event);

    if(keyName === "enter" || keyName === "space") {
        action({ event: event });
    } else if(keyName === "tab") {
        $mainElement.addClass(FOCUS_STATE_CLASS);
    } else {
        module.exports.selectView(viewName, component, event);
    }
}

function findFocusedViewElement(viewSelectors) {
    for(let index in viewSelectors) {
        let selector = viewSelectors[index],
            $focusViewElement = $(selector).first();
        if($focusViewElement.length) {
            return $focusViewElement;
        }
    }
}

module.exports = {
    hiddenFocus: function(element) {
        isHiddenFocusing = true;
        element.focus();
        isHiddenFocusing = false;
    },

    registerKeyboardAction: function(viewName, component, $element, selector, action) {
        if(component.option("useLegacyKeyboardNavigation")) {
            return;
        }

        var $mainElement = $(component.element());

        eventsEngine.on($element, "keydown", selector, e => processKeyDown(viewName, component, e, action, $mainElement));
        eventsEngine.on($element, "mousedown", selector, () => {
            isMouseDown = true;
            $mainElement.removeClass(FOCUS_STATE_CLASS);
        });
        eventsEngine.on($element, "focusin", selector, () => {
            if(!isMouseDown && !isHiddenFocusing) {
                $mainElement.addClass(FOCUS_STATE_CLASS);
            }
            isMouseDown = false;
        });
    },

    selectView: function(viewName, component, event) {
        var keyName = eventUtils.normalizeKeyName(event);

        if(event.ctrlKey && (keyName === "upArrow" || keyName === "downArrow")) {
            let viewNames = Object.keys(viewItemSelectorMap),
                viewItemIndex = viewNames.indexOf(viewName);

            while(viewItemIndex >= 0 && viewItemIndex < viewNames.length) {
                viewItemIndex = keyName === "upArrow" ? --viewItemIndex : ++viewItemIndex;
                let viewName = viewNames[viewItemIndex],
                    viewSelectors = viewItemSelectorMap[viewName],
                    $focusViewElement = findFocusedViewElement(viewSelectors);
                if($focusViewElement && $focusViewElement.length) {
                    $focusViewElement.attr("tabindex", component.option("tabindex") || 0);
                    eventsEngine.trigger($focusViewElement, "focus");
                    break;
                }
            }
        }
    },

    setTabIndex: function(component, $element) {
        if(!component.option("useLegacyKeyboardnavigation")) {
            $element.attr("tabindex", component.option("tabindex") || 0);
        }
    }
};
