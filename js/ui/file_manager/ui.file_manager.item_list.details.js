import $ from "../../core/renderer";
import { getImageContainer } from "../../core/utils/icon";

import DataGrid from "../data_grid/ui.data_grid";
import CustomStore from "../../data/custom_store";

import FileManagerItemListBase from "./ui.file_manager.item_list";
import FileManagerFileActionsButton from "./ui.file_manager.file_actions_button";

const FILE_MANAGER_DETAILS_ITEM_LIST_CLASS = "dx-filemanager-details";
const FILE_MANAGER_DETAILS_ITEM_THUMBNAIL_CLASS = "dx-filemanager-details-item-thumbnail";
const DATA_GRID_DATA_ROW_CLASS = "dx-data-row";
const COMMAND_BUTTON_CLASS = "dx-command-select";

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
            key: "relativeName",
            load: this._getItems.bind(this)
        });
    }

    _loadFilesViewData() {
        this._filesView.option("dataSource", {
            "store": this._createFilesViewStore()
        });
    }

    _onFileItemActionButtonClick({ component, element }) {
        const $row = component.$element().closest(this._getItemSelector());
        const item = $row.data("item");
        this._ensureItemSelected(item);
        this._showContextMenu(this.getSelectedItems(), element);
        this._activeFileActionsButton = component;
        this._activeFileActionsButton.setActive(true);
    }

    _onContextMenuHidden() {
        this._activeFileActionsButton.setActive(false);
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
        let fileItems = null;

        if(e.row && e.row.rowType === "data") {
            const item = e.row.data;
            this._ensureItemSelected(item);
            fileItems = this.getSelectedItems();
        }

        e.items = this._contextMenu.createContextMenuItems(fileItems);
    }

    _createThumbnailColumnCell(container, cellInfo) {
        const thumbnail = this._getItemThumbnail(cellInfo.data);
        getImageContainer(thumbnail)
            .addClass(FILE_MANAGER_DETAILS_ITEM_THUMBNAIL_CLASS)
            .appendTo(container);
    }

    _createNameColumnCell(container, cellInfo) {
        const $button = $("<div>");
        $(container).append(cellInfo.data.name, $button);

        this._createComponent($button, FileManagerFileActionsButton, {
            cssClass: COMMAND_BUTTON_CLASS,
            onClick: e => this._onFileItemActionButtonClick(e)
        });
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

    clearSelection() {
        this._filesView.clearSelection();
    }

    getSelectedItems() {
        return this._filesView.getSelectedRowsData();
    }

}

module.exports = FileManagerDetailsItemList;
