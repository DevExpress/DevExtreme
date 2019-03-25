import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";

import Button from "../button";
import DataGrid from "../data_grid/ui.data_grid";
import CustomStore from "../../data/custom_store";

import FileManagerItemListBase from "./ui.file_manager.item_list";
import { FileManagerFileCommands } from "./ui.file_manager.commands";

const FILE_MANAGER_FILE_ACTIONS_BUTTON = "dx-filemanager-file-actions-button";

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
            columns: [
                {
                    dataField: "name",
                    minWidth: 200,
                    width: "60%",
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
                    width: "20%"
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
        this.$element().append(this._filesView.$element());

        this._loadFilesViewData();
    }

    _createContextMenuItems(rowData) {
        var that = this;
        var isSingleRowSelected = this._filesView.getSelectedRowKeys().length <= 1;
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

    refreshData() {
        this._loadFilesViewData();
    }

    getSelectedItems() {
        return this._filesView.getSelectedRowsData();
    }

}

module.exports = FileManagerDetailsItemList;
