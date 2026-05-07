import messageLocalization from '@js/common/core/localization/message';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isString } from '@js/core/utils/type';
import type { Properties as FileManagerProperties } from '@js/ui/file_manager';

type Permissions = FileManagerProperties['permissions'];

export const defaultPermissions: Permissions = {
  create: false,
  copy: false,
  move: false,
  delete: false,
  rename: false,
  upload: false,
  download: false,
};

export interface Command {
  name: string;
  text?: string;
  icon?: string;
  hint?: string;
  enabled?: boolean;
  noFileItemRequired?: boolean;
  isSingleFileItemCommand?: boolean;
}

type Action = (arg?: unknown) => void;

export class FileManagerCommandManager {
  _actions: Record<string, Action>;

  _permissions: Permissions;

  _commands!: Command[];

  _commandMap!: Record<string, Command>;

  constructor(permissions: Permissions) {
    this._actions = {};
    this._permissions = permissions ?? {};

    this._initCommands();
  }

  _initCommands(): void {
    this._commands = [
      {
        name: 'create',
        text: messageLocalization.format('dxFileManager-commandCreate'),
        icon: 'newfolder',
        enabled: this._permissions?.create,
        noFileItemRequired: true,
      },
      {
        name: 'rename',
        text: messageLocalization.format('dxFileManager-commandRename'),
        icon: 'rename',
        enabled: this._permissions?.rename,
        isSingleFileItemCommand: true,
      },
      {
        name: 'move',
        text: messageLocalization.format('dxFileManager-commandMove'),
        icon: 'movetofolder',
        enabled: this._permissions?.move,
      },
      {
        name: 'copy',
        text: messageLocalization.format('dxFileManager-commandCopy'),
        icon: 'copy',
        enabled: this._permissions?.copy,
      },
      {
        name: 'delete',
        text: messageLocalization.format('dxFileManager-commandDelete'),
        icon: 'trash',
        enabled: this._permissions?.delete,
      },
      {
        name: 'download',
        text: messageLocalization.format('dxFileManager-commandDownload'),
        icon: 'download',
        enabled: this._permissions?.download,
      },
      {
        name: 'upload',
        text: messageLocalization.format('dxFileManager-commandUpload'),
        icon: 'upload',
        enabled: this._permissions?.upload,
        noFileItemRequired: true,
      },
      {
        name: 'refresh',
        text: messageLocalization.format('dxFileManager-commandRefresh'),
        icon: 'dx-filemanager-i dx-filemanager-i-refresh',
        enabled: true,
        noFileItemRequired: true,
      },
      {
        name: 'thumbnails',
        text: messageLocalization.format('dxFileManager-commandThumbnails'),
        icon: 'mediumiconslayout',
        enabled: true,
        noFileItemRequired: true,
      },
      {
        name: 'details',
        text: messageLocalization.format('dxFileManager-commandDetails'),
        icon: 'detailslayout',
        enabled: true,
        noFileItemRequired: true,
      },
      {
        name: 'clearSelection',
        text: messageLocalization.format('dxFileManager-commandClearSelection'),
        icon: 'remove',
        enabled: true,
      },
      {
        name: 'showNavPane',
        hint: messageLocalization.format('dxFileManager-commandShowNavPane'),
        icon: 'menu',
        enabled: false,
        noFileItemRequired: true,
      },
    ];

    this._commandMap = {};
    this._commands.forEach((command: Command): void => {
      this._commandMap[command.name] = command;
    });
  }

  registerActions(actions: Record<string, Action>): void {
    this._actions = extend(this._actions, actions);
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types,consistent-return
  executeCommand(command: string | Command, arg?: any): any {
    const commandName = isString(command) ? command : command.name;
    const action = this._actions[commandName];
    if (action) {
      return action(arg);
    }
  }

  updatePermissions(permissions: Permissions): void {
    this._permissions = {
      ...defaultPermissions,
      ...permissions,
    };
    each(this._permissions, (permission): void => {
      this._commandMap[permission].enabled = this._permissions?.[permission];
    });
  }

  setCommandEnabled(commandName: string, enabled: boolean): void {
    const command = this.getCommandByName(commandName);
    if (command) {
      command.enabled = enabled;
    }
  }

  getCommandByName(name: string): Command {
    return this._commandMap[name];
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  isCommandAvailable(commandName: string, itemInfos?: any): boolean {
    const command = this.getCommandByName(commandName);
    if (!command?.enabled) {
      return false;
    }

    if (command.noFileItemRequired) {
      return true;
    }

    const itemsLength = itemInfos?.length || 0;
    if (
      itemsLength === 0
      || itemInfos.some(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        (item) => item.fileItem.isRoot() || item.fileItem.isParentFolder,
      )
    ) {
      return false;
    }

    if (commandName === 'download') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return itemInfos.every((itemInfo): boolean => !itemInfo.fileItem.isDirectory);
    }

    return !command.isSingleFileItemCommand || itemsLength === 1;
  }
}
