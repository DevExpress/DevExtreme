import { extend } from "../../core/utils/extend";
import { isString } from "../../core/utils/type";

export class FileManagerCommandManager {

    constructor(permissions) {
        this._actions = {};
        this._permissions = permissions || {};

        this._initCommands();
    }

    _initCommands() {
        this._commands = [
            {
                name: "create",
                text: "New folder",
                icon: "plus",
                enabled: this._permissions.create,
                noFileItemRequired: true
            },
            {
                name: "rename",
                text: "Rename",
                enabled: this._permissions.rename,
                isSingleFileItemCommand: true
            },
            {
                name: "move",
                text: "Move",
                enabled: this._permissions.move
            },
            {
                name: "copy",
                text: "Copy",
                enabled: this._permissions.copy
            },
            {
                name: "delete",
                text: "Delete",
                icon: "remove",
                enabled: this._permissions.remove,
            },
            {
                name: "download",
                text: "Download",
                icon: "download",
                enabled: false
            },
            {
                name: "upload",
                text: "Upload files",
                icon: "upload",
                enabled: this._permissions.upload,
                noFileItemRequired: true
            },
            {
                name: "refresh",
                text: "Refresh",
                icon: "refresh",
                enabled: true,
                noFileItemRequired: true
            },
            {
                name: "thumbnails",
                text: "Thumbnails View",
                enabled: true,
                displayInToolbarOnly: true,
                noFileItemRequired: true
            },
            {
                name: "details",
                text: "Details View",
                enabled: true,
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
        if(!command || !command.enabled) {
            return false;
        }
        return command.noFileItemRequired || items.length > 0 && (!command.isSingleFileItemCommand || items.length === 1);
    }

}
