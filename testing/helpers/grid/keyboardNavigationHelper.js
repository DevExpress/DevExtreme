import $ from "jquery";
import devices from "core/devices";
import eventUtils from "events/utils";
import pointerEvents from "events/pointer";

export const CLICK_EVENT = eventUtils.addNamespace(pointerEvents.up, "dxDataGridKeyboardNavigation"),
    device = devices.real(),
    KEYS = {
        "tab": "Tab",
        "enter": "Enter",
        "escape": "Escape",
        "pageUp": "PageUp",
        "pageDown": "PageDown",
        "leftArrow": "ArrowLeft",
        "upArrow": "ArrowUp",
        "rightArrow": "ArrowRight",
        "downArrow": "ArrowDown",
        "space": " ",
        "F": "F",
        "A": "A",
        "D": "D",
        "1": "1",
        "2": "2",
        "F2": "F2"
    };

export function testInDesktop(name, testFunc) {
    if(device.deviceType === "desktop") {
        QUnit.testInActiveWindow(name, testFunc);
    }
}

export function triggerKeyDown(key, ctrl, shift, target, result) {
    result = result || {
        preventDefault: false,
        stopPropagation: false
    };
    var alt = false;
    if(typeof ctrl === "object") {
        alt = ctrl.alt;
        shift = ctrl.shift;
        ctrl = ctrl.ctrl;
    }
    this.keyboardNavigationController._keyDownProcessor.process({
        key: KEYS[key] || key,
        keyName: key,
        ctrlKey: ctrl,
        shiftKey: shift,
        altKey: alt,
        target: target && target[0] || target,
        type: "keydown",
        preventDefault: function() {
            result.preventDefault = true;
        },
        isDefaultPrevented: function() {
            return result.preventDefault;
        },
        stopPropagation: function() {
            result.stopPropagation = true;
        }
    });

    return result;
}

export function fireKeyDown($target, key, ctrlKey) {
    $target.trigger(eventUtils.createEvent("keydown", { target: $target.get(0), key: key, ctrlKey: ctrlKey }));
}

export function focusCell(columnIndex, rowIndex) {
    var $element0 = this.rowsView.element(),
        $row = $($element0.find(".dx-row")[rowIndex]);
    $($row.find("td")[columnIndex]).trigger(CLICK_EVENT);
}

export function getTextSelection(element) {
    let startPos = element.selectionStart,
        endPos = element.selectionEnd;
    return element.value.substring(startPos, endPos);
}

export function callViewsRenderCompleted(views) {
    $.each(views, (_, view) => view.renderCompleted.fire());
}
