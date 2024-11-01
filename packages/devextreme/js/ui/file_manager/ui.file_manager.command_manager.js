import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import { isString } from '../../core/utils/type';
import messageLocalization from '../../common/core/localization/message';

export const defaultPermissions = {
    create: false,
    copy: false,
    move: false,
    delete: false,
    rename: false,
    upload: false,
    download: false
};

export class FileManagerCommandManager {

    constructor(permissions) {
        this._actions = {};
        this._permissions = permissions || {};

        this._initCommands();
    }

    _initCommands() {
        this._commands = [
            {
                name: 'create',
                text: messageLocalization.format('dxFileManager-commandCreate'),
                icon: 'newfolder',
                enabled: this._permissions.create,
                noFileItemRequired: true
            },
            {
                name: 'rename',
                text: messageLocalization.format('dxFileManager-commandRename'),
                icon: 'rename',
                enabled: this._permissions.rename,
                isSingleFileItemCommand: true
            },
            {
                name: 'move',
                text: messageLocalization.format('dxFileManager-commandMove'),
                icon: 'movetofolder',
                enabled: this._permissions.move
            },
            {
                name: 'copy',
                text: messageLocalization.format('dxFileManager-commandCopy'),
                icon: 'copy',
                enabled: this._permissions.copy
            },
            {
                name: 'delete',
                text: messageLocalization.format('dxFileManager-commandDelete'),
                icon: 'trash',
                enabled: this._permissions.delete,
            },
            {
                name: 'download',
                text: messageLocalization.format('dxFileManager-commandDownload'),
                icon: 'download',
                enabled: this._permissions.download
            },
            {
                name: 'upload',
                text: messageLocalization.format('dxFileManager-commandUpload'),
                icon: 'upload',
                enabled: this._permissions.upload,
                noFileItemRequired: true
            },
            {
                name: 'refresh',
                text: messageLocalization.format('dxFileManager-commandRefresh'),
                icon: 'dx-filemanager-i dx-filemanager-i-refresh',
                enabled: true,
                noFileItemRequired: true
            },
            {
                name: 'thumbnails',
                text: messageLocalization.format('dxFileManager-commandThumbnails'),
                icon: 'mediumiconslayout',
                enabled: true,
                noFileItemRequired: true
            },
            {
                name: 'details',
                text: messageLocalization.format('dxFileManager-commandDetails'),
                icon: 'detailslayout',
                enabled: true,
                noFileItemRequired: true
            },
            {
                name: 'clearSelection',
                text: messageLocalization.format('dxFileManager-commandClearSelection'),
                icon: 'remove',
                enabled: true
            },
            {
                name: 'showNavPane',
                hint: messageLocalization.format('dxFileManager-commandShowNavPane'),
                icon: 'menu',
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

    updatePermissions(permissions) {
        const resultPermissions = extend({}, defaultPermissions, permissions);
        this._permissions = resultPermissions;
        each(this._permissions, permission => {
            this._commandMap[permission].enabled = this._permissions[permission];
        });
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
        if(itemsLength === 0 || itemInfos.some(item => item.fileItem.isRoot() || item.fileItem.isParentFolder)) {
            return false;
        }

        if(commandName === 'download') {
            return itemInfos.every(itemInfo => !itemInfo.fileItem.isDirectory);
        }

        return !command.isSingleFileItemCommand || itemsLength === 1;
    }

}
