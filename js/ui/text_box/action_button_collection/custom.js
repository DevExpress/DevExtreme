import $ from "../../../core/renderer";
import ActionButton from "./button";
import Button from "../../button";

export default class CustomButton extends ActionButton {
    _attachEvents() {
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
