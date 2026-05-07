/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { PositionConfig } from '@js/common/core/animation';
import $ from '@js/core/renderer';
import { ensureDefined } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { isDefined, isString } from '@js/core/utils/type';
import ContextMenu from '@js/ui/context_menu';
import type {
  ContextMenuItem,
  ContextMenuItemClickEvent,
  ContextMenuShowingEvent,
  Properties as FileManagerProperties,
} from '@js/ui/file_manager';
import type { OptionChanged } from '@ts/core/widget/types';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';
import type { FileManagerCommandManager } from '@ts/ui/file_manager/ui.file_manager.command_manager';
import { extendAttributes } from '@ts/ui/file_manager/ui.file_manager.common';

const FILEMANAGER_CONTEXT_MEMU_CLASS = 'dx-filemanager-context-menu';

const DEFAULT_CONTEXT_MENU_ITEMS = {
  create: {},
  upload: {},
  download: {},
  rename: {},
  move: {},
  copy: {},
  delete: {},
  refresh: {
    beginGroup: true,
  },
};

const DEFAULT_ITEM_ALLOWED_PROPERTIES = [
  'beginGroup',
  'closeMenuOnClick',
  'disabled',
  'icon',
  'selectable',
  'selected',
  'text',
  'visible',
];

interface FileManagerContextMenuActions {
  onItemClick?: (e: Partial<ContextMenuItemClickEvent>) => void;
  onContextMenuShowing?: (e: Partial<ContextMenuShowingEvent>) => void;
  onContextMenuHidden?: () => void;
}

interface FileManagerContextMenuOptions extends WidgetProperties {
  commandManager?: FileManagerCommandManager;
  items?: NonNullable<FileManagerProperties['contextMenu']>['items'];
  onItemClick?: (e: ContextMenuItemClickEvent) => void;
  onContextMenuShowing?: (e: ContextMenuShowingEvent) => void;
  onContextMenuHidden?: () => void;
  isolateCreationItemCommands?: boolean;
  viewArea?: string;
}

class FileManagerContextMenu extends Widget<FileManagerContextMenuOptions> {
  _actions!: FileManagerContextMenuActions;

  _contextMenu?: ContextMenu;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _menuShowingContext?: any;

  // @ts-expect-error ts-error
  _isVisible?: boolean;

  _targetFileItem?: ContextMenuItem;

  _targetFileItems?: ContextMenuItem[];

  _initMarkup(): void {
    this._initActions();

    this._isVisible = false;

    const $menu = $('<div>').appendTo(this.$element());
    this._contextMenu = this._createComponent($menu, ContextMenu, {
      cssClass: FILEMANAGER_CONTEXT_MEMU_CLASS,
      showEvent: '',
      onItemClick: (args): void => this._onContextMenuItemClick(args.itemData.name, args),
      onShowing: (e): void => this._onContextMenuShowing(e),
      onShown: (): void => this._onContextMenuShown(),
      onHidden: (): void => this._onContextMenuHidden(),
    });

    super._initMarkup();
  }

  showAt(fileItems, element, event, target): void {
    const { itemData, itemElement, isActionButton = false } = target;
    if (this._isVisible) {
      this._onContextMenuHidden();
    }
    this._menuShowingContext = {
      targetElement: itemElement,
      itemData,
      fileItems,
      event,
      isActionButton,
    };

    const position: PositionConfig = {
      of: element,
      // @ts-expect-error ts-error
      at: 'top left',
      // @ts-expect-error ts-error
      my: 'top left',
      offset: '',
    };

    if (event) {
      position.offset = `${event.offsetX} ${event.offsetY}`;
    } else {
      position.my = 'left top';
      position.at = 'left bottom';
      position.boundaryOffset = '1';
    }

    this._contextMenu?.option({
      target: element,
      position,
    });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._contextMenu?.show();
  }

  createContextMenuItems(fileItems, contextMenuItems?, targetFileItem?): ContextMenuItem[] {
    this._targetFileItems = fileItems;
    this._targetFileItem = isDefined(targetFileItem)
      ? targetFileItem
      : fileItems?.[0];

    const result: ContextMenuItem[] = [];

    const itemArray = contextMenuItems || this.option('items');
    itemArray.forEach((srcItem): void => {
      const commandName = isString(srcItem) ? srcItem : srcItem.name;
      const item = this._configureItemByCommandName(
        commandName,
        srcItem,
        fileItems,
        this._targetFileItem,
      );
      if (this._isContextMenuItemAvailable(item, fileItems)) {
        result.push(item);
      }
    });

    return result;
  }

  _isContextMenuItemAvailable(menuItem, fileItems): boolean | undefined {
    if (!this._isDefaultItem(menuItem.name) || !menuItem._autoHide) {
      return ensureDefined<boolean>(menuItem.visible, true);
    }

    if (
      this._isIsolatedCreationItemCommand(menuItem.name)
      && fileItems?.length
    ) {
      return false;
    }

    return this._commandManager?.isCommandAvailable(menuItem.name, fileItems);
  }

  _isIsolatedCreationItemCommand(commandName: string): boolean | undefined {
    const { isolateCreationItemCommands } = this.option();
    return (
      (commandName === 'create' || commandName === 'upload')
      && isolateCreationItemCommands
    );
  }

  _isDefaultItem(commandName: string): boolean {
    return !!DEFAULT_CONTEXT_MENU_ITEMS[commandName];
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _configureItemByCommandName(commandName: string, item, fileItems, targetFileItem) {
    if (!this._isDefaultItem(commandName)) {
      const res = extend(true, {}, item);
      res.originalItemData = item;
      this._addItemClickHandler(commandName, res);
      if (Array.isArray(item.items)) {
        res.items = this.createContextMenuItems(
          fileItems,
          item.items,
          targetFileItem,
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return res;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = this._createMenuItemByCommandName(commandName);
    const defaultConfig = DEFAULT_CONTEXT_MENU_ITEMS[commandName];
    extend(result, defaultConfig);
    result.originalItemData = item;
    extendAttributes(result, item, DEFAULT_ITEM_ALLOWED_PROPERTIES);

    if (!isDefined(result.visible)) {
      result._autoHide = true;
    }

    if (commandName && !result.name) {
      extend(result, { name: commandName });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  }

  _createMenuItemByCommandName(commandName: string): ContextMenuItem {
    const { text, icon } = this._commandManager?.getCommandByName(commandName) ?? {};
    const menuItem = {
      name: commandName,
      text,
      icon,
    };
    this._addItemClickHandler(commandName, menuItem);
    return menuItem;
  }

  _addItemClickHandler(commandName: string, contextMenuItem): void {
    contextMenuItem.onItemClick = (args): void => this._onContextMenuItemClick(commandName, args);
  }

  _onContextMenuItemClick(commandName: string, args): void {
    const changedArgs = extend(true, {}, args);
    changedArgs.itemData = args.itemData.originalItemData;
    changedArgs.fileSystemItem = this._targetFileItem?.fileItem;
    const { viewArea } = this.option();
    changedArgs.viewArea = viewArea;
    this._actions?.onItemClick?.(changedArgs);
    if (this._isDefaultItem(commandName)) {
      const targetFileItems = this._isIsolatedCreationItemCommand(commandName)
        ? null
        : this._targetFileItems;
      this._commandManager?.executeCommand(commandName, targetFileItems);
    }
  }

  _initActions(): void {
    this._actions = {
      onContextMenuHidden: this._createActionByOption('onContextMenuHidden'),
      onContextMenuShowing: this._createActionByOption('onContextMenuShowing'),
      onItemClick: this._createActionByOption('onItemClick'),
    };
  }

  _onContextMenuShowing(e): void {
    if (this._isVisible) {
      this._onContextMenuHidden(true);
    }
    // eslint-disable-next-line no-param-reassign
    e = extend(e, this._menuShowingContext, {
      options: this.option(),
      cancel: false,
    });
    this._actions?.onContextMenuShowing?.(e);
    if (!e.cancel) {
      const items = this.createContextMenuItems(
        this._menuShowingContext.fileItems,
        null,
        this._menuShowingContext.fileSystemItem,
      );
      this._contextMenu?.option('dataSource', items);
    }
  }

  tryUpdateVisibleContextMenu(): void {
    if (this._isVisible) {
      const items = this.createContextMenuItems(this._targetFileItems);
      this._contextMenu?.option('dataSource', items);
    }
  }

  _onContextMenuShown(): void {
    this._isVisible = true;
  }

  _onContextMenuHidden(preserveContext?): void {
    this._isVisible = false;
    if (!preserveContext) {
      this._menuShowingContext = {};
    }
    this._contextMenu?.option('visible', false);
    this._raiseContextMenuHidden();
  }

  _raiseContextMenuHidden(): void {
    this._actions?.onContextMenuHidden?.();
  }

  _getDefaultOptions(): FileManagerContextMenuOptions {
    return {
      ...super._getDefaultOptions(),
      commandManager: undefined,
      onContextMenuHidden: undefined,
      onItemClick: undefined,
    };
  }

  _optionChanged(args: OptionChanged<FileManagerContextMenuOptions>): void {
    const { name } = args;

    switch (name) {
      case 'commandManager':
        this.repaint();
        break;
      case 'items':
        this.tryUpdateVisibleContextMenu();
        break;
      case 'onItemClick':
      case 'onContextMenuShowing':
      case 'onContextMenuHidden':
        this._actions[name] = this._createActionByOption(name);
        break;
      default:
        super._optionChanged(args);
    }
  }

  get _commandManager(): FileManagerCommandManager | undefined {
    const { commandManager } = this.option();
    return commandManager;
  }
}

export default FileManagerContextMenu;
