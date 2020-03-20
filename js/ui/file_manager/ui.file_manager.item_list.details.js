import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { isString, isFunction } from '../../core/utils/type';
import messageLocalization from '../../localization/message';

import DataGrid from '../data_grid/ui.data_grid';

import FileManagerItemListBase from './ui.file_manager.item_list';
import FileManagerFileActionsButton from './ui.file_manager.file_actions_button';
import { getDisplayFileSize } from './ui.file_manager.common';

const FILE_MANAGER_DETAILS_ITEM_LIST_CLASS = 'dx-filemanager-details';
const FILE_MANAGER_DETAILS_ITEM_THUMBNAIL_CLASS = 'dx-filemanager-details-item-thumbnail';
const FILE_MANAGER_DETAILS_ITEM_NAME_CLASS = 'dx-filemanager-details-item-name';
const FILE_MANAGER_DETAILS_ITEM_NAME_WRAPPER_CLASS = 'dx-filemanager-details-item-name-wrapper';
const FILE_MANAGER_DETAILS_ITEM_IS_DIRECTORY_CLASS = 'dx-filemanager-details-item-is-directory';
const FILE_MANAGER_PARENT_DIRECTORY_ITEM = 'dx-filemanager-parent-directory-item';
const DATA_GRID_DATA_ROW_CLASS = 'dx-data-row';
const PREDEFINED_COLUMN_NAMES = [ 'name', 'size', 'thumbnail', 'dateModified', 'isParentFolder' ];

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
            hoverStateEnabled: true,
            selection: {
                mode: selectionMode,
                showCheckBoxesMode: this._isDesktop() ? 'onClick' : 'none'
            },
            focusedRowEnabled: true,
            allowColumnResizing: true,
            scrolling: {
                mode: 'virtual'
            },
            sorting: {
                mode: 'single',
                showSortIndexes: false
            },
            showColumnLines: false,
            showRowLines: false,
            columnHidingEnabled: true,
            columns: this._createColumns(),
            onEditorPreparing: this._onEditorPreparing.bind(this),
            onRowPrepared: this._onRowPrepared.bind(this),
            onContextMenuPreparing: this._onContextMenuPreparing.bind(this),
            onSelectionChanged: this._onFilesViewSelectionChanged.bind(this),
            onFocusedRowChanged: this._onFocusedRowChanged.bind(this),
            onOptionChanged: this._onFilesViewOptionChanged.bind(this)
        });

        this.refresh();
    }

    _createColumns() {
        let columns = this.option('detailColumns');
        const preparedColumns = [];

        const customizeDetailColumns = this.option('customizeDetailColumns');
        if(isFunction(customizeDetailColumns)) {
            columns = customizeDetailColumns(columns);
        }

        columns = columns.filter(item => item.dataField !== 'isParentFolder');
        columns.push({ dataField: 'isParentFolder' });

        for(let i = 0; i < columns.length; i++) {
            let extendedItem = columns[i];
            if(isString(columns[i])) {
                extendedItem = { dataField: columns[i] };
            }
            preparedColumns.push(this._configureColumn(extendedItem));
        }

        return preparedColumns;
    }

    _configureColumn(columnOptions) {
        const dataItemSuffix = PREDEFINED_COLUMN_NAMES.indexOf(columnOptions.dataField) < 0 ? 'dataItem.' : '';
        const result = {};
        let resultCssClass = '';

        if(this._isDefaultColumn(columnOptions.dataField)) {
            const defaultConfig = DEFAULT_COLUMN_CONFIGS[columnOptions.dataField];
            resultCssClass = defaultConfig.cssClass;
            if(columnOptions.cssClass) {
                resultCssClass += ` ${columnOptions.cssClass}`;
            }
            if(columnOptions.dataField === 'thumbnail' || columnOptions.dataField === 'name') {
                defaultConfig.cellTemplate = this[`_${columnOptions.dataField}ColumnCellTemplate`].bind(this);
            }
            if(columnOptions.dataField === 'thumbnail') {
                defaultConfig.calculateSortValue = 'fileItem.' + dataItemSuffix + defaultConfig.calculateSortValue;
            }
            if(columnOptions.dataField === 'size') {
                defaultConfig.calculateCellValue = this._calculateSizeColumnCellValue.bind(this);
            }
            extend(true, result, defaultConfig);
        }

        extend(true, result, columnOptions);

        result.dataField = 'fileItem.' + dataItemSuffix + result.dataField;
        result.cssClass = resultCssClass;
        return result;
    }

    _isDefaultColumn(columnDataField) {
        return !!DEFAULT_COLUMN_CONFIGS[columnDataField];
    }

    _onFileItemActionButtonClick({ component, element, event }) {
        event.stopPropagation();

        const $row = component.$element().closest(this._getItemSelector());
        const fileItemInfo = $row.data('item');
        this._selectItem(fileItemInfo);
        this._showContextMenu(this._getFileItemsForContextMenu(fileItemInfo), element);
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

        if(e.row && e.row.rowType === 'data') {
            const item = e.row.data;
            this._selectItem(item);
            fileItems = this._getFileItemsForContextMenu(item);
        }

        e.items = this._contextMenu.createContextMenuItems(fileItems);
    }

    _onFilesViewSelectionChanged({ selectedRowsData, selectedRowKeys, currentSelectedRowKeys, currentDeselectedRowKeys }) {
        if(this._selectAllCheckBox) {
            this._selectAllCheckBoxUpdating = true;
            this._selectAllCheckBox.option('value', this._isAllItemsSelected());
            this._selectAllCheckBoxUpdating = false;
        }

        const selectedItems = selectedRowsData.map(itemInfo => itemInfo.fileItem);
        this._tryRaiseSelectionChanged({
            selectedItems,
            selectedItemKeys: selectedRowKeys,
            currentSelectedItemKeys: currentSelectedRowKeys,
            currentDeselectedItemKeys: currentDeselectedRowKeys
        });
    }

    _onFocusedRowChanged({ row }) {
        if(!this._isMultipleSelectionMode()) {
            this._selectItemSingleSelection(row.data);
        }
    }

    _onFilesViewOptionChanged({ fullName }) {
        if(fullName.indexOf('sortOrder') > -1) {
            this._filesView.columnOption('isParentFolder', {
                sortOrder: 'asc',
                sortIndex: 0
            });
        }
    }

    _thumbnailColumnCellTemplate(container, cellInfo) {
        this._getItemThumbnailContainer(cellInfo.data).appendTo(container);
    }

    _nameColumnCellTemplate(container, cellInfo) {
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
        if(!this._focusedItem || this._focusedItem.fileItem.key !== fileItemInfo.fileItem.key) {
            const oldFocusedItem = this._focusedItem;
            this._focusedItem = fileItemInfo;

            const deselectedKeys = [];
            if(oldFocusedItem) {
                deselectedKeys.push(oldFocusedItem.fileItem.key);
            }

            this._raiseSelectionChanged({
                selectedItems: [ fileItemInfo.fileItem ],
                selectedItemKeys: [ fileItemInfo.fileItem.key ],
                currentSelectedItemKeys: [ fileItemInfo.fileItem.key ],
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

    clearSelection() {
        this._filesView.clearSelection();
    }

    refresh() {
        this.clearSelection();
        this._filesView.option('dataSource', this._createDataSource());
    }

    getSelectedItems() {
        if(this._isMultipleSelectionMode()) {
            return this._filesView.getSelectedRowsData();
        }
        return this._focusedItem && !this._isParentDirectoryItem(this._focusedItem) ? [ this._focusedItem ] : [];
    }

}

module.exports = FileManagerDetailsItemList;
