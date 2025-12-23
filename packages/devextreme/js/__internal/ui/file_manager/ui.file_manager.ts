/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import { normalizeOptions } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { ensureDefined, equalByValue } from '@js/core/utils/common';
import { equals } from '@js/core/utils/comparator';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import {
  isDefined, isEmptyObject, isFunction, type,
} from '@js/core/utils/type';
import type {
  ContextMenuItemClickEvent,
  ContextMenuShowingEvent,
  CurrentDirectoryChangedEvent,
  DirectoryCreatedEvent,
  DirectoryCreatingEvent,
  ErrorOccurredEvent,
  FileUploadedEvent,
  FileUploadingEvent,
  FocusedItemChangedEvent,
  ItemCopiedEvent,
  ItemCopyingEvent,
  ItemDeletedEvent,
  ItemDeletingEvent,
  ItemDownloadingEvent,
  ItemMovedEvent,
  ItemMovingEvent,
  ItemRenamedEvent,
  ItemRenamingEvent,
  Properties,
  SelectedFileOpenedEvent,
  SelectionChangedEvent,
  ToolbarItemClickEvent,
} from '@js/ui/file_manager';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import { FileItemsController, OPERATIONS } from '@ts/ui/file_manager/file_items_controller';
import FileManagerAdaptivityControl from '@ts/ui/file_manager/ui.file_manager.adaptivity';
import FileManagerBreadcrumbs from '@ts/ui/file_manager/ui.file_manager.breadcrumbs';
import { defaultPermissions, FileManagerCommandManager } from '@ts/ui/file_manager/ui.file_manager.command_manager';
import { extendAttributes, findItemsByKeys } from '@ts/ui/file_manager/ui.file_manager.common';
import FileManagerContextMenu from '@ts/ui/file_manager/ui.file_manager.context_menu';
import FileManagerEditingControl from '@ts/ui/file_manager/ui.file_manager.editing';
import FileManagerFilesTreeView from '@ts/ui/file_manager/ui.file_manager.files_tree_view';
import FileManagerDetailsItemList from '@ts/ui/file_manager/ui.file_manager.item_list.details';
import FileManagerThumbnailsItemList from '@ts/ui/file_manager/ui.file_manager.item_list.thumbnails';
import FileManagerNotificationControl from '@ts/ui/file_manager/ui.file_manager.notification';
import FileManagerToolbar from '@ts/ui/file_manager/ui.file_manager.toolbar';
import notify from '@ts/ui/notify';

const FILE_MANAGER_CLASS = 'dx-filemanager';
const FILE_MANAGER_WRAPPER_CLASS = `${FILE_MANAGER_CLASS}-wrapper`;
const FILE_MANAGER_CONTAINER_CLASS = `${FILE_MANAGER_CLASS}-container`;
const FILE_MANAGER_DIRS_PANEL_CLASS = `${FILE_MANAGER_CLASS}-dirs-panel`;
const FILE_MANAGER_EDITING_CONTAINER_CLASS = `${FILE_MANAGER_CLASS}-editing-container`;
const FILE_MANAGER_ITEMS_PANEL_CLASS = `${FILE_MANAGER_CLASS}-items-panel`;
const FILE_MANAGER_ITEM_CUSTOM_THUMBNAIL_CLASS = `${FILE_MANAGER_CLASS}-item-custom-thumbnail`;

const PARENT_DIRECTORY_KEY_PREFIX = '[*DXPDK*]$40F96F03-FBD8-43DF-91BE-F55F4B8BA871$';

const VIEW_AREAS = {
  folders: 'navPane',
  items: 'itemView',
};

export interface FileManagerActions {
  onContextMenuItemClick?: (e: Partial<ContextMenuItemClickEvent>) => void;
  onContextMenuShowing?: (e: Partial<ContextMenuShowingEvent>) => void;
  onCurrentDirectoryChanged?: (e: Partial<CurrentDirectoryChangedEvent>) => void;
  onSelectedFileOpened?: (e: Partial<SelectedFileOpenedEvent>) => void;
  onSelectionChanged?: (e: Partial<SelectionChangedEvent>) => void;
  onToolbarItemClick?: (e: Partial<ToolbarItemClickEvent>) => void;
  onFocusedItemChanged?: (e: Partial<FocusedItemChangedEvent>) => void;
  onErrorOccurred?: (e: Partial<ErrorOccurredEvent>) => void;
  editing: {
    onDirectoryCreating?: (e: Partial<DirectoryCreatingEvent>) => void;
    onDirectoryCreated?: (e: Partial<DirectoryCreatedEvent>) => void;
    onItemRenaming?: (e: Partial<ItemRenamingEvent>) => void;
    onItemRenamed?: (e: Partial<ItemRenamedEvent>) => void;
    onItemMoving?: (e: Partial<ItemMovingEvent>) => void;
    onItemMoved?: (e: Partial<ItemMovedEvent>) => void;
    onItemCopying?: (e: Partial<ItemCopyingEvent>) => void;
    onItemCopied?: (e: Partial<ItemCopiedEvent>) => void;
    onItemDeleting?: (e: Partial<ItemDeletingEvent>) => void;
    onItemDeleted?: (e: Partial<ItemDeletedEvent>) => void;
    onFileUploading?: (e: Partial<FileUploadingEvent>) => void;
    onFileUploaded?: (e: Partial<FileUploadedEvent>) => void;
    onItemDownloading?: (e: Partial<ItemDownloadingEvent>) => void;
  };
}

export interface ItemThumbnailInfo {
  thumbnail?: string;
  cssClass?: string;
}

class FileManager extends Widget<Properties> {
  _providerUpdateDeferred?: DeferredObj<unknown> | null;

  _lockCurrentPathProcessing?: boolean;

  _wasRendered?: boolean;

  _controller?: FileItemsController;

  _commandManager?: FileManagerCommandManager;

  _firstItemViewLoad?: boolean;

  _lockSelectionProcessing?: boolean;

  _lockFocusedItemProcessing?: boolean;

  _itemKeyToFocus?: string;

  _loadedWidgets?: string[];

  _notificationControl?: FileManagerNotificationControl;

  _actions!: FileManagerActions;

  _$wrapper!: dxElementWrapper;

  _toolbar?: FileManagerToolbar;

  _adaptivityControl?: FileManagerAdaptivityControl;

  _editing?: FileManagerEditingControl;

  _$itemsPanel?: dxElementWrapper;

  _filesTreeView?: FileManagerFilesTreeView;

  _filesTreeViewContextMenu?: FileManagerContextMenu;

  _itemViewContextMenu?: FileManagerContextMenu;

  _itemView?: FileManagerThumbnailsItemList | FileManagerDetailsItemList;

  _breadcrumbs?: FileManagerBreadcrumbs;

  _initTemplates(): void {}

  _init(): void {
    super._init();
    this._initActions();

    this._providerUpdateDeferred = null;
    this._lockCurrentPathProcessing = false;
    this._wasRendered = false;

    const {
      currentPath,
      currentPathKeys,
      rootFolderName,
      fileSystemProvider,
      allowedFileExtensions,
      upload,
    } = this.option();

    this._controller = new FileItemsController({
      currentPath,
      currentPathKeys,
      rootText: rootFolderName,
      fileProvider: fileSystemProvider,
      allowedFileExtensions,
      uploadMaxFileSize: upload?.maxFileSize,
      uploadChunkSize: upload?.chunkSize,
      onInitialized: this._onControllerInitialized.bind(this),
      onDataLoading: this._onDataLoading.bind(this),
      onSelectedDirectoryChanged: this._onSelectedDirectoryChanged.bind(this),
      onPathPotentiallyChanged: this._checkPathActuality.bind(this),
      editingEvents: this._actions.editing,
    });
  }

  _initMarkup(): void {
    super._initMarkup();

    this._firstItemViewLoad = true;
    this._lockSelectionProcessing = false;
    this._lockFocusedItemProcessing = false;
    this._itemKeyToFocus = undefined;
    this._loadedWidgets = [];

    const { permissions } = this.option();
    this._commandManager = new FileManagerCommandManager(permissions);

    this.$element().addClass(FILE_MANAGER_CLASS);

    if (this._wasRendered) {
      this._prepareToLoad();
    } else {
      this._wasRendered = true;
    }
    this._createNotificationControl();

    this._initCommandManager();
  }

  _createNotificationControl(): void {
    const $notificationControl = $('<div>')
      .addClass('dx-filemanager-notification-container')
      .appendTo(this.$element());

    const { notifications } = this.option();

    this._notificationControl = this._createComponent(
      $notificationControl,
      FileManagerNotificationControl,
      {
        progressPanelContainer: this.$element(),
        // eslint-disable-next-line @stylistic/max-len
        contentTemplate: (container, notificationControl): void => this._createWrapper(container, notificationControl),
        onActionProgress: (e): void => this._onActionProgress(e),
        positionTargetSelector: `.${FILE_MANAGER_CONTAINER_CLASS}`,
        showProgressPanel: notifications?.showPanel,
        showNotificationPopup: notifications?.showPopup,
      },
    );
  }

  _createWrapper(container, notificationControl): void {
    this._$wrapper = $('<div>')
      .addClass(FILE_MANAGER_WRAPPER_CLASS)
      .appendTo(container);

    this._createEditing(notificationControl);

    const { toolbar, itemView } = this.option();

    const $toolbar = $('<div>').appendTo(this._$wrapper);
    this._toolbar = this._createComponent($toolbar, FileManagerToolbar, {
      commandManager: this._commandManager,
      generalItems: toolbar?.items,
      fileItems: toolbar?.fileSelectionItems,
      itemViewMode: itemView?.mode,
      onItemClick: (args) => this._actions.onToolbarItemClick?.(args),
    });

    this._createAdaptivityControl();
  }

  _createAdaptivityControl(): void {
    const $container = $('<div>')
      .addClass(FILE_MANAGER_CONTAINER_CLASS)
      .appendTo(this._$wrapper);

    this._adaptivityControl = this._createComponent($container, FileManagerAdaptivityControl, {
      drawerTemplate: (container) => this._createFilesTreeView(container),
      contentTemplate: (container) => this._createItemsPanel(container),
      onAdaptiveStateChanged: (e) => this._onAdaptiveStateChanged(e),
    });
    this._editing?.setUploaderSplitterElement(this._adaptivityControl.getSplitterElement());
  }

  _createEditing(notificationControl): void {
    const $editingContainer = $('<div>')
      .addClass(FILE_MANAGER_EDITING_CONTAINER_CLASS)
      .appendTo(this.$element());

    const { rtlEnabled } = this.option();

    this._editing = this._createComponent($editingContainer, FileManagerEditingControl, {
      controller: this._controller,
      model: {
        getMultipleSelectedItems: this._getSelectedItemInfos.bind(this),
      },
      getItemThumbnail: this._getItemThumbnailInfo.bind(this),
      notificationControl,
      uploadDropZonePlaceholderContainer: this.$element(),
      rtlEnabled,
      onSuccess: ({ updatedOnlyFiles }): void => this._redrawComponent(updatedOnlyFiles),
      onError: (e): void => this._onEditingError(e),
    });
  }

  _createItemsPanel($container: dxElementWrapper): void {
    this._$itemsPanel = $('<div>')
      .addClass(FILE_MANAGER_ITEMS_PANEL_CLASS)
      .appendTo($container);

    this._createBreadcrumbs(this._$itemsPanel);
    this._createItemView(this._$itemsPanel);
    this._updateUploadDropZone();
  }

  _updateUploadDropZone(): void {
    const dropZone = this._commandManager?.isCommandAvailable('upload') ? this._$itemsPanel : $();
    this._editing?.setUploaderDropZone(dropZone);
  }

  _createFilesTreeView(container): void {
    this._filesTreeViewContextMenu = this._createContextMenu(false, VIEW_AREAS.folders);

    const $filesTreeView = $('<div>')
      .addClass(FILE_MANAGER_DIRS_PANEL_CLASS)
      .appendTo(container);

    this._filesTreeView = this._createComponent($filesTreeView, FileManagerFilesTreeView, {
      storeExpandedState: true,
      contextMenu: this._filesTreeViewContextMenu,
      getDirectories: this.getDirectories.bind(this),
      getCurrentDirectory: this._getCurrentDirectory.bind(this),
      onDirectoryClick: ({ itemData }): void => this._setCurrentDirectory(itemData),
      onItemListDataLoaded: (): void => this._tryEndLoading(VIEW_AREAS.folders),
    });

    this._filesTreeView.updateCurrentDirectory();
  }

  _createItemView($container, viewMode?): void {
    this._itemViewContextMenu = this._createContextMenu(true, VIEW_AREAS.items);

    const {
      itemView,
      selectionMode,
      selectedItemKeys,
      focusedItemKey,
      customizeDetailColumns,
    } = this.option();

    const options = {
      selectionMode,
      selectedItemKeys,
      focusedItemKey,
      contextMenu: this._itemViewContextMenu,
      getItems: this._getItemViewItems.bind(this),
      onError: ({ error }): void => this._showError(error),
      onSelectionChanged: this._onItemViewSelectionChanged.bind(this),
      onFocusedItemChanged: this._onItemViewFocusedItemChanged.bind(this),
      onSelectedItemOpened: this._onSelectedItemOpened.bind(this),
      onContextMenuShowing: (e): void => this._onContextMenuShowing(VIEW_AREAS.items, e),
      onItemListItemsLoaded: (): void => this._tryEndLoading(VIEW_AREAS.items),
      getItemThumbnail: this._getItemThumbnailInfo.bind(this),
      customizeDetailColumns,
      detailColumns: itemView?.details?.columns,
    };

    const $itemView = $('<div>').appendTo($container);

    // eslint-disable-next-line no-param-reassign
    viewMode = viewMode || itemView?.mode;
    const widgetClass = viewMode === 'thumbnails' ? FileManagerThumbnailsItemList : FileManagerDetailsItemList;
    // @ts-expect-error ts-error
    this._itemView = this._createComponent($itemView, widgetClass, options);
  }

  _createBreadcrumbs($container): void {
    const $breadcrumbs = $('<div>').appendTo($container);
    const { rootFolderName } = this.option();
    this._breadcrumbs = this._createComponent($breadcrumbs, FileManagerBreadcrumbs, {
      rootFolderDisplayName: rootFolderName,
      // eslint-disable-next-line @stylistic/max-len
      onCurrentDirectoryChanging: ({ currentDirectory }): void => this._setCurrentDirectory(currentDirectory, true),
    });
    this._breadcrumbs.setCurrentDirectory(this._getCurrentDirectory());
  }

  _createContextMenu(
    isolateCreationItemCommands: boolean,
    viewArea: string,
  ): FileManagerContextMenu {
    const $contextMenu = $('<div>').appendTo(this._$wrapper);
    const { contextMenu } = this.option();
    return this._createComponent($contextMenu, FileManagerContextMenu, {
      commandManager: this._commandManager,
      items: contextMenu?.items,
      onItemClick: (args) => this._actions.onContextMenuItemClick?.(args),
      onContextMenuShowing: (e) => this._onContextMenuShowing(viewArea, e),
      isolateCreationItemCommands,
      viewArea,
    });
  }

  _initCommandManager(): void {
    const actions = extend(this._editing?.getCommandActions(), {
      refresh: () => this._refreshAndShowProgress(),
      thumbnails: () => this.option('itemView.mode', 'thumbnails'),
      details: () => this.option('itemView.mode', 'details'),
      clearSelection: () => this._clearSelection(),
      showNavPane: () => this._adaptivityControl?.toggleDrawer(),
    });
    this._commandManager?.registerActions(actions);
  }

  _onItemViewSelectionChanged({
    selectedItemInfos,
    selectedItems,
    selectedItemKeys,
    currentSelectedItemKeys,
    currentDeselectedItemKeys,
  }): void {
    this._lockSelectionProcessing = true;
    this.option('selectedItemKeys', selectedItemKeys);
    this._lockSelectionProcessing = false;

    this._actions.onSelectionChanged?.({
      selectedItems, selectedItemKeys, currentSelectedItemKeys, currentDeselectedItemKeys,
    });

    this._updateToolbar(selectedItemInfos);
  }

  _onItemViewFocusedItemChanged(e): void {
    this._lockFocusedItemProcessing = true;
    this.option('focusedItemKey', e.itemKey);
    this._lockFocusedItemProcessing = false;

    this._actions.onFocusedItemChanged?.({
      item: e.item,
      itemElement: e.itemElement,
    });
  }

  _onAdaptiveStateChanged({ enabled }): void {
    this._commandManager?.setCommandEnabled('showNavPane', enabled);
    this._updateToolbar();
  }

  _onActionProgress({ message, status }): void {
    this._toolbar?.updateRefreshItem(message, status);
    this._updateToolbar();
  }

  _onEditingError(e): void {
    const args = extendAttributes({ }, e, ['errorCode', 'errorText', 'fileSystemItem']);
    this._actions.onErrorOccurred?.(args);
    e.errorText = args.errorText;
  }

  _refreshAndShowProgress(): DeferredObj<unknown> {
    this._prepareToLoad();
    return when(this._notificationControl?.tryShowProgressPanel(), this._controller?.refresh())
      .then(() => this._filesTreeView?.refresh());
  }

  _isAllWidgetsLoaded(): boolean {
    return this._loadedWidgets?.length === 2
      && this._loadedWidgets?.includes(VIEW_AREAS.folders)
      && this._loadedWidgets?.includes(VIEW_AREAS.items);
  }

  _tryEndLoading(area): void {
    this._loadedWidgets?.push(area);
    if (this._isAllWidgetsLoaded()) {
      this._controller?.endSingleLoad();
    }
  }

  _prepareToLoad(): void {
    this._loadedWidgets = [];
    this._controller?.startSingleLoad();
  }

  _updateToolbar(selectedItems?): void {
    const items = selectedItems || this._getSelectedItemInfos();
    this._toolbar?.option('contextItems', ensureDefined(items, []));
  }

  _switchView(viewMode): void {
    this._disposeWidget(this._itemView?.option('contextMenu'));
    this._disposeWidget(this._itemView);

    this._createItemView(this._$itemsPanel, viewMode);
    this._toolbar?.option({ itemViewMode: viewMode });
  }

  _disposeWidget(widget): void {
    widget.dispose();
    widget.$element().remove();
  }

  _clearSelection(): void {
    this._itemView?.clearSelection();
  }

  _showError(message: string): void { // TODO use notification control instead of it
    this._showNotification(message, false);
  }

  _showNotification(message: string, isSuccess: boolean): void {
    notify({
      message,
      width: 450,
    }, isSuccess ? 'success' : 'error', 5000);
  }

  _redrawComponent(onlyFileItemsView): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._itemView?.refresh()?.then(() => !onlyFileItemsView && this._filesTreeView?.refresh());
  }

  _getItemViewItems(): Properties['itemView'][] {
    const { itemView } = this.option();

    let result = this._controller?.getCurrentItems(!itemView?.showFolders);

    this._updateToolbarWithSelectionOnFirstLoad(result);

    if (itemView?.showParentFolder) {
      result = when(result)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .then((items) => this._getPreparedItemViewItems(items));
    }

    // @ts-expect-error ts-error
    return result;
  }

  _updateToolbarWithSelectionOnFirstLoad(itemsResult): void {
    if (!this._firstItemViewLoad) {
      return;
    }

    this._firstItemViewLoad = false;
    const { selectedItemKeys } = this.option();
    if (selectedItemKeys?.length && selectedItemKeys.length > 0) {
      when(itemsResult).done((items): void => {
        const selectedItems = findItemsByKeys(items, selectedItemKeys);
        if (selectedItems.length > 0) {
          this._updateToolbar(selectedItems);
        }
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getPreparedItemViewItems(items) {
    const selectedDir = this._getCurrentDirectory();

    if (selectedDir.fileItem.isRoot()) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return items;
    }

    const parentDirItem = selectedDir.fileItem.createClone();
    parentDirItem.isParentFolder = true;
    parentDirItem.name = '..';
    parentDirItem.relativeName = '..';
    parentDirItem.key = `${PARENT_DIRECTORY_KEY_PREFIX}${selectedDir.fileItem.key}`;

    const itemsCopy = [...items];
    itemsCopy.unshift({
      fileItem: parentDirItem,
      icon: 'parentfolder',
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return itemsCopy;
  }

  _onContextMenuShowing(viewArea, e): void {
    let eventArgs = extendAttributes({}, e, ['targetElement', 'cancel', 'event']);
    eventArgs = extend(eventArgs, {
      viewArea,
      fileSystemItem: e.itemData?.fileItem,
      _isActionButton: e.isActionButton,
    });
    this._actions.onContextMenuShowing?.(eventArgs);
    e.cancel = ensureDefined(eventArgs.cancel, false);
  }

  _getItemThumbnailInfo(fileInfo): ItemThumbnailInfo {
    const { customizeThumbnail } = this.option();
    const thumbnail = isFunction(customizeThumbnail)
      ? customizeThumbnail(fileInfo.fileItem) : fileInfo.fileItem.thumbnail;
    if (thumbnail) {
      return {
        thumbnail,
        cssClass: FILE_MANAGER_ITEM_CUSTOM_THUMBNAIL_CLASS,
      };
    }
    return {
      thumbnail: fileInfo.icon,
    };
  }

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),

      fileSystemProvider: null,

      currentPath: '',

      currentPathKeys: [],

      rootFolderName: messageLocalization.format('dxFileManager-rootDirectoryName'),

      selectionMode: 'multiple', // "single"

      selectedItemKeys: [],

      focusedItemKey: undefined,

      toolbar: {
        items: [
          'showNavPane', 'create', 'upload', 'switchView',
          {
            name: 'separator',
            location: 'after',
          },
          'refresh',
        ],

        fileSelectionItems: [
          'download', 'separator', 'move', 'copy', 'rename', 'separator', 'delete', 'clearSelection',
          {
            name: 'separator',
            location: 'after',
          },
          'refresh',
        ],
      },

      contextMenu: {
        items: [
          'create', 'upload', 'rename', 'move', 'copy', 'delete', 'refresh', 'download',
        ],
      },

      itemView: {
        details: {
          columns: [
            'thumbnail', 'name', 'dateModified', 'size',
          ],
        },
        mode: 'details', // "thumbnails"
        showFolders: true,
        showParentFolder: true,
      },

      customizeThumbnail: undefined,

      customizeDetailColumns: undefined,

      onContextMenuItemClick: undefined,

      onContextMenuShowing: undefined,

      onCurrentDirectoryChanged: undefined,

      onSelectedFileOpened: undefined,

      onSelectionChanged: undefined,

      onFocusedItemChanged: undefined,

      onToolbarItemClick: undefined,

      onErrorOccurred: undefined,

      onDirectoryCreating: undefined,
      onDirectoryCreated: undefined,
      onItemRenaming: undefined,
      onItemRenamed: undefined,
      onItemDeleting: undefined,
      onItemDeleted: undefined,
      onItemCopying: undefined,
      onItemCopied: undefined,
      onItemMoving: undefined,
      onItemMoved: undefined,
      onFileUploading: undefined,
      onFileUploaded: undefined,
      onItemDownloading: undefined,

      allowedFileExtensions: [],

      upload: {
        maxFileSize: 0,
        chunkSize: 200000,
      },

      permissions: extend({}, defaultPermissions),

      notifications: {
        showPanel: true,
        showPopup: true,
      },
    };
  }

  option(options?, value?): Properties {
    const optionsToCheck = normalizeOptions(options, value);
    const isGetter = arguments.length < 2 && type(options) !== 'object';
    const isOptionDefined = (name): boolean => isDefined(optionsToCheck[name]);
    const isOptionValueDiffers = (name): boolean => {
      if (!isOptionDefined(name)) {
        return false;
      }
      const previousValue = this.option(name);
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const value = optionsToCheck[name];
      return !equals(previousValue, value);
    };

    if (!isGetter && isOptionDefined('fileSystemProvider')) {
      // @ts-expect-error ts-error
      this._providerUpdateDeferred = new Deferred();
      if (isOptionValueDiffers('currentPath') || isOptionValueDiffers('currentPathKeys')) {
        this._lockCurrentPathProcessing = true;
      }
    }

    // eslint-disable-next-line prefer-rest-params
    return super.option(...arguments);
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, fullName, value } = args;

    switch (name) {
      case 'currentPath': {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        const updateFunc = () => {
          this._lockCurrentPathProcessing = false;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return this._controller?.setCurrentPath(value);
        };
        this._lockCurrentPathProcessing = true;
        if (this._providerUpdateDeferred) {
          this._providerUpdateDeferred.then(updateFunc);
        } else {
          updateFunc();
        }
        break;
      }
      case 'currentPathKeys': {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        const updateFunc = () => {
          this._lockCurrentPathProcessing = false;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return this._controller?.setCurrentPathByKeys(value);
        };
        this._lockCurrentPathProcessing = true;
        if (this._providerUpdateDeferred) {
          this._providerUpdateDeferred.then(updateFunc);
        } else {
          updateFunc();
        }
        break;
      }
      case 'selectedItemKeys':
        if (!this._lockSelectionProcessing && this._itemView) {
          this._itemView.option('selectedItemKeys', value);
        }
        break;
      case 'focusedItemKey':
        if (!this._lockFocusedItemProcessing && this._itemView) {
          this._itemView.option('focusedItemKey', value);
        }
        break;
      case 'rootFolderName':
        this._controller?.setRootText(value);
        this._invalidate();
        break;
      case 'fileSystemProvider': {
        if (!this._lockCurrentPathProcessing) {
          // @ts-expect-error ts-error
          this._providerUpdateDeferred = new Deferred();
        }
        const { currentPathKeys } = this.option();
        const pathKeys = this._lockCurrentPathProcessing ? undefined : currentPathKeys;
        this._controller?.updateProvider(value, pathKeys)
          // eslint-disable-next-line @stylistic/max-len,@typescript-eslint/no-misused-promises
          .then((): DeferredObj<unknown> | null | undefined => this._providerUpdateDeferred?.resolve())
          .always((): void => {
            this._providerUpdateDeferred = null;
            this.repaint();
          });
        break;
      }
      case 'allowedFileExtensions':
        this._controller?.setAllowedFileExtensions(value);
        this._invalidate();
        break;
      case 'upload': {
        const { upload } = this.option();
        // @ts-expect-error ts-error
        this._controller?.setUploadOptions(upload);
        this._invalidate();
        break;
      }
      case 'permissions': {
        const { permissions } = this.option();
        this._commandManager?.updatePermissions(permissions);
        this._filesTreeViewContextMenu?.tryUpdateVisibleContextMenu();
        this._itemViewContextMenu?.tryUpdateVisibleContextMenu();
        this._toolbar?.updateItemPermissions();
        this._updateUploadDropZone();
        break;
      }
      case 'selectionMode':
      case 'customizeThumbnail':
      case 'customizeDetailColumns':
        this._invalidate();
        break;
      case 'itemView':
        if (fullName === 'itemView.mode') {
          this._switchView(value);
        } else {
          this._invalidate();
        }
        break;
      case 'toolbar': {
        const toolbarOptions: {
          generalItems?: NonNullable<Properties['toolbar']>['items'];
          fileItems?: NonNullable<Properties['toolbar']>['fileSelectionItems'];
        } = {};
        if (fullName === 'toolbar') {
          if (value?.items) {
            toolbarOptions.generalItems = value?.items;
          }
          if (value?.fileSelectionItems) {
            toolbarOptions.fileItems = value?.fileSelectionItems;
          }
        }

        const { toolbar } = this.option();

        if (fullName.startsWith('toolbar.items')) {
          toolbarOptions.generalItems = toolbar?.items;
        }
        if (fullName.startsWith('toolbar.fileSelectionItems')) {
          toolbarOptions.fileItems = toolbar?.fileSelectionItems;
        }
        this._toolbar?.option(toolbarOptions);
        break;
      }
      case 'contextMenu':
        // eslint-disable-next-line @stylistic/no-mixed-operators
        if (fullName === 'contextMenu' && value?.items || fullName.startsWith('contextMenu.items')) {
          const { contextMenu } = this.option();
          this._filesTreeViewContextMenu?.option('items', contextMenu?.items);
          this._itemViewContextMenu?.option('items', contextMenu?.items);
        }
        break;
      case 'notifications':
        this._notificationControl?.option('showProgressPanel', this.option('notifications.showPanel'));
        this._notificationControl?.option('showNotificationPopup', this.option('notifications.showPopup'));
        break;
      case 'onContextMenuItemClick':
      case 'onContextMenuShowing':
      case 'onCurrentDirectoryChanged':
      case 'onSelectedFileOpened':
      case 'onSelectionChanged':
      case 'onFocusedItemChanged':
      case 'onToolbarItemClick':
      case 'onErrorOccurred':
        this._actions[name] = this._createActionByOption(name);
        break;
      case 'onDirectoryCreating':
      case 'onDirectoryCreated':
      case 'onItemRenaming':
      case 'onItemRenamed':
      case 'onItemDeleting':
      case 'onItemDeleted':
      case 'onItemCopying':
      case 'onItemCopied':
      case 'onItemMoving':
      case 'onItemMoved':
      case 'onFileUploading':
      case 'onFileUploaded':
      case 'onItemDownloading':
        this._actions.editing[name] = this._createActionByOption(name);
        break;
      case 'rtlEnabled':
        this._editing?.updateDialogRtl(value);
        super._optionChanged(args);
        break;
      default:
        super._optionChanged(args);
    }
  }

  _initActions(): void {
    this._actions = {
      onContextMenuItemClick: this._createActionByOption('onContextMenuItemClick'),
      onContextMenuShowing: this._createActionByOption('onContextMenuShowing'),
      onCurrentDirectoryChanged: this._createActionByOption('onCurrentDirectoryChanged'),
      onSelectedFileOpened: this._createActionByOption('onSelectedFileOpened'),
      onSelectionChanged: this._createActionByOption('onSelectionChanged'),
      onFocusedItemChanged: this._createActionByOption('onFocusedItemChanged'),
      onToolbarItemClick: this._createActionByOption('onToolbarItemClick'),
      onErrorOccurred: this._createActionByOption('onErrorOccurred'),

      editing: {
        onDirectoryCreating: this._createActionByOption('onDirectoryCreating'),
        onDirectoryCreated: this._createActionByOption('onDirectoryCreated'),
        onItemRenaming: this._createActionByOption('onItemRenaming'),
        onItemRenamed: this._createActionByOption('onItemRenamed'),
        onItemDeleting: this._createActionByOption('onItemDeleting'),
        onItemDeleted: this._createActionByOption('onItemDeleted'),
        onItemCopying: this._createActionByOption('onItemCopying'),
        onItemCopied: this._createActionByOption('onItemCopied'),
        onItemMoving: this._createActionByOption('onItemMoving'),
        onItemMoved: this._createActionByOption('onItemMoved'),
        onFileUploading: this._createActionByOption('onFileUploading'),
        onFileUploaded: this._createActionByOption('onFileUploaded'),
        onItemDownloading: this._createActionByOption('onItemDownloading'),
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  executeCommand(commandName: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._commandManager?.executeCommand(commandName);
  }

  _setCurrentDirectory(directoryInfo, checkActuality?): void {
    this._controller?.setCurrentDirectory(directoryInfo, checkActuality);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getCurrentDirectory() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._controller?.getCurrentDirectory();
  }

  _onControllerInitialized({ controller }: { controller: FileItemsController }): void {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    this._controller = this._controller || controller;
    this._syncToCurrentDirectory();
  }

  _onDataLoading({ operation }: { operation: string }): void {
    let options: object | null = null;

    const { selectedItemKeys } = this.option();

    if (operation === OPERATIONS.NAVIGATION) {
      options = {
        focusedItemKey: this._itemKeyToFocus,
        selectedItemKeys,
      };
      this._itemKeyToFocus = undefined;
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._itemView?.refresh(options, operation);
  }

  _onSelectedDirectoryChanged(): void {
    const currentDirectory = this._getCurrentDirectory();
    this._syncToCurrentDirectory();
    this._actions.onCurrentDirectoryChanged?.({ directory: currentDirectory.fileItem });
  }

  _syncToCurrentDirectory(): void {
    const currentDirectory = this._getCurrentDirectory();

    if (this._filesTreeView) {
      this._filesTreeView.updateCurrentDirectory();
    }
    if (this._breadcrumbs) {
      this._breadcrumbs.setCurrentDirectory(currentDirectory);
    }

    this._checkPathActuality();
  }

  _checkPathActuality(): void {
    if (this._lockCurrentPathProcessing) {
      return;
    }
    const currentPath = this._controller?.getCurrentPath();
    const currentPathKeys = this._controller?.getCurrentPathKeys();
    const options: {
      currentPath?: string;
      currentPathKeys?: string[];
    } = {};

    const {
      currentPath: currentPathOption,
      currentPathKeys: currentPathKeysOption,
    } = this.option();

    if (currentPathOption !== currentPath) {
      options.currentPath = currentPath;
    }
    if (!equalByValue(currentPathKeysOption, currentPathKeys)) {
      options.currentPathKeys = currentPathKeys;
    }

    if (!isEmptyObject(options)) {
      this.option(options);
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getDirectories(parentDirectoryInfo, skipNavigationOnError) {
    return this._controller?.getDirectories(parentDirectoryInfo, skipNavigationOnError);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getSelectedItemInfos() {
    return this._itemView ? this._itemView.getSelectedItems() : [];
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  refresh() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.executeCommand('refresh');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getCurrentDirectory() {
    const directoryInfo = this._getCurrentDirectory();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return directoryInfo?.fileItem || null;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getSelectedItems() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._getSelectedItemInfos()?.map((itemInfo) => itemInfo.fileItem);
  }

  _onSelectedItemOpened({ fileItemInfo }): void {
    const { fileItem } = fileItemInfo;
    if (!fileItem.isDirectory) {
      this._actions.onSelectedFileOpened?.({ file: fileItem });
      return;
    }

    if (fileItem.isParentFolder) {
      this._itemKeyToFocus = this._getCurrentDirectory().fileItem.key;
    }

    const newCurrentDirectory = fileItem.isParentFolder
      ? this._getCurrentDirectory().parentDirectory : fileItemInfo;
    this._setCurrentDirectory(newCurrentDirectory);

    if (newCurrentDirectory) {
      this._filesTreeView?.toggleDirectoryExpandedState(newCurrentDirectory.parentDirectory, true);
    }
  }
}

registerComponent('dxFileManager', FileManager);
export default FileManager;
