import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import Sortable from "../sortable";

let COMMAND_HANDLE_CLASS = "dx-command-handle",
    HANDLE_ICON_CLASS = "handle-icon";

var RowReorderingExtender = {
    init: function() {
        this.callBase.apply(this, arguments);

        let rowDragging = this.option("rowDragging"),
            columnsController = this._columnsController,
            isHandleColumnVisible = rowDragging.enabled && rowDragging.showHandle;

        columnsController && columnsController.addCommandColumn({
            type: "handle",
            command: "handle",
            visibleIndex: -2,
            alignment: "center",
            cssClass: COMMAND_HANDLE_CLASS,
            width: "auto",
            cellTemplate: this._getHandleTemplate()
        });

        columnsController.columnOption("type:handle", "visible", isHandleColumnVisible);
    },

    _renderTable: function() {
        let rowDragging = this.option("rowDragging"),
            $tableElement = this.callBase.apply(this, arguments);

        if(rowDragging && rowDragging.enabled) {
            this._sortable = this._createComponent($tableElement, Sortable, extend({
                filter: "> tbody > .dx-data-row",
                template: this._getDraggableRowTemplate(),
                handle: rowDragging.showHandle && `.${COMMAND_HANDLE_CLASS}`
            }, rowDragging));
        }

        return $tableElement;
    },

    _getDraggableGridOptions: function(options) {
        let gridOptions = this.option();

        return {
            dataSource: [options.data],
            showBorders: true,
            showColumnHeaders: false,
            scrolling: {
                useNative: false,
                showScrollbar: false
            },
            pager: {
                visible: false
            },
            loadingTimeout: undefined,
            columns: gridOptions.columns,
            customizeColumns: function(columns) {
                gridOptions.customizeColumns && gridOptions.customizeColumns.apply(this, arguments);

                columns.forEach((column) => {
                    column.groupIndex = undefined;
                });
            },
            showColumnLines: gridOptions.showColumnLines,
            rowTemplate: gridOptions.rowTemplate,
            onCellPrepared: gridOptions.onCellPrepared,
            onRowPrepared: gridOptions.onRowPrepared
        };
    },

    _getDraggableRowTemplate: function() {
        return (options, index) => {
            let $rootElement = this.component.$element(),
                $dataGridContainer = $("<div>").width($rootElement.width()),
                items = this._dataController.items(),
                row = items && items[index],
                gridOptions = this._getDraggableGridOptions(row);

            this._createComponent($dataGridContainer, "dxDataGrid", gridOptions);

            return $dataGridContainer;
        };
    },

    _getHandleTemplate: function() {
        return (container, options) => {
            return $("<div>").addClass(this.addWidgetPrefix(HANDLE_ICON_CLASS));
        };
    }
};


module.exports = {
    defaultOptions: function() {
        return {
            /**
             * @name GridBaseOptions.rowDragging
             * @type object
             */
            rowDragging: {
                /**
                * @name GridBaseOptions.rowDragging.enabled
                * @type boolean
                * @default false
                */
                enabled: false,
                /**
                * @name GridBaseOptions.rowDragging.allowReordering
                * @type boolean
                * @default false
                */
                allowReordering: false,
                /**
                * @name GridBaseOptions.rowDragging.showHandle
                * @type boolean
                * @default true
                */
                showHandle: true
            }
        };
    },
    extenders: {
        views: {
            rowsView: RowReorderingExtender
        }
    }
};
