import $ from "../../core/renderer";
import { getImageContainer } from "../../core/utils/icon";

import Button from "../button";
import DataGrid from "../data_grid/ui.data_grid";
import CustomStore from "../../data/custom_store";

import FileManagerItemListBase from "./ui.file_manager.item_list";
import { FileManagerFileCommands } from "./ui.file_manager.commands";

const FILE_MANAGER_DETAILS_ITEM_LIST_CLASS = "dx-filemanager-details";
const FILE_MANAGER_DETAILS_ITEM_THUMBNAIL_CLASS = "dx-filemanager-details-item-thumbnail";
const FILE_MANAGER_FILE_ACTIONS_BUTTON = "dx-filemanager-file-actions-button";
const DATA_GRID_DATA_ROW_CLASS = "dx-data-row";

class FileManagerDetailsItemList extends FileManagerItemListBase {

    _initMarkup() {
        this._createFilesView();
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
            columns: [
                {
                    dataField: "thumbnail",
                    caption: "",
                    width: 64,
                    alignment: "center",
                    cellTemplate: this._createThumbnailColumnCell.bind(this)
                },
                {
                    dataField: "name",
                    minWidth: 200,
                    width: "65%",
                    cellTemplate: this._createNameColumnCell.bind(this)
                },
                {
                    dataField: "lastWriteTime",
                    minWidth: 200,
                    width: "25%"
                },
                {
                    dataField: "length",
                    minWidth: 100,
                    width: "10%"
                }
            ],
            onRowPrepared: this._onRowPrepared.bind(this),
            onContextMenuPreparing: this._onContextMenuPreparing.bind(this)
        });

        this.$element()
            .addClass(FILE_MANAGER_DETAILS_ITEM_LIST_CLASS)
            .append(this._filesView.$element());

        this._loadFilesViewData();
    }

    _createContextMenuItems(fileItem) {
        const isSingleRowSelected = this._filesView.getSelectedRowKeys().length <= 1;
        return FileManagerFileCommands
            .filter(c => {
                if(c.displayInToolbarOnly) {
                    return false;
                }
                return !c.isSingleFileItemCommand || c.isSingleFileItemCommand === isSingleRowSelected;
            })
            .map(({ text, name }) => ({
                name,
                text,
                fileItem,
                onItemClick: this._raiseOnContextMenuItemClick.bind(this)
            }));
    }

    _createFilesViewStore() {
        return new CustomStore({
            key: "relativeName",
            load: this._getItems.bind(this)
        });
    }

    _loadFilesViewData() {
        this._filesView.option("dataSource", {
            "store": this._createFilesViewStore()
        });
    }

    _onShowFileItemActionButtonClick(e) {
        this._ensureContextMenu();

        const $row = e.component.$element().closest(this._getItemSelector());
        const item = $row.data("item");
        this._contextMenu.option("dataSource", this._createContextMenuItems(item));
        this._displayContextMenu(e.element, e.event.offsetX, e.event.offsetY);

        this._ensureItemSelected(item);
    }

    _getItemSelector() {
        return `.${DATA_GRID_DATA_ROW_CLASS}`;
    }

    _onItemDblClick(e) {
        const $row = $(e.currentTarget);
        const item = $row.data("item");
        this._raiseSelectedItemOpened(item);
    }

    _onRowPrepared(e) {
        if(e.rowType === "data") {
            $(e.rowElement).data("item", e.data);
        }
    }

    _onContextMenuPreparing(e) {
        if(e.row.rowType !== 'data') {
            return;
        }

        const item = e.row.data;
        e.items = this._createContextMenuItems(item);
        this._ensureItemSelected(item);
    }

    _createThumbnailColumnCell(container, cellInfo) {
        const thumbnail = this._getItemThumbnail(cellInfo.data);
        getImageContainer(thumbnail)
            .addClass(FILE_MANAGER_DETAILS_ITEM_THUMBNAIL_CLASS)
            .appendTo(container);
    }

    _createNameColumnCell(container, cellInfo) {
        const button = this._createComponent($("<div>"), Button, {
            text: "&vellip;",
            onClick: this._onShowFileItemActionButtonClick.bind(this),
            template(e) {
                return $("<i>").html("&vellip;");
            }
        });
        button.$element().addClass(`${FILE_MANAGER_FILE_ACTIONS_BUTTON} dx-command-select`);

        $(container).append(cellInfo.data.name, button.$element());
    }

    _ensureItemSelected(item) {
        if(!this._filesView.isRowSelected(item.relativeName)) {
            const selectionController = this._filesView.getController("selection");
            const preserve = selectionController.isSelectionWithCheckboxes();
            this._filesView.selectRows([item.relativeName], preserve);
        }
    }

    refreshData() {
        this._loadFilesViewData();
    }

    getSelectedItems() {
        return this._filesView.getSelectedRowsData();
    }

}

module.exports = FileManagerDetailsItemList;
