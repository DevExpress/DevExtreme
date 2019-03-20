import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";

import Widget from "../widget/ui.widget";
import Popup from "../popup";

const FILE_MANAGER_DIALOG_CONTENT = "dx-filemanager-dialog";

var FileManagerDialogBase = Widget.inherit({

    _initMarkup: function() {
        const options = this._getDialogOptions();

        this._popup = this._createComponent(this.$element(), Popup, {
            width: options.width,
            height: options.height,
            showTitle: true,
            title: options.title,
            visible: false,
            closeOnOutsideClick: true,
            contentTemplate: this._createContentTemplate.bind(this),
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

    _getDialogOptions: function() {
        return {
            width: 340,
            height: 200,
            title: "Title",
            buttonText: "ButtonText"
        };
    },

    _createContentTemplate: function(element) {
        this._$contentElement = $("<div>")
            .appendTo(element)
            .addClass(FILE_MANAGER_DIALOG_CONTENT);

        const cssClass = this._getCssClass();
        if(cssClass) {
            this._$contentElement.addClass(cssClass);
        }
    },

    _getDialogResult: function() {
        return null;
    },

    _getCssClass: function() {
        return "";
    },

    _onButtonClick: function() {
        const result = this._getDialogResult();
        if(result) {
            this._dialogResult = result;
            this._popup.hide();
        }
    },

    _onPopupHidden: function() {
        const closedHandler = this.option("onClosed");
        if(closedHandler) closedHandler(this._dialogResult);
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            onClosed: null
        });
    }

});

module.exports = FileManagerDialogBase;
