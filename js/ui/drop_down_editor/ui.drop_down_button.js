import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";
import ActionButton from "../text_box/action_button_collection/button";
import Button from "../button";

const DROP_DOWN_EDITOR_BUTTON_CLASS = "dx-dropdowneditor-button";
const DROP_DOWN_EDITOR_BUTTON_VISIBLE = "dx-dropdowneditor-button-visible";

export default class ClearButton extends ActionButton {
    constructor(editor, options) {
        super("dropDown", editor, options);
    }

    _attachEvents(instance) {
        const { editor } = this;

        instance.option("onClick", (e) => {
            !editor.option("openOnFieldClick") && editor._openHandler(e);
        });

        eventsEngine.on(instance.$element(), "mousedown", (e) => { e.preventDefault(); });
    }

    _create() {
        const { editor } = this;
        const $element = $("<div>").addClass(DROP_DOWN_EDITOR_BUTTON_CLASS);
        const options = this._getOptions();

        this._addToContainer($element);

        const instance = editor._createComponent($element, Button, options);

        $element.removeClass("dx-button");

        return {
            $element,
            instance
        };
    }

    _getOptions() {
        const { editor } = this;
        const visible = this._isVisible();
        const isReadOnly = editor.option("readOnly");
        const template = editor._getTemplateByOption("dropDownButtonTemplate");

        return {
            focusStateEnabled: false,
            hoverStateEnabled: false,
            activeStateEnabled: false,
            useInkRipple: false,
            disabled: isReadOnly,
            visible,
            template
        };
    }

    _isVisible() {
        const { editor } = this;

        return editor.option("showDropDownButton");
    }

    update() {
        super.update();

        const { editor, instance } = this;
        const $editor = editor.$element();
        const options = this._getOptions();

        instance && instance.option(options);

        // TODO: remove it
        $editor.toggleClass(DROP_DOWN_EDITOR_BUTTON_VISIBLE, options.visible);
    }
}
