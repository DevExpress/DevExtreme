import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { extendAttributes, getDisplayFileSize } from './ui.file_manager.common';
import { isString, isFunction, isDefined } from '../../core/utils/type';
import messageLocalization from '../../common/core/localization/message';

// NOTE: Using the "public" export here for the theme-builder deps check
import DataGrid from '../../ui/data_grid';

import FileManagerItemListBase from './ui.file_manager.item_list';
import FileManagerFileActionsButton from './ui.file_manager.file_actions_button';
import { Deferred } from '../../core/utils/deferred';
import { OPERATIONS } from './file_items_controller';

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
        caption: messageLocalization.format('dxFileManager-listDetailsColumnCaptionName'),
    },
    dateModified: {
        caption: messageLocalization.format('dxFileManager-listDetailsColumnCaptionDateModified'),
        width: 110,
        hidingPriority: 1,
    },
    size: {
        caption: messageLocalization.format('dxFileManager-listDetailsColumnCaptionFileSize'),
        width: 90,
        alignment: 'right',
        hidingPriority: 0,
    },
    isParentFolder: {
        caption: 'isParentFolder',
        visible: false,
        sortIndex: 0,
        sortOrder: 'asc'
    }
};

class FileManagerDetailsItemList extends FileManagerItemListBase {

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
        const $filesView = $('<div>').appendTo(this.$element());

        const selectionMode = this._isMultipleSelectionMode() ? 'multiple' : 'none';

        this._filesView = this._createComponent($filesView, DataGrid, {
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
            if(isString(column)) {
                extendedItem = { dataField: column };
            }
            return this._getPreparedColumn(extendedItem);
        });

        const customizeDetailColumns = this.option('customizeDetailColumns');
        if(isFunction(customizeDetailColumns)) {
            columns = customizeDetailColumns(columns);
        }

        columns.push(this._getPreparedColumn({ dataField: 'isParentFolder' }));
        columns.forEach(column => this._updateColumnDataField(column));
        return columns;
    }

    _getPreparedColumn(columnOptions) {
        const result = {};
        let resultCssClass = '';

        if(this._isDefaultColumn(columnOptions.dataField)) {
            const defaultConfig = extend(true, {}, DEFAULT_COLUMN_CONFIGS[columnOptions.dataField]);
            resultCssClass = defaultConfig.cssClass || '';
            switch(columnOptions.dataField) {
                case 'thumbnail':
                    defaultConfig.cellTemplate = this._createThumbnailColumnCell.bind(this);
                    defaultConfig.calculateSortValue = `fileItem.${defaultConfig.calculateSortValue}`;
                    break;
                case 'name':
                    defaultConfig.cellTemplate = this._createNameColumnCell.bind(this);
                    defaultConfig.caption = messageLocalization.format('dxFileManager-listDetailsColumnCaptionName');
                    break;
                case 'size':
                    defaultConfig.calculateCellValue = this._calculateSizeColumnCellValue.bind(this);
                    defaultConfig.caption = messageLocalization.format('dxFileManager-listDetailsColumnCaptionFileSize');
                    defaultConfig.calculateSortValue = rowData => rowData.fileItem.isDirectory ? -1 : rowData.fileItem.size;
                    break;
                case 'dateModified':
                    defaultConfig.caption = messageLocalization.format('dxFileManager-listDetailsColumnCaptionDateModified');
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
            'width'
        ]);

        if(columnOptions.cssClass) {
            resultCssClass = `${resultCssClass} ${columnOptions.cssClass}`;
        }

        if(resultCssClass) {
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

    _onFileItemActionButtonClick({ component, element, event }) {
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
        if(this._activeFileActionsButton) {
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
        const $row = $(e.currentTarget);
        const fileItemInfo = $row.data('item');
        this._raiseSelectedItemOpened(fileItemInfo);
    }

    _isAllItemsSelected() {
        const selectableItemsCount = this._hasParentDirectoryItem ? this._itemCount - 1 : this._itemCount;
        const selectedRowKeys = this._filesView.option('selectedRowKeys');

        if(!selectedRowKeys.length) {
            return false;
        }

        return selectedRowKeys.length >= selectableItemsCount ? true : undefined;
    }

    _onEditorPreparing({ component, command, row, parentType, editorOptions }) {
        if(!this._filesView) {
            this._filesView = component;
        }

        if(command === 'select' && row) {
            if(this._isParentDirectoryItem(row.data)) {
                editorOptions.disabled = true;
            }
        } else if(parentType === 'headerRow') {
            editorOptions.onInitialized = ({ component }) => {
                this._selectAllCheckBox = component;
            };
            editorOptions.value = this._isAllItemsSelected();
            editorOptions.onValueChanged = args => this._onSelectAllCheckBoxValueChanged(args);
        }
    }

    _onSelectAllCheckBoxValueChanged({ event, previousValue, value }) {
        if(!event) {
            if(previousValue && !this._selectAllCheckBoxUpdating && this._selectAllCheckBox) {
                this._selectAllCheckBox.option('value', previousValue);
            }
            return;
        }

        if(this._isAllItemsSelected() === value) {
            return;
        }

        if(value) {
            this._filesView.selectAll();
        } else {
            this._filesView.deselectAll();
        }

        event.preventDefault();
    }

    _onRowPrepared({ rowType, rowElement, data }) {
        if(rowType === 'data') {
            const $row = $(rowElement);
            $row.data('item', data);

            if(this._isParentDirectoryItem(data)) {
                $row.addClass(FILE_MANAGER_PARENT_DIRECTORY_ITEM);
            }
        }
    }

    _onContextMenuPreparing(e) {
        if(!this._isDesktop()) {
            return;
        }
        let fileItems = null;
        let item = {};

        if(e.row && e.row.rowType === 'data') {
            item = e.row.data;
            this._selectItem(item);
            fileItems = this._getFileItemsForContextMenu(item);
        }

        const eventArgs = extend({}, {
            targetElement: e.target === 'content' && isDefined(e.row) ? this._filesView.getRowElement(e.rowIndex) : undefined,
            itemData: item,
            options: this._contextMenu.option(),
            event: e.event,
            isActionButton: false,
            cancel: false
        });
        this._raiseContextMenuShowing(eventArgs);
        e.items = eventArgs.cancel ? [] : this._contextMenu.createContextMenuItems(fileItems, null, item);
    }

    _onFilesViewSelectionChanged({ component, selectedRowsData, selectedRowKeys, currentSelectedRowKeys, currentDeselectedRowKeys }) {
        this._filesView = this._filesView || component;

        if(this._selectAllCheckBox) {
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
        if(!this._isMultipleSelectionMode()) {
            this._selectItemSingleSelection(e.row?.data);
        }

        const fileSystemItem = e.row?.data.fileItem || null;
        this._onFocusedItemChanged({
            item: fileSystemItem,
            itemKey: fileSystemItem?.key,
            itemElement: e.rowElement
        });
    }

    _onFilesViewOptionChanged({ fullName }) {
        if(fullName.indexOf('sortOrder') > -1) {
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
        const $button = $('<div>');

        const $name = $('<span>')
            .text(cellInfo.data.fileItem.name)
            .addClass(FILE_MANAGER_DETAILS_ITEM_NAME_CLASS);

        const $wrapper = $('<div>')
            .append($name, $button)
            .addClass(FILE_MANAGER_DETAILS_ITEM_NAME_WRAPPER_CLASS);

        $(container).append($wrapper);

        this._createComponent($button, FileManagerFileActionsButton, {
            onClick: e => this._onFileItemActionButtonClick(e)
        });
    }

    _calculateSizeColumnCellValue(rowData) {
        return rowData.fileItem.isDirectory ? '' : getDisplayFileSize(rowData.fileItem.size);
    }

    _selectItem(fileItemInfo) {
        const selectItemFunc = this._isMultipleSelectionMode() ? this._selectItemMultipleSelection : this._selectItemSingleSelection;
        selectItemFunc.call(this, fileItemInfo);
    }

    _deselectItem(item) {
        this._filesView.deselectRows([ item.fileItem.key ]);
    }

    _selectItemSingleSelection(fileItemInfo) {
        if(!this._focusedItem || !fileItemInfo || this._focusedItem.fileItem.key !== fileItemInfo.fileItem.key) {
            const oldFocusedItem = this._focusedItem;
            this._focusedItem = fileItemInfo;

            const deselectedKeys = [];
            if(oldFocusedItem) {
                deselectedKeys.push(oldFocusedItem.fileItem.key);
            }

            const selectedItems = [];
            const selectedKeys = [];
            if(fileItemInfo && !this._isParentDirectoryItem(fileItemInfo)) {
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

    _selectItemMultipleSelection({ fileItem }) {
        if(!this._filesView.isRowSelected(fileItem.key)) {
            const selectionController = this._filesView.getController('selection');
            const preserve = selectionController.isSelectionWithCheckboxes();
            this._filesView.selectRows([fileItem.key], preserve);
        }
    }

    _setSelectedItemKeys(itemKeys) {
        this._filesView.option('selectedRowKeys', itemKeys);
    }

    _setFocusedItemKey(itemKey) {
        this._filesView?.option('focusedRowKey', itemKey);
    }

    clearSelection() {
        if(this._isMultipleSelectionMode()) {
            this._filesView.clearSelection();
        } else {
            this._filesView.option('focusedRowIndex', -1);
        }
    }

    refresh(options, operation) {
        const actualOptions = {
            dataSource: this._createDataSource()
        };

        if(options && Object.prototype.hasOwnProperty.call(options, 'focusedItemKey')) {
            if(isDefined(options.focusedItemKey)) {
                actualOptions.focusedRowKey = options.focusedItemKey;
            } else {
                actualOptions.focusedRowIndex = -1;
            }
        }

        const hasNoScrollTarget = !isDefined(actualOptions.focusedRowKey) && actualOptions.focusedRowIndex === -1;
        if(hasNoScrollTarget && operation === OPERATIONS.NAVIGATION) {
            actualOptions.paging = {
                pageIndex: 0
            };
            this._needResetScrollPosition = true;
        }
        this._filesView.option(actualOptions);

        this._refreshDeferred = new Deferred();
        return this._refreshDeferred.promise();
    }

    _getScrollable() {
        return this._filesView.getScrollable();
    }

    getSelectedItems() {
        if(this._isMultipleSelectionMode()) {
            return this._filesView.getSelectedRowsData();
        }
        return this._focusedItem && !this._isParentDirectoryItem(this._focusedItem) ? [ this._focusedItem ] : [];
    }

}

export default FileManagerDetailsItemList;
