import $ from "../../core/renderer";
import iconUtils from "../../core/utils/icon";
import eventsEngine from "../../events/core/events_engine";

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

        const that = this;
        this._filesView = this._createComponent("<div>", DataGrid, {
            hoverStateEnabled: true,
            selection: {
                mode: selectionMode
            },
            allowColumnResizing: true,
            scrolling: {
                mode: "virtual"
            },
            onRowPrepared: this._onRowPrepared.bind(this),
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
                    cellTemplate(container, options) {
                        const button = that._createComponent($("<div>"), Button, {
                            text: "&vellip;",
                            onClick(e) {
                                that._onShowFileItemActionButtonClick(e);

                                const filesViewRow = e.component.$element().data("filesViewRow");
                                if(that._filesView.getSelectedRowsData().indexOf(filesViewRow.data) < 0) {
                                    eventsEngine.trigger($(e.element).parent("td"), "dxclick");
                                }
                            },
                            template(e) {
                                return $("<i>").html("&vellip;");
                            }
                        });
                        button.$element()
                            .data("filesViewRow", options.row)
                            .addClass(`${FILE_MANAGER_FILE_ACTIONS_BUTTON} dx-command-select`);

                        $(container).append(options.data.name, button.$element());
                    }
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
            onContextMenuPreparing(e) {
                if(e.row.rowType !== 'data') {
                    return;
                }

                e.items = that._createContextMenuItems(e.row.data);
                if(that._filesView.getSelectedRowsData().indexOf(e.row.data) < 0) {
                    eventsEngine.trigger(e.targetElement, "dxclick");
                }
            }
        });
        this.$element()
            .addClass(FILE_MANAGER_DETAILS_ITEM_LIST_CLASS)
            .append(this._filesView.$element());

        this._loadFilesViewData();
    }

    _createContextMenuItems(rowData) {
        const that = this;
        const isSingleRowSelected = this._filesView.getSelectedRowKeys().length <= 1;
        return FileManagerFileCommands
            .filter(c => {
                if(c.displayInToolbarOnly) {
                    return false;
                }
                return !c.isSingleFileItemCommand || c.isSingleFileItemCommand === isSingleRowSelected;
            })
            .map(c => ({
                name: c.name,
                text: c.text,
                fileItem: rowData,
                onItemClick: that._raiseOnContextMenuItemClick.bind(that)
            }));
    }

    _correctFileViewSelectionStateAfterRaiseContextMenu(newSelectedRow) {
        if(this._filesView.getSelectedRowsData().indexOf(newSelectedRow.data) < 0) {
            this._filesView.selectRowsByIndexes(newSelectedRow.rowIndex);
        }
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

        const filesViewRow = e.component.$element().data("filesViewRow");
        this._contextMenu.option("dataSource", this._createContextMenuItems(filesViewRow.data));
        this._displayContextMenu(e.element, e.event.offsetX, e.event.offsetY);
    }

    _getItemSelector() {
        return `.${DATA_GRID_DATA_ROW_CLASS}`;
    }

    _onItemDblClick(e) {
        const $row = $(e.currentTarget);
        const key = $row.data("item-key");
        this._filesView.byKey(key)
            .done(item => this._raiseSelectedItemOpened(item));
    }

    _onRowPrepared(e) {
        if(e.rowType === "data") {
            $(e.rowElement).data("item-key", e.data.relativeName);
        }
    }

    _createThumbnailColumnCell(container, cellInfo) {
        const thumbnail = this._getItemThumbnail(cellInfo.data);
        iconUtils.getImageContainer(thumbnail)
            .addClass(FILE_MANAGER_DETAILS_ITEM_THUMBNAIL_CLASS)
            .appendTo(container);
    }

    refreshData() {
        this._loadFilesViewData();
    }

    getSelectedItems() {
        return this._filesView.getSelectedRowsData();
    }

}

module.exports = FileManagerDetailsItemList;
