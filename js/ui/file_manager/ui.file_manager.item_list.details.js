import $ from '../../core/renderer';
import typeUtils from '../../core/utils/type';
import messageLocalization from '../../localization/message';

import DataGrid from '../data_grid/ui.data_grid';
import CustomStore from '../../data/custom_store';

import FileManagerItemListBase from './ui.file_manager.item_list';
import FileManagerFileActionsButton from './ui.file_manager.file_actions_button';
import { getDisplayFileSize } from './ui.file_manager.utils.js';

const FILE_MANAGER_DETAILS_ITEM_LIST_CLASS = 'dx-filemanager-details';
const FILE_MANAGER_DETAILS_ITEM_THUMBNAIL_CLASS = 'dx-filemanager-details-item-thumbnail';
const FILE_MANAGER_DETAILS_ITEM_NAME_CLASS = 'dx-filemanager-details-item-name';
const FILE_MANAGER_DETAILS_ITEM_NAME_WRAPPER_CLASS = 'dx-filemanager-details-item-name-wrapper';
const FILE_MANAGER_DETAILS_ITEM_IS_DIRECTORY_CLASS = 'dx-filemanager-details-item-is-directory';
const FILE_MANAGER_PARENT_DIRECTORY_ITEM = 'dx-filemanager-parent-directory-item';
const DATA_GRID_DATA_ROW_CLASS = 'dx-data-row';
const PREDEFINED_COLUMN_NAMES = [ 'name', 'isDirectory', 'size', 'thumbnail', 'dateModified', 'isParentFolder' ];

class FileManagerDetailsItemList extends FileManagerItemListBase {

    _initMarkup() {
        this._itemCount = 0;
        this._focusedItem = null;
        this._hasParentDirectoryItem = false;
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
                mode: selectionMode
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
        let columns = [
            {
                dataField: 'isDirectory',
                caption: '',
                width: 36,
                alignment: 'center',
                cellTemplate: this._createThumbnailColumnCell.bind(this),
                cssClass: FILE_MANAGER_DETAILS_ITEM_IS_DIRECTORY_CLASS
            },
            {
                dataField: 'name',
                caption: messageLocalization.format('dxFileManager-listDetailsColumnCaptionName'),
                cellTemplate: this._createNameColumnCell.bind(this)
            },
            {
                dataField: 'dateModified',
                caption: messageLocalization.format('dxFileManager-listDetailsColumnCaptionDateModified'),
                width: 110,
                hidingPriority: 1,
            },
            {
                dataField: 'size',
                caption: messageLocalization.format('dxFileManager-listDetailsColumnCaptionFileSize'),
                width: 90,
                alignment: 'right',
                hidingPriority: 0,
                calculateCellValue: this._calculateSizeColumnCellValue.bind(this)
            },
            {
                dataField: 'isParentFolder',
                caption: 'isParentFolder',
                visible: false,
                sortIndex: 0,
                sortOrder: 'asc'
            }
        ];

        const customizeDetailColumns = this.option('customizeDetailColumns');
        if(typeUtils.isFunction(customizeDetailColumns)) {
            columns = customizeDetailColumns(columns);
        }

        for(let i = 0; i < columns.length; i++) {
            const dataItemSuffix = PREDEFINED_COLUMN_NAMES.indexOf(columns[i].dataField) < 0 ? 'dataItem.' : '';
            columns[i].dataField = 'fileItem.' + dataItemSuffix + columns[i].dataField;
        }
        return columns;
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
            if(previousValue && !this._selectAllCheckBoxUpdating) {
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
        let fileItems = null;

        if(e.row && e.row.rowType === 'data') {
            const item = e.row.data;
            this._selectItem(item);
            fileItems = this._getFileItemsForContextMenu(item);
        }

        e.items = this._contextMenu.createContextMenuItems(fileItems);
    }

    _onFilesViewSelectionChanged({ selectedRowsData }) {
        const parentDirectoryItem = this._findParentDirectoryItem(selectedRowsData);
        if(parentDirectoryItem) {
            this._filesView.deselectRows([ parentDirectoryItem.fileItem.key ]);
        }

        this._selectAllCheckBoxUpdating = true;
        this._selectAllCheckBox.option('value', this._isAllItemsSelected());
        this._selectAllCheckBoxUpdating = false;

        this._raiseSelectionChanged();
    }

    _onFocusedRowChanged({ row }) {
        this._selectItemSingleSelection(row.data);
    }

    _onFilesViewOptionChanged({ fullName }) {
        if(fullName.indexOf('sortOrder') > -1) {
            this._filesView.columnOption('isParentFolder', {
                sortOrder: 'asc',
                sortIndex: 0
            });
        }
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

    _selectItemSingleSelection(fileItemInfo) {
        if(!this._focusedItem || this._focusedItem.fileItem.key !== fileItemInfo.fileItem.key) {
            this._focusedItem = fileItemInfo;
            this._raiseSelectionChanged();
        }
    }

    _selectItemMultipleSelection({ fileItem }) {
        if(!this._filesView.isRowSelected(fileItem.key)) {
            const selectionController = this._filesView.getController('selection');
            const preserve = selectionController.isSelectionWithCheckboxes();
            this._filesView.selectRows([fileItem.key], preserve);
        }
    }

    _getItemsInternal() {
        return this._getItems().done(itemInfos => {
            this._itemCount = itemInfos.length;
            this._hasParentDirectoryItem = !!this._findParentDirectoryItem(itemInfos);
        });
    }

    _findParentDirectoryItem(itemInfos) {
        for(let i = 0; i < itemInfos.length; i++) {
            const itemInfo = itemInfos[i];
            if(this._isParentDirectoryItem(itemInfo)) {
                return itemInfo;
            }
        }
        return null;
    }

    _getFileItemsForContextMenu(fileItem) {
        const result = this.getSelectedItems();

        if(this._isParentDirectoryItem(fileItem)) {
            result.push(fileItem);
        }

        return result;
    }

    _isParentDirectoryItem(itemInfo) {
        return itemInfo.fileItem.isParentFolder;
    }

    _isMultipleSelectionMode() {
        return this.option('selectionMode') === 'multiple';
    }

    clearSelection() {
        this._filesView.clearSelection();
    }

    refresh() {
        this.clearSelection();
        this._filesView.option('dataSource', {
            'store': new CustomStore({
                key: 'fileItem.key',
                load: this._getItemsInternal.bind(this)
            })
        });
    }

    getSelectedItems() {
        if(this._isMultipleSelectionMode()) {
            return this._filesView.getSelectedRowsData();
        }
        return this._focusedItem && !this._isParentDirectoryItem(this._focusedItem) ? [ this._focusedItem ] : [];
    }

}

module.exports = FileManagerDetailsItemList;
