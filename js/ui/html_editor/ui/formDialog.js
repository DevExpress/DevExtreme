import $ from "../../../core/renderer";
import { extend } from "../../../core/utils/extend";

import Popup from "../../popup";
import Form from "../../form";
import { Deferred } from "../../../core/utils/deferred";
import { format } from "../../../localization/message";

const DIALOG_CLASS = "dx-formdialog";
const FORM_CLASS = "dx-formdialog-form";

class FormDialog {

    constructor(editorInstance, popupConfig) {
        this._editorInstance = editorInstance;
        this._popupUserConfig = popupConfig;

        this._renderPopup();
    }

    _renderPopup() {
        const editorInstance = this._editorInstance;
        const $container = $(`<div class='${DIALOG_CLASS}'>`).appendTo(editorInstance.$element());
        const popupConfig = this._getPopupConfig();

        return editorInstance._createComponent($container, Popup, popupConfig);
    }

    _getPopupConfig() {
        return extend({
            onInitialized: (e) => {
                this._popup = e.component;
            },
            deferRendering: false,
            contentTemplate: (contentElem) => {
                this._renderForm($(contentElem), {
                    onEditorEnterKey: (e) => {
                        this.hide(e.component.option("formData"));
                    }
                });
            },
            onHiding: () => {
                this.deferred.reject();
            },
            toolbarItems: [
                {
                    toolbar: "bottom",
                    location: "after",
                    widget: "dxButton",
                    options: {
                        text: format("OK"),
                        onClick: () => {
                            this.hide(this._form.option("formData"));
                        }
                    }
                }, {
                    toolbar: "bottom",
                    location: "after",
                    widget: "dxButton",
                    options: {
                        text: format("Cancel"),
                        onClick: () => {
                            this._popup.hide();
                        }
                    }
                }
            ]
        }, this._popupUserConfig);
    }

    _renderForm($container, options) {
        $container.addClass(FORM_CLASS);
        this._form = this._editorInstance._createComponent($container, Form, options);
    }


    show(formUserConfig) {
        if(this._popup.option("visible")) {
            return;
        }

        this.deferred = new Deferred();
        const formConfig = extend({}, formUserConfig);

        this._form.option(formConfig);
        this._popup.show();

        return this.deferred.promise();
    }

    hide(formData) {
        this.deferred.resolve(formData);
        this._popup.hide();
    }
}

export default FormDialog;
