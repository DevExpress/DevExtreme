import $ from "../../../core/renderer";
import TextEditorButton from "./button";
import Button from "../../button";
import eventsEngine from "../../../events/core/events_engine";
import hoverEvents from "../../../events/hover";
import clickEvent from "../../../events/click";

const CUSTOM_BUTTON_HOVERED_CLASS = "dx-custom-button-hovered";

export default class CustomButton extends TextEditorButton {
    _attachEvents(instance, $element) {
        const { editor } = this;

        eventsEngine.on($element, hoverEvents.start, () => {
            editor.$element().addClass(CUSTOM_BUTTON_HOVERED_CLASS);
        });
        eventsEngine.on($element, hoverEvents.end, () => {
            editor.$element().removeClass(CUSTOM_BUTTON_HOVERED_CLASS);
        });
        eventsEngine.on($element, clickEvent.name, (e) => {
            e.stopPropagation();
        });
    }

    _create() {
        const { editor } = this;
        const $element = $("<div>");

        this._addToContainer($element);

        const instance = editor._createComponent($element, Button, this.options);

        return {
            $element,
            instance
        };
    }

    _isVisible() {
        const { editor } = this;

        return editor.option("visible");
    }
}
