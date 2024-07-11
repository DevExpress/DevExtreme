"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _uiFile_manager = require("./ui.file_manager.common");
var _type = require("../../core/utils/type");
var _message = _interopRequireDefault(require("../../localization/message"));
var _ui = _interopRequireDefault(require("../data_grid/ui.data_grid"));
var _uiFile_manager2 = _interopRequireDefault(require("./ui.file_manager.item_list"));
var _uiFile_manager3 = _interopRequireDefault(require("./ui.file_manager.file_actions_button"));
var _deferred = require("../../core/utils/deferred");
var _file_items_controller = require("./file_items_controller");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const FILE_MANAGER_DETAILS_ITEM_LIST_CLASS = 'dx-filemanager-details';
const FILE_MANAGER_DETAILS_ITEM_THUMBNAIL_CLASS = 'dx-filemanager-details-item-thumbnail';
const FILE_MANAGER_DETAILS_ITEM_NAME_CLASS = 'dx-filemanager-details-item-name';
const FILE_MANAGER_DETAILS_ITEM_NAME_WRAPPER_CLASS = 'dx-filemanager-details-item-name-wrapper';
const FILE_MANAGER_DETAILS_ITEM_IS_DIRECTORY_CLASS = 'dx-filemanager-details-item-is-directory';
const FILE_MANAGER_PARENT_DIRECTORY_ITEM = 'dx-filemanager-parent-directory-item';
const DATA_GRID_DATA_ROW_CLASS = 'dx-data-row';
const DEFAULT_COLUMN_CONFIGS = {
  thumbnail: {
    caption: '',
    calculateSortValue: 'isDirectory',
    width: 36,
    alignment: 'center',
    cssClass: FILE_MANAGER_DETAILS_ITEM_IS_DIRECTORY_CLASS
  },
  name: {
    caption: _message.default.format('dxFileManager-listDetailsColumnCaptionName')
  },
  dateModified: {
    caption: _message.default.format('dxFileManager-listDetailsColumnCaptionDateModified'),
    width: 110,
    hidingPriority: 1
  },
  size: {
    caption: _message.default.format('dxFileManager-listDetailsColumnCaptionFileSize'),
    width: 90,
    alignment: 'right',
    hidingPriority: 0
  },
  isParentFolder: {
    caption: 'isParentFolder',
    visible: false,
    sortIndex: 0,
    sortOrder: 'asc'
  }
};
class FileManagerDetailsItemList extends _uiFile_manager2.default {
  _initMarkup() {
    this._itemCount = 0;
    this._focusedItem = null;
    this._hasParentDirectoryItem = false;
    this._parentDirectoryItemKey = null;
    this._selectAllCheckBox = null;
    this._selectAllCheckBoxUpdating = false;
    this.$element().addClass(FILE_MANAGER_DETAILS_ITEM_LIST_CLASS);
    this._createFilesView();
    this._contextMenu.option('onContextMenuHidden', () => this._onContextMenuHidden());
    super._initMarkup();
  }
  _createFilesView() {
    const $filesView = (0, _renderer.default)('<div>').appendTo(this.$element());
    const selectionMode = this._isMultipleSelectionMode() ? 'multiple' : 'none';
    this._filesView = this._createComponent($filesView, _ui.default, {
      dataSource: this._createDataSource(),
      hoverStateEnabled: true,
      selection: {
        mode: selectionMode,
        showCheckBoxesMode: this._isDesktop() ? 'onClick' : 'none'
      },
      selectedRowKeys: this.option('selectedItemKeys'),
      focusedRowKey: this.option('focusedItemKey'),
      focusedRowEnabled: true,
      allowColumnResizing: true,
      scrolling: {
        mode: 'virtual'
      },
      sorting: {
        mode: 'single',
        showSortIndexes: false
      },
      loadPanel: {
        shading: true
      },
      showColumnLines: false,
      showRowLines: false,
      columnHidingEnabled: false,
      columns: this._createColumns(),
      onEditorPreparing: this._onEditorPreparing.bind(this),
      onRowPrepared: this._onRowPrepared.bind(this),
      onContextMenuPreparing: this._onContextMenuPreparing.bind(this),
      onSelectionChanged: this._onFilesViewSelectionChanged.bind(this),
      onFocusedRowChanged: this._onFilesViewFocusedRowChanged.bind(this),
      onOptionChanged: this._onFilesViewOptionChanged.bind(this),
      onContentReady: this._onContentReady.bind(this)
    });
  }
  _createColumns() {
    let columns = this.option('detailColumns');
    columns = columns.slice(0);
    columns = columns.map(column => {
      let extendedItem = column;
      if ((0, _type.isString)(column)) {
        extendedItem = {
          dataField: column
        };
      }
      return this._getPreparedColumn(extendedItem);
    });
    const customizeDetailColumns = this.option('customizeDetailColumns');
    if ((0, _type.isFunction)(customizeDetailColumns)) {
      columns = customizeDetailColumns(columns);
    }
    columns.push(this._getPreparedColumn({
      dataField: 'isParentFolder'
    }));
    columns.forEach(column => this._updateColumnDataField(column));
    return columns;
  }
  _getPreparedColumn(columnOptions) {
    const result = {};
    let resultCssClass = '';
    if (this._isDefaultColumn(columnOptions.dataField)) {
      const defaultConfig = (0, _extend.extend)(true, {}, DEFAULT_COLUMN_CONFIGS[columnOptions.dataField]);
      resultCssClass = defaultConfig.cssClass || '';
      switch (columnOptions.dataField) {
        case 'thumbnail':
          defaultConfig.cellTemplate = this._createThumbnailColumnCell.bind(this);
          defaultConfig.calculateSortValue = `fileItem.${defaultConfig.calculateSortValue}`;
          break;
        case 'name':
          defaultConfig.cellTemplate = this._createNameColumnCell.bind(this);
          defaultConfig.caption = _message.default.format('dxFileManager-listDetailsColumnCaptionName');
          break;
        case 'size':
          defaultConfig.calculateCellValue = this._calculateSizeColumnCellValue.bind(this);
          defaultConfig.caption = _message.default.format('dxFileManager-listDetailsColumnCaptionFileSize');
          defaultConfig.calculateSortValue = rowData => rowData.fileItem.isDirectory ? -1 : rowData.fileItem.size;
          break;
        case 'dateModified':
          defaultConfig.caption = _message.default.format('dxFileManager-listDetailsColumnCaptionDateModified');
          break;
        default:
          break;
      }
      (0, _extend.extend)(true, result, defaultConfig);
    }
    (0, _uiFile_manager.extendAttributes)(result, columnOptions, ['alignment', 'caption', 'dataField', 'dataType', 'hidingPriority', 'sortIndex', 'sortOrder', 'visible', 'visibleIndex', 'width']);
    if (columnOptions.cssClass) {
      resultCssClass = `${resultCssClass} ${columnOptions.cssClass}`;
    }
    if (resultCssClass) {
      result.cssClass = resultCssClass;
    }
    return result;
  }
  _updateColumnDataField(column) {
    const dataItemSuffix = this._isDefaultColumn(column.dataField) ? '' : 'dataItem.';
    column.dataField = 'fileItem.' + dataItemSuffix + column.dataField;
    return column;
  }
  _isDefaultColumn(columnDataField) {
    return !!DEFAULT_COLUMN_CONFIGS[columnDataField];
  }
  _onFileItemActionButtonClick(_ref) {
    let {
      component,
      element,
      event
    } = _ref;
    event.stopPropagation();
    const $row = component.$element().closest(this._getItemSelector());
    const fileItemInfo = $row.data('item');
    this._selectItem(fileItemInfo);
    const target = {
      itemData: fileItemInfo,
      itemElement: $row,
      isActionButton: true
    };
    const items = this._getFileItemsForContextMenu(fileItemInfo);
    this._showContextMenu(items, element, event, target);
    this._activeFileActionsButton = component;
    this._activeFileActionsButton.setActive(true);
  }
  _onContextMenuHidden() {
    if (this._activeFileActionsButton) {
      this._activeFileActionsButton.setActive(false);
    }
  }
  _getItemThumbnailCssClass() {
    return FILE_MANAGER_DETAILS_ITEM_THUMBNAIL_CLASS;
  }
  _getItemSelector() {
    return `.${DATA_GRID_DATA_ROW_CLASS}`;
  }
  _onItemDblClick(e) {
    const $row = (0, _renderer.default)(e.currentTarget);
    const fileItemInfo = $row.data('item');
    this._raiseSelectedItemOpened(fileItemInfo);
  }
  _isAllItemsSelected() {
    const selectableItemsCount = this._hasParentDirectoryItem ? this._itemCount - 1 : this._itemCount;
    const selectedRowKeys = this._filesView.option('selectedRowKeys');
    if (!selectedRowKeys.length) {
      return false;
    }
    return selectedRowKeys.length >= selectableItemsCount ? true : undefined;
  }
  _onEditorPreparing(_ref2) {
    let {
      component,
      command,
      row,
      parentType,
      editorOptions
    } = _ref2;
    if (!this._filesView) {
      this._filesView = component;
    }
    if (command === 'select' && row) {
      if (this._isParentDirectoryItem(row.data)) {
        editorOptions.disabled = true;
      }
    } else if (parentType === 'headerRow') {
      editorOptions.onInitialized = _ref3 => {
        let {
          component
        } = _ref3;
        this._selectAllCheckBox = component;
      };
      editorOptions.value = this._isAllItemsSelected();
      editorOptions.onValueChanged = args => this._onSelectAllCheckBoxValueChanged(args);
    }
  }
  _onSelectAllCheckBoxValueChanged(_ref4) {
    let {
      event,
      previousValue,
      value
    } = _ref4;
    if (!event) {
      if (previousValue && !this._selectAllCheckBoxUpdating && this._selectAllCheckBox) {
        this._selectAllCheckBox.option('value', previousValue);
      }
      return;
    }
    if (this._isAllItemsSelected() === value) {
      return;
    }
    if (value) {
      this._filesView.selectAll();
    } else {
      this._filesView.deselectAll();
    }
    event.preventDefault();
  }
  _onRowPrepared(_ref5) {
    let {
      rowType,
      rowElement,
      data
    } = _ref5;
    if (rowType === 'data') {
      const $row = (0, _renderer.default)(rowElement);
      $row.data('item', data);
      if (this._isParentDirectoryItem(data)) {
        $row.addClass(FILE_MANAGER_PARENT_DIRECTORY_ITEM);
      }
    }
  }
  _onContextMenuPreparing(e) {
    if (!this._isDesktop()) {
      return;
    }
    let fileItems = null;
    let item = {};
    if (e.row && e.row.rowType === 'data') {
      item = e.row.data;
      this._selectItem(item);
      fileItems = this._getFileItemsForContextMenu(item);
    }
    const eventArgs = (0, _extend.extend)({}, {
      targetElement: e.target === 'content' && (0, _type.isDefined)(e.row) ? this._filesView.getRowElement(e.rowIndex) : undefined,
      itemData: item,
      options: this._contextMenu.option(),
      event: e.event,
      isActionButton: false,
      cancel: false
    });
    this._raiseContextMenuShowing(eventArgs);
    e.items = eventArgs.cancel ? [] : this._contextMenu.createContextMenuItems(fileItems, null, item);
  }
  _onFilesViewSelectionChanged(_ref6) {
    let {
      component,
      selectedRowsData,
      selectedRowKeys,
      currentSelectedRowKeys,
      currentDeselectedRowKeys
    } = _ref6;
    this._filesView = this._filesView || component;
    if (this._selectAllCheckBox) {
      this._selectAllCheckBoxUpdating = true;
      this._selectAllCheckBox.option('value', this._isAllItemsSelected());
      this._selectAllCheckBoxUpdating = false;
    }
    const selectedItems = selectedRowsData.map(itemInfo => itemInfo.fileItem);
    this._tryRaiseSelectionChanged({
      selectedItemInfos: selectedRowsData,
      selectedItems,
      selectedItemKeys: selectedRowKeys,
      currentSelectedItemKeys: currentSelectedRowKeys,
      currentDeselectedItemKeys: currentDeselectedRowKeys
    });
  }
  _onFilesViewFocusedRowChanged(e) {
    var _e$row2;
    if (!this._isMultipleSelectionMode()) {
      var _e$row;
      this._selectItemSingleSelection((_e$row = e.row) === null || _e$row === void 0 ? void 0 : _e$row.data);
    }
    const fileSystemItem = ((_e$row2 = e.row) === null || _e$row2 === void 0 ? void 0 : _e$row2.data.fileItem) || null;
    this._onFocusedItemChanged({
      item: fileSystemItem,
      itemKey: fileSystemItem === null || fileSystemItem === void 0 ? void 0 : fileSystemItem.key,
      itemElement: e.rowElement
    });
  }
  _onFilesViewOptionChanged(_ref7) {
    let {
      fullName
    } = _ref7;
    if (fullName.indexOf('sortOrder') > -1) {
      this._filesView.columnOption('isParentFolder', {
        sortOrder: 'asc',
        sortIndex: 0
      });
    }
  }
  _resetFocus() {
    this._setFocusedItemKey(undefined);
  }
  _createThumbnailColumnCell(container, cellInfo) {
    this._getItemThumbnailContainer(cellInfo.data).appendTo(container);
  }
  _createNameColumnCell(container, cellInfo) {
    const $button = (0, _renderer.default)('<div>');
    const $name = (0, _renderer.default)('<span>').text(cellInfo.data.fileItem.name).addClass(FILE_MANAGER_DETAILS_ITEM_NAME_CLASS);
    const $wrapper = (0, _renderer.default)('<div>').append($name, $button).addClass(FILE_MANAGER_DETAILS_ITEM_NAME_WRAPPER_CLASS);
    (0, _renderer.default)(container).append($wrapper);
    this._createComponent($button, _uiFile_manager3.default, {
      onClick: e => this._onFileItemActionButtonClick(e)
    });
  }
  _calculateSizeColumnCellValue(rowData) {
    return rowData.fileItem.isDirectory ? '' : (0, _uiFile_manager.getDisplayFileSize)(rowData.fileItem.size);
  }
  _selectItem(fileItemInfo) {
    const selectItemFunc = this._isMultipleSelectionMode() ? this._selectItemMultipleSelection : this._selectItemSingleSelection;
    selectItemFunc.call(this, fileItemInfo);
  }
  _deselectItem(item) {
    this._filesView.deselectRows([item.fileItem.key]);
  }
  _selectItemSingleSelection(fileItemInfo) {
    if (!this._focusedItem || !fileItemInfo || this._focusedItem.fileItem.key !== fileItemInfo.fileItem.key) {
      const oldFocusedItem = this._focusedItem;
      this._focusedItem = fileItemInfo;
      const deselectedKeys = [];
      if (oldFocusedItem) {
        deselectedKeys.push(oldFocusedItem.fileItem.key);
      }
      const selectedItems = [];
      const selectedKeys = [];
      if (fileItemInfo && !this._isParentDirectoryItem(fileItemInfo)) {
        selectedItems.push(fileItemInfo.fileItem);
        selectedKeys.push(fileItemInfo.fileItem.key);
      }
      this._raiseSelectionChanged({
        selectedItems,
        selectedItemKeys: selectedKeys,
        currentSelectedItemKeys: [...selectedKeys],
        currentDeselectedItemKeys: deselectedKeys
      });
    }
  }
  _selectItemMultipleSelection(_ref8) {
    let {
      fileItem
    } = _ref8;
    if (!this._filesView.isRowSelected(fileItem.key)) {
      const selectionController = this._filesView.getController('selection');
      const preserve = selectionController.isSelectionWithCheckboxes();
      this._filesView.selectRows([fileItem.key], preserve);
    }
  }
  _setSelectedItemKeys(itemKeys) {
    this._filesView.option('selectedRowKeys', itemKeys);
  }
  _setFocusedItemKey(itemKey) {
    var _this$_filesView;
    (_this$_filesView = this._filesView) === null || _this$_filesView === void 0 || _this$_filesView.option('focusedRowKey', itemKey);
  }
  clearSelection() {
    if (this._isMultipleSelectionMode()) {
      this._filesView.clearSelection();
    } else {
      this._filesView.option('focusedRowIndex', -1);
    }
  }
  refresh(options, operation) {
    const actualOptions = {
      dataSource: this._createDataSource()
    };
    if (options && Object.prototype.hasOwnProperty.call(options, 'focusedItemKey')) {
      if ((0, _type.isDefined)(options.focusedItemKey)) {
        actualOptions.focusedRowKey = options.focusedItemKey;
      } else {
        actualOptions.focusedRowIndex = -1;
      }
    }
    const hasNoScrollTarget = !(0, _type.isDefined)(actualOptions.focusedRowKey) && actualOptions.focusedRowIndex === -1;
    if (hasNoScrollTarget && operation === _file_items_controller.OPERATIONS.NAVIGATION) {
      actualOptions.paging = {
        pageIndex: 0
      };
      this._needResetScrollPosition = true;
    }
    this._filesView.option(actualOptions);
    this._refreshDeferred = new _deferred.Deferred();
    return this._refreshDeferred.promise();
  }
  _getScrollable() {
    return this._filesView.getScrollable();
  }
  getSelectedItems() {
    if (this._isMultipleSelectionMode()) {
      return this._filesView.getSelectedRowsData();
    }
    return this._focusedItem && !this._isParentDirectoryItem(this._focusedItem) ? [this._focusedItem] : [];
  }
}
var _default = exports.default = FileManagerDetailsItemList;
module.exports = exports.default;
module.exports.default = exports.default;