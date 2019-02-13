import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";

import Widget from "../widget/ui.widget";
import TextBox from "../text_box";
import Popup from "../popup";

var FileManagerNameEditorDialog = Widget.inherit({

    _initMarkup: function() {
        this._popup = this._createComponent($("<div>"), Popup, {
            width: 340,
            height: 180,
            showTitle: true,
            title: this.option("title"),
            visible: false,
            closeOnOutsideClick: true,
            contentTemplate: this._getContentTemplate.bind(this),
            toolbarItems: [
                {
                    widget: "dxButton",
                    toolbar: "bottom",
                    location: "after",
                    options: {
                        text: this.option("buttonText"),
                        onClick: this._onButtonClick.bind(this)
                    }
                }
            ],
            onHidden: this._onPopupHidden.bind(this)
        });

        this.$element().append(this._popup.$element());
    },

    show: function(name) {
        name = name || "";

        if(this._nameTextBox) {
            this._nameTextBox.option("value", name);
        } else {
            this._initialNameValue = name;
        }

        this._dialogResult = null;
        this._popup.show();
    },

    _getContentTemplate: function() {
        this._nameTextBox = this._createComponent($("<div />"), TextBox, {
            value: this._initialNameValue,
            placeholder: "Enter your new name"
        });

        return $("<div />").append(
            this._nameTextBox.$element()
        );
    },

    _onPopupHidden: function() {
        var closedHandler = this.option("onClosed");
        if(closedHandler) {
            closedHandler(this._dialogResult);
        }
    },

    _onButtonClick: function() {
        var nameValue = this._nameTextBox.option("value");
        if(nameValue) {
            this._dialogResult = { name: nameValue };
            this._popup.hide();
        }
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            title: "",
            buttonText: "",
            onClosed: null
        });
    },

    _optionChanged: function(args) {
        var name = args.name;

        switch(name) {
            default:
                this.callBase(args);
        }
    }

});

module.exports = FileManagerNameEditorDialog;
