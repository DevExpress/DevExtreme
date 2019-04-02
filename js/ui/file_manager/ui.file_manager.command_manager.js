import { each } from "../../core/utils/iterator";
import { extend } from "../../core/utils/extend";

class FileManagerCommandManager {

    constructor() {
        this._initCommands();

        this._actions = {};
    }

    _initCommands() {
        this._commands = [
            {
                name: "create",
                text: "Create folder",
                icon: "plus",
                noFileItemRequired: true
            },
            {
                name: "rename",
                text: "Rename",
                isSingleFileItemCommand: true
            },
            {
                name: "move",
                text: "Move"
            },
            {
                name: "copy",
                text: "Copy"
            },
            {
                name: "delete",
                text: "Delete",
                icon: "remove"
            },
            {
                name: "download",
                text: "Download",
                icon: "download"
            },
            {
                name: "upload",
                text: "Upload file...",
                icon: "upload",
                noFileItemRequired: true
            },
            {
                name: "thumbnails",
                text: "Thumbnails View",
                displayInToolbarOnly: true,
                noFileItemRequired: true
            },
            {
                name: "details",
                text: "Details View",
                displayInToolbarOnly: true,
                noFileItemRequired: true
            }
        ];

        this._commandMap = {};
        each(this._commands, (_, command) => { this._commandMap[command.name] = command; });
    }

    registerActions(actions) {
        this._actions = extend(this._actions, actions);
    }

    executeCommand(commandName) {
        const action = this._actions[commandName];
        if(action) {
            action();
        }
    }

    getCommands(forToolbar, items) {
        return this._commands
            .filter(c => (!c.displayInToolbarOnly || forToolbar) && (!items || this.isCommandAvailable(c.name, items)));
    }

    isCommandAvailable(commandName, items) {
        const { noFileItemRequired, isSingleFileItemCommand } = this._commandMap[commandName];
        return noFileItemRequired || items.length > 0 && (!isSingleFileItemCommand || items.length === 1);
    }

}

module.exports.FileManagerCommandManager = FileManagerCommandManager;
