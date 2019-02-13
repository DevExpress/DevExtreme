import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";

import Widget from "../widget/ui.widget";
import Popup from "../popup";

var FileManagerDialogBase = Widget.inherit({

    _initMarkup: function() {
        var options = this._getInternalOptions();

        this._popup = this._createComponent(this.$element(), Popup, {
            width: options.width,
            height: options.height,
            showTitle: true,
            title: options.title,
            visible: false,
            closeOnOutsideClick: true,
            contentTemplate: this._getContentTemplate.bind(this),
            toolbarItems: [
                {
                    widget: "dxButton",
                    toolbar: "bottom",
                    location: "after",
                    options: {
                        text: options.buttonText,
                        onClick: this._onButtonClick.bind(this)
                    }
                }
            ],
            onHidden: this._onPopupHidden.bind(this)
        });
    },

    show: function() {
        this._dialogResult = null;
        this._popup.show();
    },

    _getInternalOptions: function() {
        return {
            width: 340,
            height: 180,
            title: "Title",
            buttonText: "ButtonText"
        };
    },

    _getContentTemplate: function() {
        return $("<div />");
    },

    _getDialogResult: function() {
        return null;
    },

    _onButtonClick: function() {
        var result = this._getDialogResult();
        if(result) {
            this._dialogResult = result;
            this._popup.hide();
        }
    },

    _onPopupHidden: function() {
        var closedHandler = this.option("onClosed");
        if(closedHandler) closedHandler(this._dialogResult);
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            onClosed: null
        });
    }

});

module.exports = FileManagerDialogBase;
