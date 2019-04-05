import { extend } from "../../core/utils/extend";
import { isString } from "../../core/utils/type";

export class FileManagerCommandManager {

    constructor() {
        this._initCommands();

        this._actions = {};
    }

    _initCommands() {
        this._commands = [
            {
                name: "create",
                text: "New folder",
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
                text: "Upload files",
                icon: "upload",
                noFileItemRequired: true
            },
            {
                name: "refresh",
                text: "Refresh",
                icon: "refresh",
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
        this._commands.forEach(command => { this._commandMap[command.name] = command; });
    }

    registerActions(actions) {
        this._actions = extend(this._actions, actions);
    }

    executeCommand(command) {
        const commandName = isString(command) ? command : command.name;
        const action = this._actions[commandName];
        if(action) {
            action();
        }
    }

    getCommands(forToolbar, items) {
        return this._commands
            .filter(c => (!c.displayInToolbarOnly || forToolbar) && (!items || this.isCommandAvailable(c.name, items)));
    }

    getCommandByName(name) {
        return this._commandMap[name];
    }

    isCommandAvailable(commandName, items) {
        const command = this.getCommandByName(commandName);
        if(!command) {
            return;
        }
        return command.noFileItemRequired || items.length > 0 && (!command.isSingleFileItemCommand || items.length === 1);
    }

}
