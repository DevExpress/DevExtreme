import $ from "../../core/renderer";

import { FileManagerFileCommands } from "./ui.file_manager.commands";
import Widget from "../widget/ui.widget";
import Button from "../button";
import { extend } from "../../core/utils/extend";
import typeUtils from "../../core/utils/type";

class FileManagerToolbar extends Widget {

    _initMarkup() {
        for(let i = 0; i < FileManagerFileCommands.length; i++) {
            const itemButton = this._createButton(FileManagerFileCommands[i].text, FileManagerFileCommands[i].name);
            this.$element().append(itemButton.$element());
        }
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            onItemClick: null
        });
    }

    _createButton(text, name) {
        return this._createComponent($("<div>"), Button, {
            text: text,
            onClick: e => this._onButtonClick(name)
        });
    }

    _onButtonClick(buttonName) {
        const handler = this.option("onItemClick");
        if(buttonName && typeUtils.isFunction(handler)) {
            handler(buttonName);
        }
    }

}

module.exports = FileManagerToolbar;
