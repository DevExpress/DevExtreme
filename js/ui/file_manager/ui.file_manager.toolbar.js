import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import { each } from "../../core/utils/iterator";

import Widget from "../widget/ui.widget";
import Button from "../button";

class FileManagerToolbar extends Widget {

    _initMarkup() {
        this._createOnItemClickAction();

        this._commandManager = this.option("commandManager");

        const commands = this._commandManager.getCommands(true);
        each(commands, (_, command) => {
            const itemButton = this._createButton(command.text, command.name);
            this.$element().append(itemButton.$element());
        });
    }

    _createOnItemClickAction() {
        this._onItemClickAction = this._createActionByOption("onItemClick");
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            commandManager: null,
            onItemClick: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case "onItemClick":
                this._createOnItemClickAction();
                break;
            case "commandManager":
                this.repaint();
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
