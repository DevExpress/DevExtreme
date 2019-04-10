import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";
import eventUtils from "../../events/utils";

const FOCUS_STATE_CLASS = "dx-state-focused";

const processKeyDown = function(event, action, $mainElement) {
    var keyName = eventUtils.normalizeKeyName(event);

    if(keyName === "enter" || keyName === "space") {
        action({ event: event });
    } else if(keyName === "tab") {
        $mainElement.addClass(FOCUS_STATE_CLASS);
    }
};

module.exports = {
    registerKeyboardSupportAccessibility: function(component, $element, selector, action) {
        if(component.option("useLegacyKeyboardNavigation")) return;

        var $mainElement = $(component.element());

        eventsEngine.on($element, "keydown", selector, e => processKeyDown(e, action, $mainElement));
        eventsEngine.on($element, "mousedown", selector, () => {
            component._preventFocusState = true;
            $mainElement.removeClass(FOCUS_STATE_CLASS);
        });
        eventsEngine.on($element, "focus", selector, () => {
            if(!component._preventFocusState) {
                $mainElement.addClass(FOCUS_STATE_CLASS);
            }
            component._preventFocusState = false;
        });
    }
};

