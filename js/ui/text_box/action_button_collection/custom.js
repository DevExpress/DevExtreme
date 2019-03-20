import $ from "../../../core/renderer";
import ActionButton from "./button";
import Button from "../../button";
// import { extend } from "../../../core/utils/extend";

export default class CustomButton extends ActionButton {
    _attachEvents() {
    }

    _create() {
        const { editor } = this;
        const $element = $("<div>");

        this._addToContainer($element);

        // let buttonOptions;

        // if(this.options && !this.options.stylingMode && editor.option("stylingMode") === "underlined") {
        //     buttonOptions = extend({}, this.options, { stylingMode: "text" });
        // } else {
        //     buttonOptions = this.options;
        // }

        const instance = editor._createComponent($element, Button, /* buttonOptions */ this.options);

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
