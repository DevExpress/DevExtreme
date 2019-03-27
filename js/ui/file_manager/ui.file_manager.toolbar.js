import $ from "../../core/renderer";

import { FileManagerFileCommands } from "./ui.file_manager.commands";
import Widget from "../widget/ui.widget";
import Button from "../button";
import { extend } from "../../core/utils/extend";

class FileManagerToolbar extends Widget {

    _initMarkup() {
        this._createOnItemClickAction();

        for(let i = 0; i < FileManagerFileCommands.length; i++) {
            const itemButton = this._createButton(FileManagerFileCommands[i].text, FileManagerFileCommands[i].name);
            this.$element().append(itemButton.$element());
        }
    }

    _createOnItemClickAction() {
        this._onItemClickAction = this._createActionByOption("onItemClick");
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            onItemClick: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case "onItemClick":
                this._createOnItemClickAction();
                break;
            default:
                super._optionChanged(args);
        }
    }

    _createButton(text, name) {
        return this._createComponent($("<div>"), Button, {
            text: text,
            onClick: e => this._onButtonClick(name)
        });
    }

    _onButtonClick(itemName) {
        if(itemName) {
            this._onItemClickAction({ itemName });
        }
    }

}

module.exports = FileManagerToolbar;
