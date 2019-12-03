import $ from "../../core/renderer";
import typeUtils from "../../core/utils/type";
import messageLocalization from "../../localization/message";

import DataGrid from "../data_grid/ui.data_grid";
import CustomStore from "../../data/custom_store";

import FileManagerItemListBase from "./ui.file_manager.item_list";
import FileManagerFileActionsButton from "./ui.file_manager.file_actions_button";
import { getDisplayFileSize } from "./ui.file_manager.utils.js";

const FILE_MANAGER_DETAILS_ITEM_LIST_CLASS = "dx-filemanager-details";
const FILE_MANAGER_DETAILS_ITEM_THUMBNAIL_CLASS = "dx-filemanager-details-item-thumbnail";
const FILE_MANAGER_DETAILS_ITEM_NAME_CLASS = "dx-filemanager-details-item-name";
const FILE_MANAGER_DETAILS_ITEM_NAME_WRAPPER_CLASS = "dx-filemanager-details-item-name-wrapper";
const FILE_MANAGER_DETAILS_ITEM_IS_DIRECTORY_CLASS = "dx-filemanager-details-item-is-directory";
const DATA_GRID_DATA_ROW_CLASS = "dx-data-row";
const PREDEFINED_COLUMN_NAMES = [ "name", "isDirectory", "size", "thumbnail", "dateModified", "isParentFolder" ];

class FileManagerDetailsItemList extends FileManagerItemListBase {

    _initMarkup() {
        this._createFilesView();

        this._contextMenu.option("onContextMenuHidden", () => this._onContextMenuHidden());

        super._initMarkup();
    }

    _createFilesView() {
        const selectionMode = this.option("selectionMode");

        this._filesView = this._createComponent("<div>", DataGrid, {
            hoverStateEnabled: true,
            selection: {
                mode: selectionMode
            },
            allowColumnResizing: true,
            scrolling: {
                mode: "virtual"
            },
            sorting: {
                mode: "single",
                showSortIndexes: false
            },
            showColumnLines: false,
            showRowLines: false,
            columnHidingEnabled: true,
            columns: this._createColumns(),
            onRowPrepared: this._onRowPrepared.bind(this),
            onContextMenuPreparing: this._onContextMenuPreparing.bind(this),
            onSelectionChanged: this._raiseSelectionChanged.bind(this),
            onOptionChanged: function(args) {
                if(args.fullName.indexOf("sortOrder") > -1) {
                    this.columnOption("isParentFolder", {
                        sortOrder: "asc",
                        sortIndex: 0
                    });
                }
            }
        });

        this.$element()
            .addClass(FILE_MANAGER_DETAILS_ITEM_LIST_CLASS)
            .append(this._filesView.$element());

        this.refresh();
    }

    _createColumns() {
        let columns = [
            {
                dataField: "isDirectory",
                caption: "",
                width: 36,
                alignment: "center",
                cellTemplate: this._createThumbnailColumnCell.bind(this),
                cssClass: FILE_MANAGER_DETAILS_ITEM_IS_DIRECTORY_CLASS
            },
            {
                dataField: "name",
                caption: messageLocalization.format("dxFileManager-listDetailsColumnCaptionName"),
                cellTemplate: this._createNameColumnCell.bind(this)
            },
            {
                dataField: "dateModified",
                caption: messageLocalization.format("dxFileManager-listDetailsColumnCaptionDateModified"),
                width: 110,
                hidingPriority: 1,
            },
            {
                dataField: "size",
                caption: messageLocalization.format("dxFileManager-listDetailsColumnCaptionFileSize"),
                width: 90,
                alignment: "right",
                hidingPriority: 0,
                calculateCellValue: this._calculateSizeColumnCellValue.bind(this)
            },
            {
                dataField: "isParentFolder",
                caption: "isParentFolder",
                visible: false,
                sortIndex: 0,
                sortOrder: "asc"
            }
        ];

        const customizeDetailColumns = this.option("customizeDetailColumns");
        if(typeUtils.isFunction(customizeDetailColumns)) {
            columns = customizeDetailColumns(columns);
        }

        for(let i = 0; i < columns.length; i++) {
            const dataItemSuffix = PREDEFINED_COLUMN_NAMES.indexOf(columns[i].dataField) < 0 ? "dataItem." : "";
            columns[i].dataField = "fileItem." + dataItemSuffix + columns[i].dataField;
        }
        return columns;
    }

    _onFileItemActionButtonClick({ component, element, event }) {
        event.stopPropagation();

        const $row = component.$element().closest(this._getItemSelector());
        const fileItemInfo = $row.data("item");
        this._ensureItemSelected(fileItemInfo);
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
        const fileItemInfo = $row.data("item");
        this._raiseSelectedItemOpened(fileItemInfo);
    }

    _onRowPrepared(e) {
        if(e.rowType === "data") {
            $(e.rowElement).data("item", e.data);
        }
    }

    _onContextMenuPreparing(e) {
        let fileItems = null;

        if(e.row && e.row.rowType === "data") {
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
        const $button = $("<div>");

        const $name = $("<span>")
            .text(cellInfo.data.fileItem.name)
            .addClass(FILE_MANAGER_DETAILS_ITEM_NAME_CLASS);

        const $wrapper = $("<div>")
            .append($name, $button)
            .addClass(FILE_MANAGER_DETAILS_ITEM_NAME_WRAPPER_CLASS);

        $(container).append($wrapper);

        this._createComponent($button, FileManagerFileActionsButton, {
            onClick: e => this._onFileItemActionButtonClick(e)
        });
    }

    _calculateSizeColumnCellValue(rowData) {
        return rowData.fileItem.isDirectory ? "" : getDisplayFileSize(rowData.fileItem.size);
    }

    _ensureItemSelected(fileItemInfo) {
        const fileItem = fileItemInfo.fileItem;
        if(!this._filesView.isRowSelected(fileItem.key)) {
            const selectionController = this._filesView.getController("selection");
            const preserve = selectionController.isSelectionWithCheckboxes();
            this._filesView.selectRows([fileItem.key], preserve);
        }
    }

    clearSelection() {
        this._filesView.clearSelection();
    }

    refresh() {
        this.clearSelection();
        this._filesView.option("dataSource", {
            "store": new CustomStore({
                key: "fileItem.key",
                load: this._getItems.bind(this)
            })
        });
    }

    getSelectedItems() {
        return this._filesView.getSelectedRowsData();
    }

}

module.exports = FileManagerDetailsItemList;
