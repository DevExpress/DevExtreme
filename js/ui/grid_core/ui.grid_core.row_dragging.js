import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import Sortable from "../sortable";

let COMMAND_HANDLE_CLASS = "dx-command-drag",
    CELL_FOCUS_DISABLED_CLASS = "dx-cell-focus-disabled",
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

    _renderContent: function() {
        let that = this,
            rowDragging = that.option("rowDragging"),
            $content = that.callBase.apply(that, arguments);

        if(rowDragging && rowDragging.enabled) {
            that._sortable = that._createComponent($content, Sortable, extend({
                filter: "> table > tbody > .dx-data-row",
                template: that._getDraggableRowTemplate(),
                handle: rowDragging.showDragIcons && `.${COMMAND_HANDLE_CLASS}`,
                dropFeedbackMode: "indicate"
            }, rowDragging));
        }

        return $content;
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
            $(container).addClass(CELL_FOCUS_DISABLED_CLASS);
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
                * @name GridBaseOptions.rowDragging.showDragIcons
                * @type boolean
                * @default true
                */
                showDragIcons: true,
                /**
                 * @name GridBaseOptions.rowDragging.dropFeedbackMode
                 * @type Enums.DropFeedbackMode
                 * @default "indicate"
                 */
                dropFeedbackMode: "indicate"
                /**
                 * @name GridBaseOptions.rowDragging.filter
                 * @type string
                 * @default "> *"
                 */
                /**
                 * @name GridBaseOptions.rowDragging.itemOrientation
                 * @type Enums.Orientation
                 * @default "vertical"
                 */
                /**
                 * @name dxDataGridOptions.rowDragging.allowDropInsideItem
                 * @type boolean
                 * @default false
                 */
                /**
                 * @name GridBaseOptions.rowDragging.allowReordering
                 * @type boolean
                 * @default true
                 */
                /**
                 * @name GridBaseOptions.rowDragging.dragDirection
                 * @type Enums.DragDirection
                 * @default "both"
                 */
                /**
                 * @name GridBaseOptions.rowDragging.boundary
                 * @type string|Node|jQuery
                 * @default window
                 */
                /**
                 * @name GridBaseOptions.rowDragging.container
                 * @type string|Node|jQuery
                 * @default undefined
                 */
                /**
                 * @name GridBaseOptions.rowDragging.template
                 * @type template|function
                 * @type_function_return string|Node|jQuery
                 * @default undefined
                 */
                /**
                 * @name GridBaseOptions.rowDragging.handle
                 * @type string
                 * @default ""
                 */
                /**
                 * @name GridBaseOptions.rowDragging.autoScroll
                 * @type boolean
                 * @default true
                 */
                /**
                 * @name GridBaseOptions.rowDragging.scrollSpeed
                 * @type number
                 * @default 60
                 */
                /**
                 * @name GridBaseOptions.rowDragging.scrollSensitivity
                 * @type number
                 * @default 60
                 */
                /**
                 * @name GridBaseOptions.rowDragging.group
                 * @type any
                 * @default undefined
                 */
                /**
                 * @name GridBaseOptions.rowDragging.cursorOffset
                 * @type string|object
                 */
                /**
                 * @name GridBaseOptions.rowDragging.cursorOffset.x
                 * @type number
                 * @default 0
                 */
                /**
                 * @name GridBaseOptions.rowDragging.cursorOffset.y
                 * @type number
                 * @default 0
                 */
                /**
                 * @name GridBaseOptions.rowDragging.onDragStart
                 * @type function(e)
                 * @type_function_param1 e:object
                 * @type_function_param1_field1 event:event
                 * @type_function_param1_field2 cancel:boolean
                 * @type_function_param1_field3 itemData:any
                 * @type_function_param1_field4 itemElement:dxElement
                 * @type_function_param1_field5 fromIndex:number
                 */
                /**
                 * @name GridBaseOptions.rowDragging.onDragMove
                 * @type function(e)
                 * @type_function_param1 e:object
                 * @type_function_param1_field1 event:event
                 * @type_function_param1_field2 cancel:boolean
                 * @type_function_param1_field3 itemData:any
                 * @type_function_param1_field4 itemElement:dxElement
                 * @type_function_param1_field5 fromIndex:number
                 * @type_function_param1_field6 toIndex:number
                 * @type_function_param1_field7 fromComponent:dxSortable|dxDraggable
                 * @type_function_param1_field8 toComponent:dxSortable|dxDraggable
                 * @type_function_param1_field9 dropInsideItem:boolean
                 */
                /**
                 * @name GridBaseOptions.rowDragging.onDragEnd
                 * @type function(e)
                 * @type_function_param1 e:object
                 * @type_function_param1_field1 event:event
                 * @type_function_param1_field2 cancel:boolean
                 * @type_function_param1_field3 itemData:any
                 * @type_function_param1_field4 itemElement:dxElement
                 * @type_function_param1_field5 fromIndex:number
                 * @type_function_param1_field6 toIndex:number
                 * @type_function_param1_field7 fromComponent:dxSortable|dxDraggable
                 * @type_function_param1_field8 toComponent:dxSortable|dxDraggable
                 * @type_function_param1_field9 dropInsideItem:boolean
                 */
                /**
                 * @name GridBaseOptions.rowDragging.onDragChange
                 * @type function(e)
                 * @type_function_param1 e:object
                 * @type_function_param1_field1 event:event
                 * @type_function_param1_field2 cancel:boolean
                 * @type_function_param1_field3 itemData:any
                 * @type_function_param1_field4 itemElement:dxElement
                 * @type_function_param1_field5 fromIndex:number
                 * @type_function_param1_field6 toIndex:number
                 * @type_function_param1_field7 fromComponent:dxSortable|dxDraggable
                 * @type_function_param1_field8 toComponent:dxSortable|dxDraggable
                 * @type_function_param1_field9 dropInsideItem:boolean
                 */
                /**
                 * @name GridBaseOptions.rowDragging.onAdd
                 * @type function(e)
                 * @type_function_param1 e:object
                 * @type_function_param1_field1 event:event
                 * @type_function_param1_field2 itemData:any
                 * @type_function_param1_field3 itemElement:dxElement
                 * @type_function_param1_field4 fromIndex:number
                 * @type_function_param1_field5 toIndex:number
                 * @type_function_param1_field6 fromComponent:dxSortable|dxDraggable
                 * @type_function_param1_field7 toComponent:dxSortable|dxDraggable
                 * @type_function_param1_field8 dropInsideItem:boolean
                 */
                /**
                 * @name GridBaseOptions.rowDragging.onRemove
                 * @type function(e)
                 * @type_function_param1 e:object
                 * @type_function_param1_field1 event:event
                 * @type_function_param1_field2 itemData:any
                 * @type_function_param1_field3 itemElement:dxElement
                 * @type_function_param1_field4 fromIndex:number
                 * @type_function_param1_field5 toIndex:number
                 * @type_function_param1_field6 fromComponent:dxSortable|dxDraggable
                 * @type_function_param1_field7 toComponent:dxSortable|dxDraggable
                 */
                /**
                 * @name GridBaseOptions.rowDragging.onReorder
                 * @type function(e)
                 * @type_function_param1 e:object
                 * @type_function_param1_field1 event:event
                 * @type_function_param1_field2 itemData:any
                 * @type_function_param1_field3 itemElement:dxElement
                 * @type_function_param1_field4 fromIndex:number
                 * @type_function_param1_field5 toIndex:number
                 * @type_function_param1_field6 fromComponent:dxSortable|dxDraggable
                 * @type_function_param1_field7 toComponent:dxSortable|dxDraggable
                 * @type_function_param1_field8 dropInsideItem:boolean
                 */
            }
        };
    },
    extenders: {
        views: {
            rowsView: RowDraggingExtender
        }
    }
};
