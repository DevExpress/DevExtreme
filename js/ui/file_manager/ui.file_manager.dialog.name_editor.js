import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";

import TextBox from "../text_box";
import FileManagerDialogBase from "./ui.file_manager.dialog.base.js";

const FILE_MANAGER_DIALOG_NAME_EDITOR = "dx-filemanager-dialog-name-editor";

var FileManagerNameEditorDialog = FileManagerDialogBase.inherit({

    show: function(name) {
        name = name || "";

        if(this._nameTextBox) {
            this._nameTextBox.option("value", name);
        } else {
            this._initialNameValue = name;
        }

        this.callBase();
    },

    _getInternalOptions: function() {
        return extend(this.callBase(), {
            width: 340,
            height: 180,
            title: this.option("title"),
            buttonText: this.option("buttonText")
        });
    },

    _getContentTemplate: function() {
        this._nameTextBox = this._createComponent($("<div />"), TextBox, {
            value: this._initialNameValue,
            placeholder: "Enter your new name"
        });

        return this.callBase().append(
            this._nameTextBox.$element()
        );
    },

    _getDialogResult: function() {
        var nameValue = this._nameTextBox.option("value");
        return nameValue ? { name: nameValue } : null;
    },

    _getCssClass: function() {
        return FILE_MANAGER_DIALOG_NAME_EDITOR;
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            title: "",
            buttonText: ""
        });
    }

});

module.exports = FileManagerNameEditorDialog;
