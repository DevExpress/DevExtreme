import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";

import Widget from "../widget/ui.widget";
import Popup from "../popup";

const FILE_MANAGER_DIALOG_CONTENT = "dx-filemanager-dialog";

class FileManagerDialogBase extends Widget {

    _initMarkup() {
        this._createOnClosedAction();

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
    }

    show() {
        this._dialogResult = null;
        this._popup.show();
    }

    _getDialogOptions() {
        return {
            width: 340,
            height: 200,
            title: "Title",
            buttonText: "ButtonText"
        };
    }

    _createContentTemplate(element) {
        this._$contentElement = $("<div>")
            .appendTo(element)
            .addClass(FILE_MANAGER_DIALOG_CONTENT);

        const cssClass = this._getCssClass();
        if(cssClass) {
            this._$contentElement.addClass(cssClass);
        }
    }

    _getDialogResult() {
        return null;
    }

    _getCssClass() {
        return "";
    }

    _onButtonClick() {
        const result = this._getDialogResult();
        if(result) {
            this._dialogResult = result;
            this._popup.hide();
        }
    }

    _onPopupHidden() {
        this._onClosedAction({ dialogResult: this._dialogResult });
    }

    _createOnClosedAction() {
        this._onClosedAction = this._createActionByOption("onClosed");
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            onClosed: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case "onClosed":
                this._createOnPathChangedAction();
                break;
            default:
                super._optionChanged(args);
        }
    }

}

module.exports = FileManagerDialogBase;
