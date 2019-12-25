import $ from '../../core/renderer';
import typeUtils from '../../core/utils/type';

import DataGrid from '../data_grid/ui.data_grid';
import CustomStore from '../../data/custom_store';

import FileManagerItemListBase from './ui.file_manager.item_list';
import FileManagerFileActionsButton from './ui.file_manager.file_actions_button';
import { getDisplayFileSize } from './ui.file_manager.utils.js';

const FILE_MANAGER_DETAILS_ITEM_LIST_CLASS = 'dx-filemanager-details';
const FILE_MANAGER_DETAILS_ITEM_THUMBNAIL_CLASS = 'dx-filemanager-details-item-thumbnail';
const FILE_MANAGER_DETAILS_ITEM_NAME_CLASS = 'dx-filemanager-details-item-name';
const FILE_MANAGER_DETAILS_ITEM_NAME_WRAPPER_CLASS = 'dx-filemanager-details-item-name-wrapper';
const DATA_GRID_DATA_ROW_CLASS = 'dx-data-row';
const PREDEFINED_COLUMN_NAMES = [ 'name', 'isDirectory', 'size', 'thumbnail', 'dateModified' ];

class FileManagerDetailsItemList extends FileManagerItemListBase {

    _initMarkup() {
        this._createFilesView();

        this._contextMenu.option('onContextMenuHidden', () => this._onContextMenuHidden());

        super._initMarkup();
    }

    _createFilesView() {
        const selectionMode = this.option('selectionMode');

        this._filesView = this._createComponent('<div>', DataGrid, {
            hoverStateEnabled: true,
            selection: {
                mode: selectionMode
            },
            allowColumnResizing: true,
            scrolling: {
                mode: 'virtual'
            },
            showColumnLines: false,
            showRowLines: false,
            columnHidingEnabled: true,
            columns: this._createColumns(),
            onRowPrepared: this._onRowPrepared.bind(this),
            onContextMenuPreparing: this._onContextMenuPreparing.bind(this),
            onSelectionChanged: this._raiseSelectionChanged.bind(this)
        });

        this.$element()
            .addClass(FILE_MANAGER_DETAILS_ITEM_LIST_CLASS)
            .append(this._filesView.$element());

        this._loadFilesViewData();
    }

    _createFilesViewStore() {
        return new CustomStore({
            key: 'relativeName',
            load: this._getItems.bind(this)
        });
    }

    _loadFilesViewData() {
        this._filesView.option('dataSource', {
            'store': this._createFilesViewStore()
        });
    }

    _createColumns() {
        let columns = [
            {
                dataField: 'thumbnail',
                caption: '',
                width: 64,
                alignment: 'center',
                cellTemplate: this._createThumbnailColumnCell.bind(this)
            },
            {
                dataField: 'name',
                cellTemplate: this._createNameColumnCell.bind(this)
            },
            {
                dataField: 'dateModified',
                caption: 'Date Modified',
                width: 110,
                hidingPriority: 1,
            },
            {
                dataField: 'size',
                caption: 'File Size',
                width: 90,
                alignment: 'right',
                hidingPriority: 0,
                calculateCellValue: this._calculateSizeColumnCellValue.bind(this)
            }
        ];
        const customizeDetailColumns = this.option('customizeDetailColumns');
        if(typeUtils.isFunction(customizeDetailColumns)) {
            columns = customizeDetailColumns(columns);
            for(let i = 0; i < columns.length; i++) {
                if(PREDEFINED_COLUMN_NAMES.indexOf(columns[i].dataField) < 0) {
                    columns[i].dataField = 'dataItem.' + columns[i].dataField;
                }
            }
        }
        return columns;
    }

    _onFileItemActionButtonClick({ component, element, event }) {
        event.stopPropagation();
        const $row = component.$element().closest(this._getItemSelector());
        const item = $row.data('item');
        this._ensureItemSelected(item);
        this._showContextMenu(this.getSelectedItems(), element);
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
        const item = $row.data('item');
        this._raiseSelectedItemOpened(item);
    }

    _onRowPrepared(e) {
        if(e.rowType === 'data') {
            $(e.rowElement).data('item', e.data);
        }
    }

    _onContextMenuPreparing(e) {
        let fileItems = null;

        if(e.row && e.row.rowType === 'data') {
            const item = e.row.data;
            this._ensureItemSelected(item);
            fileItems = this.getSelectedItems();
        }

        e.items = this._contextMenu.createContextMenuItems(fileItems);
    }

    _createThumbnailColumnCell(container, cellInfo) {
        this._getItemThumbnailContainer(cellInfo.data).appendTo(container);
    }

    _createNameColumnCell(container, cellInfo) {
        const $button = $('<div>');

        const $name = $('<span>')
            .text(cellInfo.data.name)
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
        return rowData.isDirectory ? '' : getDisplayFileSize(rowData.size);
    }

    _ensureItemSelected(item) {
        if(!this._filesView.isRowSelected(item.relativeName)) {
            const selectionController = this._filesView.getController('selection');
            const preserve = selectionController.isSelectionWithCheckboxes();
            this._filesView.selectRows([item.relativeName], preserve);
        }
    }

    refreshData() {
        this._loadFilesViewData();
    }

    clearSelection() {
        this._filesView.clearSelection();
    }

    getSelectedItems() {
        return this._filesView.getSelectedRowsData();
    }

}

module.exports = FileManagerDetailsItemList;
