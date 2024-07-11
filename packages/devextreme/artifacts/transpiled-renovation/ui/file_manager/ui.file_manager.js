"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _type = require("../../core/utils/type");
var _deferred = require("../../core/utils/deferred");
var _common = require("../../core/utils/common");
var _message = _interopRequireDefault(require("../../localization/message"));
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
var _notify = _interopRequireDefault(require("../notify"));
var _uiFile_manager = require("./ui.file_manager.common");
var _file_items_controller = require("./file_items_controller");
var _uiFile_manager2 = require("./ui.file_manager.command_manager");
var _uiFile_manager3 = _interopRequireDefault(require("./ui.file_manager.context_menu"));
var _uiFile_manager4 = _interopRequireDefault(require("./ui.file_manager.files_tree_view"));
var _uiFile_managerItem_list = _interopRequireDefault(require("./ui.file_manager.item_list.details"));
var _uiFile_managerItem_list2 = _interopRequireDefault(require("./ui.file_manager.item_list.thumbnails"));
var _uiFile_manager5 = _interopRequireDefault(require("./ui.file_manager.toolbar"));
var _uiFile_manager6 = _interopRequireDefault(require("./ui.file_manager.notification"));
var _uiFile_manager7 = _interopRequireDefault(require("./ui.file_manager.editing"));
var _uiFile_manager8 = _interopRequireDefault(require("./ui.file_manager.breadcrumbs"));
var _uiFile_manager9 = _interopRequireDefault(require("./ui.file_manager.adaptivity"));
var _utils = require("../../core/options/utils");
var _comparator = require("../../core/utils/comparator");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const FILE_MANAGER_CLASS = 'dx-filemanager';
const FILE_MANAGER_WRAPPER_CLASS = FILE_MANAGER_CLASS + '-wrapper';
const FILE_MANAGER_CONTAINER_CLASS = FILE_MANAGER_CLASS + '-container';
const FILE_MANAGER_DIRS_PANEL_CLASS = FILE_MANAGER_CLASS + '-dirs-panel';
const FILE_MANAGER_EDITING_CONTAINER_CLASS = FILE_MANAGER_CLASS + '-editing-container';
const FILE_MANAGER_ITEMS_PANEL_CLASS = FILE_MANAGER_CLASS + '-items-panel';
const FILE_MANAGER_ITEM_CUSTOM_THUMBNAIL_CLASS = FILE_MANAGER_CLASS + '-item-custom-thumbnail';
const PARENT_DIRECTORY_KEY_PREFIX = '[*DXPDK*]$40F96F03-FBD8-43DF-91BE-F55F4B8BA871$';
const VIEW_AREAS = {
  folders: 'navPane',
  items: 'itemView'
};
class FileManager extends _ui.default {
  _initTemplates() {}
  _init() {
    super._init();
    this._initActions();
    this._providerUpdateDeferred = null;
    this._lockCurrentPathProcessing = false;
    this._wasRendered = false;
    this._controller = new _file_items_controller.FileItemsController({
      currentPath: this.option('currentPath'),
      currentPathKeys: this.option('currentPathKeys'),
      rootText: this.option('rootFolderName'),
      fileProvider: this.option('fileSystemProvider'),
      allowedFileExtensions: this.option('allowedFileExtensions'),
      uploadMaxFileSize: this.option('upload').maxFileSize,
      uploadChunkSize: this.option('upload').chunkSize,
      onInitialized: this._onControllerInitialized.bind(this),
      onDataLoading: this._onDataLoading.bind(this),
      onSelectedDirectoryChanged: this._onSelectedDirectoryChanged.bind(this),
      onPathPotentiallyChanged: this._checkPathActuality.bind(this),
      editingEvents: this._actions.editing
    });
  }
  _initMarkup() {
    super._initMarkup();
    this._firstItemViewLoad = true;
    this._lockSelectionProcessing = false;
    this._lockFocusedItemProcessing = false;
    this._itemKeyToFocus = undefined;
    this._loadedWidgets = [];
    this._commandManager = new _uiFile_manager2.FileManagerCommandManager(this.option('permissions'));
    this.$element().addClass(FILE_MANAGER_CLASS);
    if (this._wasRendered) {
      this._prepareToLoad();
    } else {
      this._wasRendered = true;
    }
    this._createNotificationControl();
    this._initCommandManager();
  }
  _createNotificationControl() {
    const $notificationControl = (0, _renderer.default)('<div>').addClass('dx-filemanager-notification-container').appendTo(this.$element());
    this._notificationControl = this._createComponent($notificationControl, _uiFile_manager6.default, {
      progressPanelContainer: this.$element(),
      contentTemplate: (container, notificationControl) => this._createWrapper(container, notificationControl),
      onActionProgress: e => this._onActionProgress(e),
      positionTarget: `.${FILE_MANAGER_CONTAINER_CLASS}`,
      showProgressPanel: this.option('notifications.showPanel'),
      showNotificationPopup: this.option('notifications.showPopup')
    });
  }
  _createWrapper(container, notificationControl) {
    this._$wrapper = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_WRAPPER_CLASS).appendTo(container);
    this._createEditing(notificationControl);
    const $toolbar = (0, _renderer.default)('<div>').appendTo(this._$wrapper);
    this._toolbar = this._createComponent($toolbar, _uiFile_manager5.default, {
      commandManager: this._commandManager,
      generalItems: this.option('toolbar.items'),
      fileItems: this.option('toolbar.fileSelectionItems'),
      itemViewMode: this.option('itemView').mode,
      onItemClick: args => this._actions.onToolbarItemClick(args)
    });
    this._createAdaptivityControl();
  }
  _createAdaptivityControl() {
    const $container = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_CONTAINER_CLASS).appendTo(this._$wrapper);
    this._adaptivityControl = this._createComponent($container, _uiFile_manager9.default, {
      drawerTemplate: container => this._createFilesTreeView(container),
      contentTemplate: container => this._createItemsPanel(container),
      onAdaptiveStateChanged: e => this._onAdaptiveStateChanged(e)
    });
    this._editing.setUploaderSplitterElement(this._adaptivityControl.getSplitterElement());
  }
  _createEditing(notificationControl) {
    const $editingContainer = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_EDITING_CONTAINER_CLASS).appendTo(this.$element());
    this._editing = this._createComponent($editingContainer, _uiFile_manager7.default, {
      controller: this._controller,
      model: {
        getMultipleSelectedItems: this._getSelectedItemInfos.bind(this)
      },
      getItemThumbnail: this._getItemThumbnailInfo.bind(this),
      notificationControl,
      uploadDropZonePlaceholderContainer: this.$element(),
      rtlEnabled: this.option('rtlEnabled'),
      onSuccess: _ref => {
        let {
          updatedOnlyFiles
        } = _ref;
        return this._redrawComponent(updatedOnlyFiles);
      },
      onError: e => this._onEditingError(e)
    });
  }
  _createItemsPanel($container) {
    this._$itemsPanel = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_ITEMS_PANEL_CLASS).appendTo($container);
    this._createBreadcrumbs(this._$itemsPanel);
    this._createItemView(this._$itemsPanel);
    this._updateUploadDropZone();
  }
  _updateUploadDropZone() {
    const dropZone = this._commandManager.isCommandAvailable('upload') ? this._$itemsPanel : (0, _renderer.default)();
    this._editing.setUploaderDropZone(dropZone);
  }
  _createFilesTreeView(container) {
    this._filesTreeViewContextMenu = this._createContextMenu(false, VIEW_AREAS.folders);
    const $filesTreeView = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_DIRS_PANEL_CLASS).appendTo(container);
    this._filesTreeView = this._createComponent($filesTreeView, _uiFile_manager4.default, {
      storeExpandedState: true,
      contextMenu: this._filesTreeViewContextMenu,
      getDirectories: this.getDirectories.bind(this),
      getCurrentDirectory: this._getCurrentDirectory.bind(this),
      onDirectoryClick: _ref2 => {
        let {
          itemData
        } = _ref2;
        return this._setCurrentDirectory(itemData);
      },
      onItemListDataLoaded: () => this._tryEndLoading(VIEW_AREAS.folders)
    });
    this._filesTreeView.updateCurrentDirectory();
  }
  _createItemView($container, viewMode) {
    this._itemViewContextMenu = this._createContextMenu(true, VIEW_AREAS.items);
    const itemViewOptions = this.option('itemView');
    const options = {
      selectionMode: this.option('selectionMode'),
      selectedItemKeys: this.option('selectedItemKeys'),
      focusedItemKey: this.option('focusedItemKey'),
      contextMenu: this._itemViewContextMenu,
      getItems: this._getItemViewItems.bind(this),
      onError: _ref3 => {
        let {
          error
        } = _ref3;
        return this._showError(error);
      },
      onSelectionChanged: this._onItemViewSelectionChanged.bind(this),
      onFocusedItemChanged: this._onItemViewFocusedItemChanged.bind(this),
      onSelectedItemOpened: this._onSelectedItemOpened.bind(this),
      onContextMenuShowing: e => this._onContextMenuShowing(VIEW_AREAS.items, e),
      onItemListItemsLoaded: () => this._tryEndLoading(VIEW_AREAS.items),
      getItemThumbnail: this._getItemThumbnailInfo.bind(this),
      customizeDetailColumns: this.option('customizeDetailColumns'),
      detailColumns: this.option('itemView.details.columns')
    };
    const $itemView = (0, _renderer.default)('<div>').appendTo($container);
    viewMode = viewMode || itemViewOptions.mode;
    const widgetClass = viewMode === 'thumbnails' ? _uiFile_managerItem_list2.default : _uiFile_managerItem_list.default;
    this._itemView = this._createComponent($itemView, widgetClass, options);
  }
  _createBreadcrumbs($container) {
    const $breadcrumbs = (0, _renderer.default)('<div>').appendTo($container);
    this._breadcrumbs = this._createComponent($breadcrumbs, _uiFile_manager8.default, {
      rootFolderDisplayName: this.option('rootFolderName'),
      onCurrentDirectoryChanging: _ref4 => {
        let {
          currentDirectory
        } = _ref4;
        return this._setCurrentDirectory(currentDirectory, true);
      }
    });
    this._breadcrumbs.setCurrentDirectory(this._getCurrentDirectory());
  }
  _createContextMenu(isolateCreationItemCommands, viewArea) {
    const $contextMenu = (0, _renderer.default)('<div>').appendTo(this._$wrapper);
    return this._createComponent($contextMenu, _uiFile_manager3.default, {
      commandManager: this._commandManager,
      items: this.option('contextMenu.items'),
      onItemClick: args => this._actions.onContextMenuItemClick(args),
      onContextMenuShowing: e => this._onContextMenuShowing(viewArea, e),
      isolateCreationItemCommands,
      viewArea
    });
  }
  _initCommandManager() {
    const actions = (0, _extend.extend)(this._editing.getCommandActions(), {
      refresh: () => this._refreshAndShowProgress(),
      thumbnails: () => this.option('itemView.mode', 'thumbnails'),
      details: () => this.option('itemView.mode', 'details'),
      clearSelection: () => this._clearSelection(),
      showNavPane: () => this._adaptivityControl.toggleDrawer()
    });
    this._commandManager.registerActions(actions);
  }
  _onItemViewSelectionChanged(_ref5) {
    let {
      selectedItemInfos,
      selectedItems,
      selectedItemKeys,
      currentSelectedItemKeys,
      currentDeselectedItemKeys
    } = _ref5;
    this._lockSelectionProcessing = true;
    this.option('selectedItemKeys', selectedItemKeys);
    this._lockSelectionProcessing = false;
    this._actions.onSelectionChanged({
      selectedItems,
      selectedItemKeys,
      currentSelectedItemKeys,
      currentDeselectedItemKeys
    });
    this._updateToolbar(selectedItemInfos);
  }
  _onItemViewFocusedItemChanged(e) {
    this._lockFocusedItemProcessing = true;
    this.option('focusedItemKey', e.itemKey);
    this._lockFocusedItemProcessing = false;
    this._actions.onFocusedItemChanged({
      item: e.item,
      itemElement: e.itemElement
    });
  }
  _onAdaptiveStateChanged(_ref6) {
    let {
      enabled
    } = _ref6;
    this._commandManager.setCommandEnabled('showNavPane', enabled);
    this._updateToolbar();
  }
  _onActionProgress(_ref7) {
    let {
      message,
      status
    } = _ref7;
    this._toolbar.updateRefreshItem(message, status);
    this._updateToolbar();
  }
  _onEditingError(e) {
    const args = (0, _uiFile_manager.extendAttributes)({}, e, ['errorCode', 'errorText', 'fileSystemItem']);
    this._actions.onErrorOccurred(args);
    e.errorText = args.errorText;
  }
  _refreshAndShowProgress() {
    this._prepareToLoad();
    return (0, _deferred.when)(this._notificationControl.tryShowProgressPanel(), this._controller.refresh()).then(() => this._filesTreeView.refresh());
  }
  _isAllWidgetsLoaded() {
    return this._loadedWidgets.length === 2 && this._loadedWidgets.indexOf(VIEW_AREAS.folders) !== -1 && this._loadedWidgets.indexOf(VIEW_AREAS.items) !== -1;
  }
  _tryEndLoading(area) {
    this._loadedWidgets.push(area);
    if (this._isAllWidgetsLoaded()) {
      this._controller.endSingleLoad();
    }
  }
  _prepareToLoad() {
    this._loadedWidgets = [];
    this._controller.startSingleLoad();
  }
  _updateToolbar(selectedItems) {
    const items = selectedItems || this._getSelectedItemInfos();
    this._toolbar.option('contextItems', (0, _common.ensureDefined)(items, []));
  }
  _switchView(viewMode) {
    this._disposeWidget(this._itemView.option('contextMenu'));
    this._disposeWidget(this._itemView);
    this._createItemView(this._$itemsPanel, viewMode);
    this._toolbar.option({
      itemViewMode: viewMode
    });
  }
  _disposeWidget(widget) {
    widget.dispose();
    widget.$element().remove();
  }
  _clearSelection() {
    this._itemView.clearSelection();
  }
  _showError(message) {
    // TODO use notification control instead of it
    this._showNotification(message, false);
  }
  _showNotification(message, isSuccess) {
    (0, _notify.default)({
      message: message,
      width: 450
    }, isSuccess ? 'success' : 'error', 5000);
  }
  _redrawComponent(onlyFileItemsView) {
    this._itemView.refresh().then(() => !onlyFileItemsView && this._filesTreeView.refresh());
  }
  _getItemViewItems() {
    const showFolders = this.option('itemView').showFolders;
    let result = this._controller.getCurrentItems(!showFolders);
    this._updateToolbarWithSelectionOnFirstLoad(result);
    if (this.option('itemView.showParentFolder')) {
      result = (0, _deferred.when)(result).then(items => this._getPreparedItemViewItems(items));
    }
    return result;
  }
  _updateToolbarWithSelectionOnFirstLoad(itemsResult) {
    if (!this._firstItemViewLoad) {
      return;
    }
    this._firstItemViewLoad = false;
    const selectedItemKeys = this.option('selectedItemKeys');
    if (selectedItemKeys.length > 0) {
      (0, _deferred.when)(itemsResult).done(items => {
        const selectedItems = (0, _uiFile_manager.findItemsByKeys)(items, selectedItemKeys);
        if (selectedItems.length > 0) {
          this._updateToolbar(selectedItems);
        }
      });
    }
  }
  _getPreparedItemViewItems(items) {
    const selectedDir = this._getCurrentDirectory();
    if (selectedDir.fileItem.isRoot()) {
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
      icon: 'parentfolder'
    });
    return itemsCopy;
  }
  _onContextMenuShowing(viewArea, e) {
    var _e$itemData;
    let eventArgs = (0, _uiFile_manager.extendAttributes)({}, e, ['targetElement', 'cancel', 'event']);
    eventArgs = (0, _extend.extend)(eventArgs, {
      viewArea,
      fileSystemItem: (_e$itemData = e.itemData) === null || _e$itemData === void 0 ? void 0 : _e$itemData.fileItem,
      _isActionButton: e.isActionButton
    });
    this._actions.onContextMenuShowing(eventArgs);
    e.cancel = (0, _common.ensureDefined)(eventArgs.cancel, false);
  }
  _getItemThumbnailInfo(fileInfo) {
    const func = this.option('customizeThumbnail');
    const thumbnail = (0, _type.isFunction)(func) ? func(fileInfo.fileItem) : fileInfo.fileItem.thumbnail;
    if (thumbnail) {
      return {
        thumbnail,
        cssClass: FILE_MANAGER_ITEM_CUSTOM_THUMBNAIL_CLASS
      };
    }
    return {
      thumbnail: fileInfo.icon
    };
  }
  _getDefaultOptions() {
    return (0, _extend.extend)(super._getDefaultOptions(), {
      fileSystemProvider: null,
      currentPath: '',
      currentPathKeys: [],
      rootFolderName: _message.default.format('dxFileManager-rootDirectoryName'),
      selectionMode: 'multiple',
      // "single"

      selectedItemKeys: [],
      focusedItemKey: undefined,
      toolbar: {
        items: ['showNavPane', 'create', 'upload', 'switchView', {
          name: 'separator',
          location: 'after'
        }, 'refresh'],
        fileSelectionItems: ['download', 'separator', 'move', 'copy', 'rename', 'separator', 'delete', 'clearSelection', {
          name: 'separator',
          location: 'after'
        }, 'refresh']
      },
      contextMenu: {
        items: ['create', 'upload', 'rename', 'move', 'copy', 'delete', 'refresh', 'download']
      },
      itemView: {
        details: {
          columns: ['thumbnail', 'name', 'dateModified', 'size']
        },
        mode: 'details',
        // "thumbnails"
        showFolders: true,
        showParentFolder: true
      },
      customizeThumbnail: null,
      customizeDetailColumns: null,
      onContextMenuItemClick: null,
      onContextMenuShowing: null,
      onCurrentDirectoryChanged: null,
      onSelectedFileOpened: null,
      onSelectionChanged: null,
      onFocusedItemChanged: null,
      onToolbarItemClick: null,
      onErrorOccurred: null,
      onDirectoryCreating: null,
      onDirectoryCreated: null,
      onItemRenaming: null,
      onItemRenamed: null,
      onItemDeleting: null,
      onItemDeleted: null,
      onItemCopying: null,
      onItemCopied: null,
      onItemMoving: null,
      onItemMoved: null,
      onFileUploading: null,
      onFileUploaded: null,
      onItemDownloading: null,
      allowedFileExtensions: [],
      upload: {
        maxFileSize: 0,
        chunkSize: 200000
      },
      permissions: (0, _extend.extend)({}, _uiFile_manager2.defaultPermissions),
      notifications: {
        showPanel: true,
        showPopup: true
      }
    });
  }
  option(options, value) {
    const optionsToCheck = (0, _utils.normalizeOptions)(options, value);
    const isGetter = arguments.length < 2 && (0, _type.type)(options) !== 'object';
    const isOptionDefined = name => (0, _type.isDefined)(optionsToCheck[name]);
    const isOptionValueDiffers = name => {
      if (!isOptionDefined(name)) {
        return false;
      }
      const previousValue = this.option(name);
      const value = optionsToCheck[name];
      return !(0, _comparator.equals)(previousValue, value);
    };
    if (!isGetter && isOptionDefined('fileSystemProvider')) {
      this._providerUpdateDeferred = new _deferred.Deferred();
      if (isOptionValueDiffers('currentPath') || isOptionValueDiffers('currentPathKeys')) {
        this._lockCurrentPathProcessing = true;
      }
    }
    return super.option(...arguments);
  }
  _optionChanged(args) {
    const name = args.name;
    switch (name) {
      case 'currentPath':
        {
          const updateFunc = () => {
            this._lockCurrentPathProcessing = false;
            return this._controller.setCurrentPath(args.value);
          };
          this._lockCurrentPathProcessing = true;
          this._providerUpdateDeferred ? this._providerUpdateDeferred.then(updateFunc) : updateFunc();
        }
        break;
      case 'currentPathKeys':
        {
          const updateFunc = () => {
            this._lockCurrentPathProcessing = false;
            return this._controller.setCurrentPathByKeys(args.value);
          };
          this._lockCurrentPathProcessing = true;
          this._providerUpdateDeferred ? this._providerUpdateDeferred.then(updateFunc) : updateFunc();
        }
        break;
      case 'selectedItemKeys':
        if (!this._lockSelectionProcessing && this._itemView) {
          this._itemView.option('selectedItemKeys', args.value);
        }
        break;
      case 'focusedItemKey':
        if (!this._lockFocusedItemProcessing && this._itemView) {
          this._itemView.option('focusedItemKey', args.value);
        }
        break;
      case 'rootFolderName':
        this._controller.setRootText(args.value);
        this._invalidate();
        break;
      case 'fileSystemProvider':
        {
          if (!this._lockCurrentPathProcessing) {
            this._providerUpdateDeferred = new _deferred.Deferred();
          }
          const pathKeys = this._lockCurrentPathProcessing ? undefined : this.option('currentPathKeys');
          this._controller.updateProvider(args.value, pathKeys).then(() => this._providerUpdateDeferred.resolve()).always(() => {
            this._providerUpdateDeferred = null;
            this.repaint();
          });
          break;
        }
      case 'allowedFileExtensions':
        this._controller.setAllowedFileExtensions(args.value);
        this._invalidate();
        break;
      case 'upload':
        this._controller.setUploadOptions(this.option('upload'));
        this._invalidate();
        break;
      case 'permissions':
        this._commandManager.updatePermissions(this.option('permissions'));
        this._filesTreeViewContextMenu.tryUpdateVisibleContextMenu();
        this._itemViewContextMenu.tryUpdateVisibleContextMenu();
        this._toolbar.updateItemPermissions();
        this._updateUploadDropZone();
        break;
      case 'selectionMode':
      case 'customizeThumbnail':
      case 'customizeDetailColumns':
        this._invalidate();
        break;
      case 'itemView':
        if (args.fullName === 'itemView.mode') {
          this._switchView(args.value);
        } else {
          this._invalidate();
        }
        break;
      case 'toolbar':
        {
          const toolbarOptions = {};
          if (args.fullName === 'toolbar') {
            if (args.value.items) {
              toolbarOptions.generalItems = args.value.items;
            }
            if (args.value.fileSelectionItems) {
              toolbarOptions.fileItems = args.value.fileSelectionItems;
            }
          }
          if (args.fullName.indexOf('toolbar.items') === 0) {
            toolbarOptions.generalItems = this.option('toolbar.items');
          }
          if (args.fullName.indexOf('toolbar.fileSelectionItems') === 0) {
            toolbarOptions.fileItems = this.option('toolbar.fileSelectionItems');
          }
          this._toolbar.option(toolbarOptions);
        }
        break;
      case 'contextMenu':
        if (args.fullName === 'contextMenu' && args.value.items || args.fullName.indexOf('contextMenu.items') === 0) {
          const contextMenuItems = this.option('contextMenu.items');
          this._filesTreeViewContextMenu.option('items', contextMenuItems);
          this._itemViewContextMenu.option('items', contextMenuItems);
        }
        break;
      case 'notifications':
        this._notificationControl.option('showProgressPanel', this.option('notifications.showPanel'));
        this._notificationControl.option('showNotificationPopup', this.option('notifications.showPopup'));
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
        this._editing.updateDialogRtl(args.value);
        super._optionChanged(args);
        break;
      default:
        super._optionChanged(args);
    }
  }
  _initActions() {
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
        onItemDownloading: this._createActionByOption('onItemDownloading')
      }
    };
  }
  executeCommand(commandName) {
    return this._commandManager.executeCommand(commandName);
  }
  _setCurrentDirectory(directoryInfo, checkActuality) {
    this._controller.setCurrentDirectory(directoryInfo, checkActuality);
  }
  _getCurrentDirectory() {
    return this._controller.getCurrentDirectory();
  }
  _onControllerInitialized(_ref8) {
    let {
      controller
    } = _ref8;
    this._controller = this._controller || controller;
    this._syncToCurrentDirectory();
  }
  _onDataLoading(_ref9) {
    let {
      operation
    } = _ref9;
    let options = null;
    if (operation === _file_items_controller.OPERATIONS.NAVIGATION) {
      options = {
        focusedItemKey: this._itemKeyToFocus,
        selectedItemKeys: this.option('selectedItemKeys')
      };
      this._itemKeyToFocus = undefined;
    }
    this._itemView.refresh(options, operation);
  }
  _onSelectedDirectoryChanged() {
    const currentDirectory = this._getCurrentDirectory();
    this._syncToCurrentDirectory();
    this._actions.onCurrentDirectoryChanged({
      directory: currentDirectory.fileItem
    });
  }
  _syncToCurrentDirectory() {
    const currentDirectory = this._getCurrentDirectory();
    if (this._filesTreeView) {
      this._filesTreeView.updateCurrentDirectory();
    }
    if (this._breadcrumbs) {
      this._breadcrumbs.setCurrentDirectory(currentDirectory);
    }
    this._checkPathActuality();
  }
  _checkPathActuality() {
    if (this._lockCurrentPathProcessing) {
      return;
    }
    const currentPath = this._controller.getCurrentPath();
    const currentPathKeys = this._controller.getCurrentPathKeys();
    const options = {};
    if (this.option('currentPath') !== currentPath) {
      options.currentPath = currentPath;
    }
    if (!(0, _common.equalByValue)(this.option('currentPathKeys'), currentPathKeys)) {
      options.currentPathKeys = currentPathKeys;
    }
    if (!(0, _type.isEmptyObject)(options)) {
      this.option(options);
    }
  }
  getDirectories(parentDirectoryInfo, skipNavigationOnError) {
    return this._controller.getDirectories(parentDirectoryInfo, skipNavigationOnError);
  }
  _getSelectedItemInfos() {
    return this._itemView ? this._itemView.getSelectedItems() : [];
  }
  refresh() {
    return this.executeCommand('refresh');
  }
  getCurrentDirectory() {
    const directoryInfo = this._getCurrentDirectory();
    return directoryInfo && directoryInfo.fileItem || null;
  }
  getSelectedItems() {
    return this._getSelectedItemInfos().map(itemInfo => itemInfo.fileItem);
  }
  _onSelectedItemOpened(_ref10) {
    let {
      fileItemInfo
    } = _ref10;
    const fileItem = fileItemInfo.fileItem;
    if (!fileItem.isDirectory) {
      this._actions.onSelectedFileOpened({
        file: fileItem
      });
      return;
    }
    if (fileItem.isParentFolder) {
      this._itemKeyToFocus = this._getCurrentDirectory().fileItem.key;
    }
    const newCurrentDirectory = fileItem.isParentFolder ? this._getCurrentDirectory().parentDirectory : fileItemInfo;
    this._setCurrentDirectory(newCurrentDirectory);
    if (newCurrentDirectory) {
      this._filesTreeView.toggleDirectoryExpandedState(newCurrentDirectory.parentDirectory, true);
    }
  }
}
(0, _component_registrator.default)('dxFileManager', FileManager);
var _default = exports.default = FileManager;
module.exports = exports.default;
module.exports.default = exports.default;