import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";
import ActionButton from "./action_button_collection/button";
import { addNamespace } from "../../events/utils";
import { down as pointerDown } from "../../events/pointer";
import { name as click } from "../../events/click";

const STATE_INVISIBLE_CLASS = "dx-state-invisible";
const TEXTEDITOR_CLEAR_BUTTON_CLASS = "dx-clear-button-area";
const TEXTEDITOR_CLEAR_ICON_CLASS = "dx-icon-clear";
const TEXTEDITOR_ICON_CLASS = "dx-icon";
const TEXTEDITOR_SHOW_CLEAR_BUTTON_CLASS = "dx-show-clear-button";

export default class ClearButton extends ActionButton {
    _create() {
        const $element = $("<span>")
            .addClass(TEXTEDITOR_CLEAR_BUTTON_CLASS)
            .append($("<span>").addClass(TEXTEDITOR_ICON_CLASS).addClass(TEXTEDITOR_CLEAR_ICON_CLASS));

        this._addToContainer($element);
        this.update(true);

        return {
            instance: $element,
            $element
        };
    }

    _isVisible() {
        const { editor } = this;

        return editor._isClearButtonVisible();
    }

    _attachEvents(instance, $button) {
        const { editor } = this;
        const editorName = editor.NAME;

        eventsEngine.on($button, addNamespace(pointerDown, editorName),
            (e) => { e.pointerType === "mouse" && e.preventDefault(); }
        );

        eventsEngine.on($button, addNamespace(click, editorName),
            (e) => editor._clearValueHandler(e)
        );
    }

    // TODO: get rid of it
    _legacyRender($editor, isVisible) {
        $editor.toggleClass(TEXTEDITOR_SHOW_CLEAR_BUTTON_CLASS, isVisible);
    }

    update(rendered = false) {
        !rendered && super.update();

        const { editor, instance } = this;
        const $editor = editor.$element();
        const isVisible = this._isVisible();

        instance && instance.toggleClass(STATE_INVISIBLE_CLASS, !isVisible);
        this._legacyRender($editor, isVisible);
    }
}
