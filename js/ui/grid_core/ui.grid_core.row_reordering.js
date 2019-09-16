import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import Sortable from "../sortable";

let COMMAND_HANDLE_CLASS = "dx-command-handle",
    HANDLE_ICON_CLASS = "handle-icon";

var RowReorderingExtender = {
    init: function() {
        this.callBase.apply(this, arguments);
        this._updateHandleColumn();
    },

    _updateHandleColumn: function() {
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
            cellTemplate: this._getHandleTemplate(),
            visible: isHandleColumnVisible
        });

        columnsController.columnOption("type:handle", "visible", isHandleColumnVisible);
    },

    _renderTable: function() {
        let that = this,
            rowDragging = that.option("rowDragging"),
            $tableElement = that.callBase.apply(that, arguments);

        if(rowDragging && rowDragging.enabled) {
            that._sortable = that._createComponent($tableElement, Sortable, extend({
                filter: "> tbody > .dx-data-row",
                template: that._getDraggableRowTemplate(),
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
            rowDragging: {
                enabled: true,
                showHandle: gridOptions.rowDragging.showHandle
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
            return $("<span>").addClass(this.addWidgetPrefix(HANDLE_ICON_CLASS));
        };
    },

    optionChanged: function(args) {
        if(args.name === "rowDragging") {
            this._updateHandleColumn();
            this._invalidate(true, true);
            args.handled = true;
        }

        this.callBase.apply(this, arguments);
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
