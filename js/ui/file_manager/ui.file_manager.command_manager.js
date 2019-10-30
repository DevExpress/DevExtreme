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
                icon: "newfolder",
                enabled: this._permissions.create,
                noFileItemRequired: true
            },
            {
                name: "rename",
                text: "Rename",
                icon: "rename",
                enabled: this._permissions.rename,
                isSingleFileItemCommand: true
            },
            {
                name: "move",
                text: "Move",
                icon: "movetofolder",
                enabled: this._permissions.move
            },
            {
                name: "copy",
                text: "Copy",
                icon: "copy",
                enabled: this._permissions.copy
            },
            {
                name: "delete",
                text: "Delete",
                icon: "trash",
                enabled: this._permissions.remove,
            },
            {
                name: "download",
                text: "Download",
                icon: "download",
                enabled: this._permissions.download
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
                icon: "dx-filemanager-i dx-filemanager-i-refresh",
                enabled: true,
                noFileItemRequired: true
            },
            {
                name: "thumbnails",
                text: "Thumbnails View",
                enabled: true,
                noFileItemRequired: true
            },
            {
                name: "details",
                text: "Details View",
                enabled: true,
                noFileItemRequired: true
            },
            {
                name: "clear",
                text: "Clear selection",
                icon: "remove",
                enabled: true
            },
            {
                name: "showNavPane",
                icon: "menu",
                enabled: false,
                noFileItemRequired: true
            }
        ];

        this._commandMap = {};
        this._commands.forEach(command => { this._commandMap[command.name] = command; });
    }

    registerActions(actions) {
        this._actions = extend(this._actions, actions);
    }

    executeCommand(command, arg) {
        const commandName = isString(command) ? command : command.name;
        const action = this._actions[commandName];
        if(action) {
            return action(arg);
        }
    }

    setCommandEnabled(commandName, enabled) {
        const command = this.getCommandByName(commandName);
        if(command) {
            command.enabled = enabled;
        }
    }

    getCommandByName(name) {
        return this._commandMap[name];
    }

    isCommandAvailable(commandName, itemInfos) {
        const command = this.getCommandByName(commandName);
        if(!command || !command.enabled) {
            return false;
        }

        if(command.noFileItemRequired) {
            return true;
        }

        const itemsLength = itemInfos && itemInfos.length || 0;
        if(itemsLength === 0 || itemInfos.some(item => item.fileItem.isRoot || item.fileItem.isParentFolder)) {
            return false;
        }

        if(commandName === "download") {
            return itemInfos.every(itemInfo => !itemInfo.fileItem.isDirectory);
        }

        return !command.isSingleFileItemCommand || itemsLength === 1;
    }

}
