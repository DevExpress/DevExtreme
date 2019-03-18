import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";

import Button from "../button";
import DataGrid from "../data_grid/ui.data_grid";
import CustomStore from "../../data/custom_store";

import FileManagerItemListBase from "./ui.file_manager.item_list";

const FILE_MANAGER_FILE_ACTIONS_BUTTON = "dx-filemanager-file-actions-button";

var FileManagerDetailsItemList = FileManagerItemListBase.inherit({

    _initMarkup: function() {
        this._createFilesView();
        this.callBase();
    },

    _createFilesView: function() {
        var selectionMode = this.option("selectionMode");

        var that = this;
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
                    cellTemplate: function(container, options) {
                        var button = that._createComponent($("<div>"), Button, {
                            text: "&vellip;",
                            template: function(e) {
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
    },

    _createFilesViewStore: function() {
        return new CustomStore({
            load: this._getItems.bind(this)
        });
    },

    _loadFilesViewData: function() {
        this._filesView.option("dataSource", {
            "store": this._createFilesViewStore()
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            test: null
        });
    },

    refreshData: function() {
        this._loadFilesViewData();
    },

    getSelectedItems: function() {
        return this._filesView.getSelectedRowsData();
    }

});

module.exports = FileManagerDetailsItemList;
