/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import '@js/ui/drop_down_button';

import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { ensureDefined } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { getWidth } from '@js/core/utils/size';
import { isDefined, isString } from '@js/core/utils/type';
import type {
  FileManagerItemViewMode,
  Properties as FileManagerProperties,
  ToolbarItemClickEvent,
} from '@js/ui/file_manager';
import {
  current, isCompact, isFluent, isMaterial,
} from '@js/ui/themes';
import Toolbar from '@js/ui/toolbar';
import type { OptionChanged } from '@ts/core/widget/types';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';
import type { Command, FileManagerCommandManager } from '@ts/ui/file_manager/ui.file_manager.command_manager';
import { extendAttributes } from '@ts/ui/file_manager/ui.file_manager.common';

const FILE_MANAGER_TOOLBAR_CLASS = 'dx-filemanager-toolbar';
const FILE_MANAGER_GENERAL_TOOLBAR_CLASS = 'dx-filemanager-general-toolbar';
const FILE_MANAGER_FILE_TOOLBAR_CLASS = 'dx-filemanager-file-toolbar';
const FILE_MANAGER_TOOLBAR_SEPARATOR_ITEM_CLASS = `${FILE_MANAGER_TOOLBAR_CLASS}-separator-item`;
const FILE_MANAGER_TOOLBAR_VIEWMODE_ITEM_CLASS = `${FILE_MANAGER_TOOLBAR_CLASS}-viewmode-item`;
const FILE_MANAGER_TOOLBAR_HAS_LARGE_ICON_CLASS = `${FILE_MANAGER_TOOLBAR_CLASS}-has-large-icon`;
const FILE_MANAGER_VIEW_SWITCHER_POPUP_CLASS = 'dx-filemanager-view-switcher-popup';

const DEFAULT_ITEM_CONFIGS = {
  showNavPane: {
    location: 'before',
  },
  create: {
    location: 'before',
    compactMode: {
      showText: 'inMenu',
      locateInMenu: 'auto',
    },
  },
  upload: {
    location: 'before',
    compactMode: {
      showText: 'inMenu',
      locateInMenu: 'auto',
    },
  },
  refresh: {
    location: 'after',
    showText: 'inMenu',
    cssClass: FILE_MANAGER_TOOLBAR_HAS_LARGE_ICON_CLASS,
    compactMode: {
      showText: 'inMenu',
      locateInMenu: 'auto',
    },
  },
  switchView: {
    location: 'after',
  },
  download: {
    location: 'before',
    compactMode: {
      showText: 'inMenu',
      locateInMenu: 'auto',
    },
  },
  move: {
    location: 'before',
    compactMode: {
      showText: 'inMenu',
      locateInMenu: 'auto',
    },
  },
  copy: {
    location: 'before',
    compactMode: {
      showText: 'inMenu',
      locateInMenu: 'auto',
    },
  },
  rename: {
    location: 'before',
    compactMode: {
      showText: 'inMenu',
      locateInMenu: 'auto',
    },
  },
  delete: {
    location: 'before',
    compactMode: {
      showText: 'inMenu',
    },
  },
  clearSelection: {
    location: 'after',
    locateInMenu: 'never',
    compactMode: {
      showText: 'inMenu',
    },
  },
  separator: {
    location: 'before',
  },
};

const DEFAULT_ITEM_ALLOWED_PROPERTIES = [
  'visible',
  'location',
  'locateInMenu',
  'disabled',
  'showText',
];

const DEFAULT_ITEM_ALLOWED_OPTION_PROPERTIES = [
  'accessKey',
  'elementAttr',
  'height',
  'hint',
  'icon',
  'stylingMode',
  'tabIndex',
  'text',
  'width',
];

const ALWAYS_VISIBLE_TOOLBAR_ITEMS = ['separator', 'switchView'];

const REFRESH_ICON_MAP = {
  default: 'dx-filemanager-i dx-filemanager-i-refresh',
  progress: 'dx-filemanager-i dx-filemanager-i-progress',
  success: 'dx-filemanager-i dx-filemanager-i-done',
  error: 'dx-filemanager-i dx-filemanager-i-danger',
};

const REFRESH_ITEM_PROGRESS_MESSAGE_DELAY = 500;

type GeneralItems = NonNullable<FileManagerProperties['toolbar']>['items'];
type FileItems = NonNullable<FileManagerProperties['toolbar']>['fileSelectionItems'];

interface FileManagerToolbarOptions extends WidgetProperties {
  commandManager?: FileManagerCommandManager;
  generalItems?: GeneralItems;
  fileItems?: FileItems;
  itemViewMode?: FileManagerItemViewMode;
  onItemClick?: (e: ToolbarItemClickEvent) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contextItems?: any;
}

class FileManagerToolbar extends Widget<FileManagerToolbarOptions> {
  _generalToolbarVisible?: boolean;

  _refreshItemState!: { message: string; status: string };

  _$viewSwitcherPopup?: dxElementWrapper;

  _generalToolbar?: Toolbar;

  _fileToolbar?: Toolbar;

  _itemClickedAction?: (e: Partial<ToolbarItemClickEvent>) => void;

  _isRefreshVisibleInFileToolbar?: boolean;

  _refreshItemTextTimeout?: ReturnType<typeof setTimeout>;

  _init(): void {
    super._init();
    this._generalToolbarVisible = true;
    this._refreshItemState = {
      message: '',
      status: 'default',
    };
  }

  _initMarkup(): void {
    this._createItemClickedAction();

    const { generalItems, fileItems } = this.option();

    this._$viewSwitcherPopup = $('<div>').addClass(FILE_MANAGER_VIEW_SWITCHER_POPUP_CLASS);
    this._generalToolbar = this._createToolbar(generalItems, !this._generalToolbarVisible);
    this._fileToolbar = this._createToolbar(fileItems, this._generalToolbarVisible);
    this._$viewSwitcherPopup.appendTo(this.$element());

    this.$element().addClass(`${FILE_MANAGER_TOOLBAR_CLASS} ${FILE_MANAGER_GENERAL_TOOLBAR_CLASS}`);
  }

  _render(): void {
    super._render();
    const toolbar = this._getVisibleToolbar();
    this._checkCompactMode(toolbar);
  }

  _clean(): void {
    // @ts-expect-error ts-error
    delete this._commandManager;
    delete this._itemClickedAction;
    delete this._$viewSwitcherPopup;
    delete this._generalToolbar;
    delete this._fileToolbar;
    super._clean();
  }

  // @ts-expect-error ts-error
  _dimensionChanged(dimension): void {
    if (!dimension || dimension !== 'height') {
      const toolbar = this._getVisibleToolbar();
      this._checkCompactMode(toolbar);
    }
  }

  _getVisibleToolbar(): Toolbar | undefined {
    return this._generalToolbarVisible ? this._generalToolbar : this._fileToolbar;
  }

  _createToolbar(items: GeneralItems | FileItems, hidden?: boolean): Toolbar {
    const toolbarItems = this._getPreparedItems(items);
    const $toolbar = $('<div>').appendTo(this.$element());
    const toolbar = this._createComponent($toolbar, Toolbar, {
      items: toolbarItems,
      visible: !hidden,
      onItemClick: (args) => this._raiseItemClicked(args),
    }) as Toolbar & { compactMode?: boolean };
    toolbar.compactMode = false;
    return toolbar;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getPreparedItems(items) {
    // eslint-disable-next-line no-param-reassign
    items = items.map((item) => {
      let extendedItem = item;
      if (isString(item)) {
        extendedItem = { name: item };
      }
      const commandName = extendedItem.name;
      const preparedItem = this._configureItemByCommandName(commandName, extendedItem);
      preparedItem.originalItemData = item;

      if (commandName !== 'separator') {
        this._setItemVisibleAvailable(preparedItem);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return preparedItem;
    });
    this._updateSeparatorsVisibility(items);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return items;
  }

  _updateSeparatorsVisibility(items, toolbar?: Toolbar): boolean {
    let hasModifications = false;
    const menuItems = this._getMenuItems(toolbar);
    const hasItemsBefore = {
      before: false,
      center: false,
      after: false,
    };
    const itemGroups = {
      before: this._getItemsInGroup(items, menuItems, 'before'),
      center: this._getItemsInGroup(items, menuItems, 'center'),
      after: this._getItemsInGroup(items, menuItems, 'after'),
    };
    items.forEach((item): void => {
      const itemLocation = item.location;
      if (item.name === 'separator') {
        const isSeparatorVisible = hasItemsBefore[itemLocation]
          && this._groupHasItemsAfter(itemGroups[itemLocation]);
        if (item.visible !== isSeparatorVisible) {
          hasModifications = true;
          item.visible = isSeparatorVisible;
        }
        hasItemsBefore[itemLocation] = false;
      } else {
        if (!this._isItemInMenu(menuItems, item)) {
          hasItemsBefore[itemLocation] = hasItemsBefore[itemLocation] || item.visible;
        }
        itemGroups[itemLocation].shift();
      }
    });

    if (toolbar && hasModifications) {
      toolbar.repaint();
    }
    return hasModifications;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getMenuItems(toolbar) {
    const result = toolbar ? toolbar._getMenuItems() : [];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result.map((menuItem) => menuItem.originalItemData);
  }

  _isItemInMenu(menuItems, item): boolean {
    return !!menuItems.length
      && ensureDefined(item.locateInMenu, 'never') !== 'never'
      && menuItems.indexOf(item.originalItemData) !== -1;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getItemsInGroup(items, menuItems, groupName) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return items.filter((item): boolean => item.location === groupName
      && !this._isItemInMenu(menuItems, item));
  }

  _groupHasItemsAfter(items): boolean {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < items.length; i += 1) {
      if (items[i].name !== 'separator' && items[i].visible) {
        return true;
      }
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _configureItemByCommandName(commandName: string, item) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any = {};

    const command = this._commandManager?.getCommandByName(commandName);
    if (command) {
      result = this._createCommandItem(command);
    }

    switch (commandName) {
      case 'separator':
        result = this._createSeparatorItem();
        break;
      case 'switchView':
        result = this._createViewModeItem();
        break;
      default:
        break;
    }

    if (this._isDefaultItem(commandName)) {
      const defaultConfig = DEFAULT_ITEM_CONFIGS[commandName];
      extend(true, result, defaultConfig);
      let resultCssClass = result.cssClass || '';
      extendAttributes(result, item, DEFAULT_ITEM_ALLOWED_PROPERTIES);
      if (isDefined(item.options)) {
        extendAttributes(result.options, item.options, DEFAULT_ITEM_ALLOWED_OPTION_PROPERTIES);
      }
      extendAttributes(result.options, item, ['text', 'icon']);

      if (item.cssClass) {
        resultCssClass = `${resultCssClass} ${item.cssClass}`;
      }

      if (resultCssClass) {
        result.cssClass = resultCssClass;
      }

      if (!isDefined(item.visible)) {
        result._autoHide = true;
      }

      if (result.widget === 'dxButton') {
        if (result.showText === 'inMenu' && !isDefined(result.options.hint)) {
          result.options.hint = result.options.text;
        }

        if (result.compactMode && !isDefined(result.options.hint)) {
          this._configureHintForCompactMode(result);
        }
      }
    } else {
      extend(true, result, item);
      if (!result.widget) {
        result.widget = 'dxButton';
      }
      if (result.widget === 'dxButton' && !result.compactMode && !result.showText && result.options?.icon && result.options.text) {
        result.compactMode = {
          showText: 'inMenu',
        };
      }
    }

    if (commandName && !result.name) {
      extend(result, { name: commandName });
    }

    result.location = ensureDefined(result.location, 'before');

    if (!isDefined(result.options?.stylingMode)) {
      if (result.widget === 'dxButton') {
        extend(true, result, { options: { stylingMode: 'text' } });
      }
      if (result.widget === 'dxSelectBox') {
        extend(true, result, { options: { stylingMode: 'filled' } });
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  }

  _isDefaultItem(commandName: string): boolean {
    return !!DEFAULT_ITEM_CONFIGS[commandName];
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _createCommandItem(command: Command) {
    return {
      widget: 'dxButton',
      options: {
        text: command.text,
        hint: command.hint,
        commandText: command.text,
        icon: command.icon,
        stylingMode: 'text',
        onClick: (): void => this._executeCommand(command),
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _createSeparatorItem() {
    return {
      template: (_, __, element): void => {
        $(element).addClass(FILE_MANAGER_TOOLBAR_SEPARATOR_ITEM_CLASS);
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _createViewModeItem() {
    const commandItems: Command[] = ['details', 'thumbnails'].map((name: string) => {
      const { text, icon } = this._commandManager?.getCommandByName(name) ?? {};
      return { name, text, icon };
    });

    const { itemViewMode } = this.option();

    const selectedIndex = itemViewMode === 'thumbnails' ? 1 : 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dropDownOptions: any = {
      container: this._$viewSwitcherPopup,
    };

    if (isMaterial(current())) {
      dropDownOptions.width = isCompact(current()) ? 28 : 36;
    } else if (isFluent(current())) {
      dropDownOptions.width = isCompact(current()) ? 34 : 40;
    }

    return {
      cssClass: FILE_MANAGER_TOOLBAR_VIEWMODE_ITEM_CLASS,
      widget: 'dxDropDownButton',
      options: {
        items: commandItems,
        keyExpr: 'name',
        selectedItemKey: itemViewMode,
        displayExpr: ' ',
        hint: commandItems[selectedIndex].text,
        stylingMode: 'text',
        showArrowIcon: false,
        useSelectMode: true,
        dropDownOptions,
        onItemClick: (e): void => this._executeCommand(e.itemData.name),
      },
    };
  }

  _configureHintForCompactMode(item): void {
    item.options.hint = '';
    item.compactMode.options = item.compactMode.options || {};
    item.compactMode.options.hint = item.options.text;
  }

  _checkCompactMode(toolbar): void {
    if (toolbar.compactMode) {
      this._toggleCompactMode(toolbar, false);
    }

    const useCompactMode = this._toolbarHasItemsOverflow(toolbar);

    if (toolbar.compactMode !== useCompactMode) {
      if (!toolbar.compactMode) {
        this._toggleCompactMode(toolbar, useCompactMode);
      }
      toolbar.compactMode = useCompactMode;
    } else if (toolbar.compactMode) {
      this._toggleCompactMode(toolbar, true);
    }
  }

  _toolbarHasItemsOverflow(toolbar): boolean {
    const toolbarWidth = getWidth(toolbar.$element());
    const itemsWidth = toolbar._getItemsWidth();
    return toolbarWidth < itemsWidth;
  }

  _toggleCompactMode(toolbar: Toolbar, useCompactMode: boolean): void {
    let hasModifications = false;
    const { items } = toolbar.option();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items?.forEach((item: any): void => {
      if (item.compactMode) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let optionsSource: any = null;

        if (useCompactMode) {
          item.saved = this._getCompactModeOptions(item, item._available);
          optionsSource = item.compactMode;
        } else {
          optionsSource = item.saved;
        }

        const options = this._getCompactModeOptions(optionsSource, item._available);
        extend(true, item, options);
        hasModifications = true;
      }
    });

    hasModifications = this._updateSeparatorsVisibility(items) || hasModifications;
    if (hasModifications) {
      toolbar.repaint();
    }

    this._updateSeparatorsVisibility(items, toolbar);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getCompactModeOptions(optionsSource, available) {
    const {
      showText,
      locateInMenu,
      options,
    } = optionsSource || {};
    return {
      visible: available,
      showText: ensureDefined(showText, 'always'),
      locateInMenu: ensureDefined(locateInMenu, 'never'),
      options: {
        hint: options?.hint,
      },
    };
  }

  _ensureAvailableCommandsVisible(toolbar): void {
    let hasModifications = false;
    const items = toolbar.option('items');

    items.forEach((item): void => {
      if (item.name !== 'separator') {
        const itemVisible = item._available;
        this._setItemVisibleAvailable(item);
        if (item._available !== itemVisible) {
          hasModifications = true;
        }
      }
    });

    hasModifications = this._updateSeparatorsVisibility(items) || hasModifications;
    if (hasModifications) {
      toolbar.repaint();
    }

    this._updateSeparatorsVisibility(items, toolbar);
  }

  _setItemVisibleAvailable(item): void {
    const originalVisible = item.originalItemData?.visible;
    item._available = this._isToolbarItemAvailable(item);
    item.visible = isDefined(originalVisible) ? originalVisible : item._available;
  }

  _fileToolbarHasEffectiveItems(): boolean | undefined {
    const { items } = this._fileToolbar?.option() ?? {};
    return items?.some((item) => this._isFileToolbarItemAvailable(item));
  }

  _executeCommand(command): void {
    this._commandManager?.executeCommand(command);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _isToolbarItemAvailable(toolbarItem) {
    if (!this._isDefaultItem(toolbarItem.name) || !toolbarItem._autoHide) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return ensureDefined(toolbarItem.visible, true);
    }
    if (toolbarItem.name === 'refresh') {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      return this._generalToolbarVisible || !!this._isRefreshVisibleInFileToolbar;
    }

    if (ALWAYS_VISIBLE_TOOLBAR_ITEMS.includes(toolbarItem.name)) {
      return true;
    }

    return this._isCommandAvailable(toolbarItem.name);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _isFileToolbarItemAvailable({ name, visible }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return !this._isDefaultItem(name)
      // eslint-disable-next-line @stylistic/no-mixed-operators
      && ensureDefined(visible, true)
      // eslint-disable-next-line @stylistic/no-mixed-operators
      || name !== 'clearSelection'
      && name !== 'refresh'
      // eslint-disable-next-line @stylistic/no-mixed-operators
      && this._isCommandAvailable(name);
  }

  _isCommandAvailable(name: string): boolean {
    const { contextItems } = this.option();

    return !!this._commandManager?.isCommandAvailable(name, contextItems);
  }

  _updateItemInToolbar(toolbar: Toolbar, commandName: string, options): void {
    toolbar.beginUpdate();

    const { items } = toolbar.option();
    if (items?.length) {
      for (let i = 0; i < items?.length; i += 1) {
        const item = items?.[i];
        if (item.name === commandName) {
          toolbar.option(`items[${i}]`, options);
          break;
        }
      }
    }

    toolbar.endUpdate();
  }

  _raiseItemClicked(args): void {
    const changedArgs = extend(true, {}, args);
    changedArgs.itemData = args.itemData.originalItemData;
    this._itemClickedAction?.(changedArgs);
  }

  _createItemClickedAction(): void {
    this._itemClickedAction = this._createActionByOption('onItemClick');
  }

  _getDefaultOptions(): FileManagerToolbarOptions {
    return {
      ...super._getDefaultOptions(),
      commandManager: undefined,
      generalItems: [],
      fileItems: [],
      contextItems: [],
      itemViewMode: 'details',
      onItemClick: undefined,
    };
  }

  _optionChanged(args: OptionChanged<FileManagerToolbarOptions>): void {
    const { name } = args;

    switch (name) {
      case 'commandManager':
      case 'itemViewMode':
      case 'generalItems':
      case 'fileItems':
        this.repaint();
        break;
      case 'contextItems':
        this._update();
        break;
      case 'onItemClick':
        this._itemClickedAction = this._createActionByOption(name);
        break;
      default:
        super._optionChanged(args);
    }
  }

  updateItemPermissions(): void {
    this.repaint();
    this._restoreRefreshItemState();
  }

  _restoreRefreshItemState(): void {
    this.updateRefreshItem(this._refreshItemState?.message, this._refreshItemState?.status);
  }

  updateRefreshItem(message: string, status: string): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let generalToolbarOptions: any = null;
    let text = messageLocalization.format('dxFileManager-commandRefresh');
    let showText = 'inMenu';

    this._isRefreshVisibleInFileToolbar = false;
    this._refreshItemState = { message, status };

    if (status === 'default') {
      generalToolbarOptions = {
        options: {
          icon: REFRESH_ICON_MAP.default,
        },
      };
    } else {
      generalToolbarOptions = {
        options: {
          icon: REFRESH_ICON_MAP[status],
        },
      };
      this._isRefreshVisibleInFileToolbar = true;
      text = message;
      showText = 'always';
    }

    const fileToolbarOptions = extend(
      {},
      generalToolbarOptions,
      { visible: this._isRefreshVisibleInFileToolbar },
    );
    this._applyRefreshItemOptions(generalToolbarOptions, fileToolbarOptions);
    this._refreshItemTextTimeout = this._updateRefreshItemText(status === 'progress', text, showText);
  }

  _updateRefreshItemText(
    isDeferredUpdate,
    text,
    showText,

  ): ReturnType<typeof setTimeout> | undefined {
    const options = {
      showText,
      options: {
        text,
      },
    };
    if (isDeferredUpdate) {
      // eslint-disable-next-line no-restricted-globals
      return setTimeout((): void => {
        this._applyRefreshItemOptions(options);
        this._refreshItemTextTimeout = undefined;
      }, REFRESH_ITEM_PROGRESS_MESSAGE_DELAY);
    }
    if (this._refreshItemTextTimeout) {
      clearTimeout(this._refreshItemTextTimeout);
    }
    this._applyRefreshItemOptions(options);
    return undefined;
  }

  _applyRefreshItemOptions(generalToolbarOptions, fileToolbarOptions?): void {
    if (!fileToolbarOptions) {
      // eslint-disable-next-line no-param-reassign
      fileToolbarOptions = extend({}, generalToolbarOptions);
    }
    // @ts-expect-error ts-error
    this._updateItemInToolbar(this._generalToolbar, 'refresh', generalToolbarOptions);
    // @ts-expect-error ts-error
    this._updateItemInToolbar(this._fileToolbar, 'refresh', fileToolbarOptions);
  }

  _update(): void {
    const { contextItems } = this.option();
    const showGeneralToolbar = contextItems.length === 0 || !this._fileToolbarHasEffectiveItems();
    if (this._generalToolbarVisible !== showGeneralToolbar) {
      this._generalToolbar?.option('visible', showGeneralToolbar);
      this._fileToolbar?.option('visible', !showGeneralToolbar);
      this._generalToolbarVisible = showGeneralToolbar;

      this.$element().toggleClass(FILE_MANAGER_GENERAL_TOOLBAR_CLASS, showGeneralToolbar);
      this.$element().toggleClass(FILE_MANAGER_FILE_TOOLBAR_CLASS, !showGeneralToolbar);
    }

    const toolbar = this._getVisibleToolbar();
    this._ensureAvailableCommandsVisible(toolbar);
    this._checkCompactMode(toolbar);
  }

  get _commandManager(): FileManagerCommandManager | undefined {
    const { commandManager } = this.option();
    return commandManager;
  }
}

export default FileManagerToolbar;
