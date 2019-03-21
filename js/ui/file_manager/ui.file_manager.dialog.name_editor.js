import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";

import TextBox from "../text_box";
import FileManagerDialogBase from "./ui.file_manager.dialog.js";

const FILE_MANAGER_DIALOG_NAME_EDITOR = "dx-filemanager-dialog-name-editor";

class FileManagerNameEditorDialog extends FileManagerDialogBase {

    show(name) {
        name = name || "";

        if(this._nameTextBox) {
            this._nameTextBox.option("value", name);
        } else {
            this._initialNameValue = name;
        }

        super.show();
    }

    _getDialogOptions() {
        return extend(super._getDefaultOptions(), {
            width: 340,
            height: 180,
            title: this.option("title"),
            buttonText: this.option("buttonText")
        });
    }

    _createContentTemplate(element) {
        super._createContentTemplate(element);

        this._nameTextBox = this._createComponent($("<div>"), TextBox, {
            value: this._initialNameValue,
            placeholder: "Enter your new name"
        });

        this._$contentElement.append(this._nameTextBox.$element());
    }

    _getDialogResult() {
        const nameValue = this._nameTextBox.option("value");
        return nameValue ? { name: nameValue } : null;
    }

    _getCssClass() {
        return FILE_MANAGER_DIALOG_NAME_EDITOR;
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            title: "",
            buttonText: ""
        });
    }

}

module.exports = FileManagerNameEditorDialog;
