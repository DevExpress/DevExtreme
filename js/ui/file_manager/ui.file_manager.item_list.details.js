import $ from "../../core/renderer";

import Button from "../button";
import DataGrid from "../data_grid/ui.data_grid";
import CustomStore from "../../data/custom_store";

import FileManagerItemListBase from "./ui.file_manager.item_list";

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
                            template(e) {
                                return $("<i>").html("&vellip;");
                            }
                        });
                        button.$element().addClass(FILE_MANAGER_FILE_ACTIONS_BUTTON);

                        container.append(options.data.name, button.$element());
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
            ]
        });
        this.$element().append(this._filesView.$element());

        this._loadFilesViewData();
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

    refreshData() {
        this._loadFilesViewData();
    }

    getSelectedItems() {
        return this._filesView.getSelectedRowsData();
    }

}

module.exports = FileManagerDetailsItemList;
