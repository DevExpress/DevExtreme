/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isDefined, isFunction, isString } from '@js/core/utils/type';
import type { ClickEvent } from '@js/ui/button';
import type { Scrollable } from '@js/ui/data_grid';
// NOTE: Using the "public" export here for the theme-builder deps check
import DataGrid from '@js/ui/data_grid';
import { OPERATIONS } from '@ts/ui/file_manager/file_items_controller';
import { extendAttributes, getDisplayFileSize } from '@ts/ui/file_manager/ui.file_manager.common';
import FileManagerFileActionsButton from '@ts/ui/file_manager/ui.file_manager.file_actions_button';
import FileManagerItemListBase from '@ts/ui/file_manager/ui.file_manager.item_list';

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
    cssClass: FILE_MANAGER_DETAILS_ITEM_IS_DIRECTORY_CLASS,
  },
  name: {
    caption: messageLocalization.format(
      'dxFileManager-listDetailsColumnCaptionName',
    ),
  },
  dateModified: {
    caption: messageLocalization.format(
      'dxFileManager-listDetailsColumnCaptionDateModified',
    ),
    width: 110,
    hidingPriority: 1,
  },
  size: {
    caption: messageLocalization.format(
      'dxFileManager-listDetailsColumnCaptionFileSize',
    ),
    width: 90,
    alignment: 'right',
    hidingPriority: 0,
  },
  isParentFolder: {
    caption: 'isParentFolder',
    visible: false,
    sortIndex: 0,
    sortOrder: 'asc',
  },
};

class FileManagerDetailsItemList extends FileManagerItemListBase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _focusedItem?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _selectAllCheckBox?: any;

  _selectAllCheckBoxUpdating?: boolean;

  _filesView?: DataGrid;

  _activeFileActionsButton?: FileManagerFileActionsButton;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _refreshDeferred?: DeferredObj<any>;

  _initMarkup(): void {
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

  _createFilesView(): void {
    const $filesView = $('<div>').appendTo(this.$element());

    const selectionMode = this._isMultipleSelectionMode() ? 'multiple' : 'none';

    this._filesView = this._createComponent($filesView, DataGrid, {
      dataSource: this._createDataSource(),
      hoverStateEnabled: true,
      selection: {
        mode: selectionMode,
        showCheckBoxesMode: this._isDesktop() ? 'onClick' : 'none',
      },
      selectedRowKeys: this.option('selectedItemKeys'),
      focusedRowKey: this.option('focusedItemKey'),
      focusedRowEnabled: true,
      allowColumnResizing: true,
      scrolling: {
        mode: 'virtual',
      },
      sorting: {
        mode: 'single',
        showSortIndexes: false,
      },
      loadPanel: {
        shading: true,
      },
      height: '100%',
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
      onContentReady: this._onContentReady.bind(this),
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _createColumns() {
    // @ts-expect-error ts-error
    let { detailColumns: columns } = this.option();
    columns = columns.slice(0);

    columns = columns.map((column) => {
      let extendedItem = column;
      if (isString(column)) {
        extendedItem = { dataField: column };
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this._getPreparedColumn(extendedItem);
    });

    const customizeDetailColumns = this.option('customizeDetailColumns');
    if (isFunction(customizeDetailColumns)) {
      columns = customizeDetailColumns(columns);
    }

    columns.push(this._getPreparedColumn({ dataField: 'isParentFolder' }));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    columns.forEach((column) => this._updateColumnDataField(column));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return columns;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getPreparedColumn(columnOptions) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = {};
    let resultCssClass = '';

    if (this._isDefaultColumn(columnOptions.dataField)) {
      const defaultConfig = extend(
        true,
        {},
        DEFAULT_COLUMN_CONFIGS[columnOptions.dataField],
      );
      resultCssClass = defaultConfig.cssClass || '';
      switch (columnOptions.dataField) {
        case 'thumbnail':
          defaultConfig.cellTemplate = this._createThumbnailColumnCell.bind(this);
          defaultConfig.calculateSortValue = `fileItem.${defaultConfig.calculateSortValue}`;
          break;
        case 'name':
          defaultConfig.cellTemplate = this._createNameColumnCell.bind(this);
          defaultConfig.caption = messageLocalization.format(
            'dxFileManager-listDetailsColumnCaptionName',
          );
          break;
        case 'size':
          defaultConfig.calculateCellValue = this._calculateSizeColumnCellValue.bind(this);
          defaultConfig.caption = messageLocalization.format(
            'dxFileManager-listDetailsColumnCaptionFileSize',
          );
          defaultConfig.calculateSortValue = (
            rowData,
            // eslint-disable-next-line @stylistic/max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/explicit-function-return-type
          ) => (rowData.fileItem.isDirectory ? -1 : rowData.fileItem.size);
          break;
        case 'dateModified':
          defaultConfig.caption = messageLocalization.format(
            'dxFileManager-listDetailsColumnCaptionDateModified',
          );
          break;
        default:
          break;
      }
      extend(true, result, defaultConfig);
    }

    extendAttributes(result, columnOptions, [
      'alignment',
      'caption',
      'dataField',
      'dataType',
      'hidingPriority',
      'sortIndex',
      'sortOrder',
      'visible',
      'visibleIndex',
      'width',
    ]);

    if (columnOptions.cssClass) {
      resultCssClass = `${resultCssClass} ${columnOptions.cssClass}`;
    }

    if (resultCssClass) {
      result.cssClass = resultCssClass;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _updateColumnDataField(column) {
    const dataItemSuffix = this._isDefaultColumn(column.dataField)
      ? ''
      : 'dataItem.';
    column.dataField = `fileItem.${dataItemSuffix}${column.dataField}`;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return column;
  }

  _isDefaultColumn(columnDataField): boolean {
    return !!DEFAULT_COLUMN_CONFIGS[columnDataField];
  }

  _onFileItemActionButtonClick(e: ClickEvent): void {
    const { component, element, event } = e;
    event?.stopPropagation();

    const $row = component.$element().closest(this._getItemSelector());
    const fileItemInfo = $row.data('item');
    this._selectItem(fileItemInfo);
    const target = {
      itemData: fileItemInfo,
      itemElement: $row,
      isActionButton: true,
    };
    const items = this._getFileItemsForContextMenu(fileItemInfo);
    this._showContextMenu(items, element, event, target);
    // @ts-expect-error ts-error
    this._activeFileActionsButton = component;
    this._activeFileActionsButton?.setActive(true);
  }

  _onContextMenuHidden(): void {
    if (this._activeFileActionsButton) {
      this._activeFileActionsButton.setActive(false);
    }
  }

  _getItemThumbnailCssClass(): string {
    return FILE_MANAGER_DETAILS_ITEM_THUMBNAIL_CLASS;
  }

  _getItemSelector(): string {
    return `.${DATA_GRID_DATA_ROW_CLASS}`;
  }

  _onItemDblClick(e): void {
    const $row = $(e.currentTarget);
    const fileItemInfo = $row.data('item');
    this._raiseSelectedItemOpened(fileItemInfo);
  }

  _isAllItemsSelected(): boolean | undefined {
    const selectableItemsCount = this._hasParentDirectoryItem
      ? this._itemCount - 1
      : this._itemCount;
    const { selectedRowKeys } = this._filesView?.option() ?? {};

    if (!selectedRowKeys?.length) {
      return false;
    }

    return selectedRowKeys.length >= selectableItemsCount ? true : undefined;
  }

  _onEditorPreparing({
    component,
    command,
    row,
    parentType,
    editorOptions,
  }): void {
    if (!this._filesView) {
      this._filesView = component;
    }

    if (command === 'select' && row) {
      if (this._isParentDirectoryItem(row.data)) {
        editorOptions.disabled = true;
      }
    } else if (parentType === 'headerRow') {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      editorOptions.onInitialized = ({ component }): void => {
        this._selectAllCheckBox = component;
      };
      editorOptions.value = this._isAllItemsSelected();
      editorOptions.onValueChanged = (args): void => this._onSelectAllCheckBoxValueChanged(args);
    }
  }

  _onSelectAllCheckBoxValueChanged({ event, previousValue, value }): void {
    if (!event) {
      if (
        previousValue
        && !this._selectAllCheckBoxUpdating
        && this._selectAllCheckBox
      ) {
        this._selectAllCheckBox.option('value', previousValue);
      }
      return;
    }

    if (this._isAllItemsSelected() === value) {
      return;
    }

    if (value) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._filesView?.selectAll();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._filesView?.deselectAll();
    }

    event.preventDefault();
  }

  _onRowPrepared({ rowType, rowElement, data }): void {
    if (rowType === 'data') {
      const $row = $(rowElement);
      $row.data('item', data);

      if (this._isParentDirectoryItem(data)) {
        $row.addClass(FILE_MANAGER_PARENT_DIRECTORY_ITEM);
      }
    }
  }

  _onContextMenuPreparing(e): void {
    if (!this._isDesktop()) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fileItems: any = null;
    let item = {};

    if (e.row && e.row.rowType === 'data') {
      item = e.row.data;
      this._selectItem(item);
      fileItems = this._getFileItemsForContextMenu(item);
    }

    const eventArgs = extend(
      {},
      {
        targetElement:
          e.target === 'content' && isDefined(e.row)
            ? this._filesView?.getRowElement(e.rowIndex)
            : undefined,
        itemData: item,
        options: this._contextMenu.option(),
        event: e.event,
        isActionButton: false,
        cancel: false,
      },
    );
    this._raiseContextMenuShowing(eventArgs);
    e.items = eventArgs.cancel
      ? []
      : this._contextMenu.createContextMenuItems(fileItems, null, item);
  }

  _onFilesViewSelectionChanged({
    component,
    selectedRowsData,
    selectedRowKeys,
    currentSelectedRowKeys,
    currentDeselectedRowKeys,
  }): void {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    this._filesView = this._filesView || component;

    if (this._selectAllCheckBox) {
      this._selectAllCheckBoxUpdating = true;
      this._selectAllCheckBox.option('value', this._isAllItemsSelected());
      this._selectAllCheckBoxUpdating = false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const selectedItems = selectedRowsData.map((itemInfo) => itemInfo.fileItem);
    this._tryRaiseSelectionChanged({
      selectedItemInfos: selectedRowsData,
      selectedItems,
      selectedItemKeys: selectedRowKeys,
      currentSelectedItemKeys: currentSelectedRowKeys,
      currentDeselectedItemKeys: currentDeselectedRowKeys,
    });
  }

  _onFilesViewFocusedRowChanged(e): void {
    if (!this._isMultipleSelectionMode()) {
      this._selectItemSingleSelection(e.row?.data);
    }

    const fileSystemItem = e.row?.data.fileItem || null;
    this._onFocusedItemChanged({
      item: fileSystemItem,
      itemKey: fileSystemItem?.key,
      itemElement: e.rowElement,
    });
  }

  _onFilesViewOptionChanged({ fullName }): void {
    if (fullName.indexOf('sortOrder') > -1) {
      this._filesView?.columnOption('isParentFolder', {
        sortOrder: 'asc',
        sortIndex: 0,
      });
    }
  }

  _resetFocus(): void {
    this._setFocusedItemKey(undefined);
  }

  _createThumbnailColumnCell(container, cellInfo): void {
    this._getItemThumbnailContainer(cellInfo.data)?.appendTo(container);
  }

  _createNameColumnCell(container, cellInfo): void {
    const $button = $('<div>');

    const $name = $('<span>')
      .text(cellInfo.data.fileItem.name)
      .addClass(FILE_MANAGER_DETAILS_ITEM_NAME_CLASS);

    const $wrapper = $('<div>')
      // @ts-expect-error ts-error
      .append($name, $button)
      .addClass(FILE_MANAGER_DETAILS_ITEM_NAME_WRAPPER_CLASS);

    $(container).append($wrapper);

    this._createComponent($button, FileManagerFileActionsButton, {
      onClick: (e): void => this._onFileItemActionButtonClick(e),
    });
  }

  _calculateSizeColumnCellValue(rowData): string {
    return rowData.fileItem.isDirectory
      ? ''
      : getDisplayFileSize(rowData.fileItem.size);
  }

  _selectItem(fileItemInfo): void {
    const selectItemFunc = this._isMultipleSelectionMode()
      ? this._selectItemMultipleSelection
      : this._selectItemSingleSelection;
    selectItemFunc.call(this, fileItemInfo);
  }

  _deselectItem(item): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._filesView?.deselectRows([item.fileItem.key]);
  }

  _selectItemSingleSelection(fileItemInfo): void {
    if (
      !this._focusedItem
      || !fileItemInfo
      || this._focusedItem.fileItem.key !== fileItemInfo.fileItem.key
    ) {
      const oldFocusedItem = this._focusedItem;
      this._focusedItem = fileItemInfo;

      const deselectedKeys = [];
      if (oldFocusedItem) {
        // @ts-expect-error ts-error
        deselectedKeys.push(oldFocusedItem.fileItem.key);
      }

      const selectedItems = [];
      const selectedKeys = [];
      if (fileItemInfo && !this._isParentDirectoryItem(fileItemInfo)) {
        // @ts-expect-error ts-error
        selectedItems.push(fileItemInfo.fileItem);
        // @ts-expect-error ts-error
        selectedKeys.push(fileItemInfo.fileItem.key);
      }

      this._raiseSelectionChanged({
        selectedItems,
        selectedItemKeys: selectedKeys,
        currentSelectedItemKeys: [...selectedKeys],
        currentDeselectedItemKeys: deselectedKeys,
      });
    }
  }

  _selectItemMultipleSelection({ fileItem }): void {
    if (!this._filesView?.isRowSelected(fileItem.key)) {
      // @ts-expect-error ts-error
      const selectionController = this._filesView?.getController('selection');
      const preserve = selectionController.isSelectionWithCheckboxes();
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._filesView?.selectRows([fileItem.key], preserve);
    }
  }

  _setSelectedItemKeys(itemKeys): void {
    this._filesView?.option('selectedRowKeys', itemKeys);
  }

  _setFocusedItemKey(itemKey): void {
    this._filesView?.option('focusedRowKey', itemKey);
  }

  clearSelection(): void {
    if (this._isMultipleSelectionMode()) {
      this._filesView?.clearSelection();
    } else {
      this._filesView?.option('focusedRowIndex', -1);
    }
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-misused-promises
  refresh(options?, operation?) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actualOptions: any = {
      dataSource: this._createDataSource(),
    };

    if (
      options
      && Object.prototype.hasOwnProperty.call(options, 'focusedItemKey')
    ) {
      if (isDefined(options.focusedItemKey)) {
        actualOptions.focusedRowKey = options.focusedItemKey;
      } else {
        actualOptions.focusedRowIndex = -1;
      }
    }

    const hasNoScrollTarget = !isDefined(actualOptions.focusedRowKey)
      && actualOptions.focusedRowIndex === -1;
    if (hasNoScrollTarget && operation === OPERATIONS.NAVIGATION) {
      actualOptions.paging = {
        pageIndex: 0,
      };
      this._needResetScrollPosition = true;
    }
    this._filesView?.option(actualOptions);

    // @ts-expect-error ts-error
    this._refreshDeferred = new Deferred();

    return this._refreshDeferred?.promise();
  }

  _getScrollable(): Scrollable | undefined {
    return this._filesView?.getScrollable();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getSelectedItems() {
    if (this._isMultipleSelectionMode()) {
      return this._filesView?.getSelectedRowsData();
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._focusedItem && !this._isParentDirectoryItem(this._focusedItem)
      ? [this._focusedItem]
      : [];
  }
}

export default FileManagerDetailsItemList;
