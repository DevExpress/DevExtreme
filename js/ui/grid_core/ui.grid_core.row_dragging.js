import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import Sortable from "../sortable";

let COMMAND_HANDLE_CLASS = "dx-command-drag",
    HANDLE_ICON_CLASS = "drag-icon";

var RowDraggingExtender = {
    init: function() {
        this.callBase.apply(this, arguments);
        this._updateHandleColumn();
    },

    _updateHandleColumn: function() {
        let rowDragging = this.option("rowDragging"),
            columnsController = this._columnsController,
            isHandleColumnVisible = rowDragging.enabled && rowDragging.showDragIcons;

        columnsController && columnsController.addCommandColumn({
            type: "drag",
            command: "drag",
            visibleIndex: -2,
            alignment: "center",
            cssClass: COMMAND_HANDLE_CLASS,
            width: "auto",
            cellTemplate: this._getHandleTemplate(),
            visible: isHandleColumnVisible
        });

        columnsController.columnOption("type:drag", "visible", isHandleColumnVisible);
    },

    _renderTable: function() {
        let that = this,
            rowDragging = that.option("rowDragging"),
            origOnDragEndEvent = rowDragging.onDragEnd,
            $tableElement = that.callBase.apply(that, arguments);

        if(rowDragging && rowDragging.enabled) {
            that._sortable = that._createComponent($tableElement, Sortable, extend({
                filter: "> tbody > .dx-data-row",
                template: that._getDraggableRowTemplate(),
                handle: rowDragging.showDragIcons && `.${COMMAND_HANDLE_CLASS}`,
                dropFeedbackMode: "indicate"
            }, rowDragging, {
                onDragEnd: function(e) {
                    e.cancel = true;
                    origOnDragEndEvent && origOnDragEndEvent.apply(this, arguments);
                }
            }));
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
                showDragIcons: gridOptions.rowDragging.showDragIcons
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
             * @type GridBaseRowDragging
             */
            /**
             * @name GridBaseRowDragging
             * @type dxSortableOptions
             */
            rowDragging: {
                /**
                * @name GridBaseRowDragging.enabled
                * @type boolean
                * @default false
                */
                enabled: false,
                /**
                * @name GridBaseRowDragging.showDragIcons
                * @type boolean
                * @default true
                */
                showDragIcons: true
            }
        };
    },
    extenders: {
        views: {
            rowsView: RowDraggingExtender
        }
    }
};
