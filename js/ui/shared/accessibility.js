import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";
import eventUtils from "../../events/utils";

const FOCUS_STATE_CLASS = "dx-state-focused";

var isMouseDown = false,
    isHiddenFocusing = false;

function processKeyDown(event, action, $mainElement) {
    var keyName = eventUtils.normalizeKeyName(event);

    if(keyName === "enter" || keyName === "space") {
        action({ event: event });
    } else if(keyName === "tab") {
        $mainElement.addClass(FOCUS_STATE_CLASS);
    }
}

module.exports = {
    hiddenFocus: function(element) {
        isHiddenFocusing = true;
        element.focus();
        isHiddenFocusing = false;
    },
    registerKeyboardAction: function(component, $element, selector, action) {
        if(component.option("useLegacyKeyboardNavigation")) {
            return;
        }

        var $mainElement = $(component.element());

        eventsEngine.on($element, "keydown", selector, e => processKeyDown(e, action, $mainElement));
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
    }
};
