import $ from "../../../core/renderer";
import { extend } from "../../../core/utils/extend";

import Popup from "../../popup";
import Form from "../../form";
import domAdapter from "../../../core/dom_adapter";
import { resetActiveElement } from "../../../core/utils/dom";
import { Deferred } from "../../../core/utils/deferred";
import { format } from "../../../localization/message";
import browser from "../../../core/utils/browser";

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
        const $container = $("<div>")
            .addClass(DIALOG_CLASS)
            .appendTo(editorInstance.$element());
        const popupConfig = this._getPopupConfig();

        return editorInstance._createComponent($container, Popup, popupConfig);
    }

    _escKeyHandler() {
        this._popup.hide();
    }

    _addEscapeHandler(e) {
        e.component.registerKeyHandler("escape", this._escKeyHandler.bind(this));
    }

    _getPopupConfig() {
        return extend({
            onInitialized: (e) => {
                this._popup = e.component;
                this._popup.on("hiding", () => { this.deferred.reject(); });
                this._popup.on("shown", () => { this._form.focus(); });
            },
            deferRendering: false,
            focusStateEnabled: false,
            showCloseButton: false,
            contentTemplate: (contentElem) => {
                const $formContainer = $("<div>").appendTo(contentElem);

                this._renderForm($formContainer, {
                    onEditorEnterKey: ({ component, dataField }) => {
                        this._updateEditorValue(component, dataField);
                        this.hide(component.option("formData"));
                    },
                    customizeItem: (item) => {
                        if(item.itemType === "simple") {
                            item.editorOptions = extend(
                                true,
                                {},
                                item.editorOptions,
                                { onInitialized: this._addEscapeHandler.bind(this) }
                            );
                        }
                    }
                });
            },
            toolbarItems: [
                {
                    toolbar: "bottom",
                    location: "after",
                    widget: "dxButton",
                    options: {
                        onInitialized: this._addEscapeHandler.bind(this),
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
                        onInitialized: this._addEscapeHandler.bind(this),
                        text: format("Cancel"),
                        onClick: () => {
                            this._popup.hide();
                        }
                    }
                }
            ]
        }, this._popupUserConfig);
    }

    _updateEditorValue(component, dataField) {
        if(browser.msie && parseInt(browser.version) <= 11) {
            const editor = component.getEditor(dataField);
            const activeElement = domAdapter.getActiveElement();

            if(editor.$element().find(activeElement).length) {
                resetActiveElement();
            }
        }
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

    popupOption(optionName, optionValue) {
        return this._popup.option.apply(this._popup, arguments);
    }
}

export default FormDialog;
