import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import Sortable from '../sortable';
import { setEmptyText } from './ui.grid_core.utils';

let COMMAND_HANDLE_CLASS = 'dx-command-drag',
    CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled',
    HANDLE_ICON_CLASS = 'drag-icon',
    ROWS_VIEW = 'rowsview',
    SORTABLE_WITHOUT_HANDLE_CLASS = 'dx-sortable-without-handle';

var RowDraggingExtender = {
    init: function() {
        this.callBase.apply(this, arguments);
        this._updateHandleColumn();
    },

    _allowReordering: function() {
        let rowDragging = this.option('rowDragging');

        return !!(rowDragging && (rowDragging.allowReordering || rowDragging.allowDropInsideItem || rowDragging.group));
    },

    _updateHandleColumn: function() {
        let rowDragging = this.option('rowDragging'),
            allowReordering = this._allowReordering(),
            columnsController = this._columnsController,
            isHandleColumnVisible = allowReordering && rowDragging.showDragIcons;

        columnsController && columnsController.addCommandColumn({
            type: 'drag',
            command: 'drag',
            visibleIndex: -2,
            alignment: 'center',
            cssClass: COMMAND_HANDLE_CLASS,
            width: 'auto',
            cellTemplate: this._getHandleTemplate(),
            visible: isHandleColumnVisible
        });

        columnsController.columnOption('type:drag', 'visible', isHandleColumnVisible);
    },

    _renderContent: function() {
        let that = this,
            rowDragging = this.option('rowDragging'),
            allowReordering = this._allowReordering(),
            $content = that.callBase.apply(that, arguments);

        if(allowReordering && $content.length) {
            that._sortable = that._createComponent($content, Sortable, extend({
                component: that.component,
                contentTemplate: null,
                filter: '> table > tbody > .dx-row:not(.dx-freespace-row):not(.dx-virtual-row)',
                dragTemplate: that._getDraggableRowTemplate(),
                handle: rowDragging.showDragIcons && `.${COMMAND_HANDLE_CLASS}`,
                dropFeedbackMode: 'indicate'
            }, rowDragging, {
                onDragStart: function(e) {
                    const row = e.component.getVisibleRows()[e.fromIndex];
                    e.itemData = row && row.data;

                    const isDataRow = row && row.rowType === 'data';
                    e.cancel = !isDataRow;

                    const onDragStart = rowDragging.onDragStart;
                    onDragStart && onDragStart(e);
                }
            }));

            $content.toggleClass(SORTABLE_WITHOUT_HANDLE_CLASS, !rowDragging.showDragIcons);
        }

        return $content;
    },

    _getDraggableGridOptions: function(options) {
        let gridOptions = this.option(),
            columns = this.getColumns(),
            $rowElement = $(this.getRowElement(options.rowIndex));

        return {
            dataSource: [{ id: 1, parentId: 0 }],
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
            columnFixing: gridOptions.columnFixing,
            columnAutoWidth: gridOptions.columnAutoWidth,
            showColumnLines: gridOptions.showColumnLines,
            columns: columns.map((column) => {
                return {
                    width: column.width || column.visibleWidth,
                    fixed: column.fixed,
                    fixedPosition: column.fixedPosition
                };
            }),
            onRowPrepared: (e) => {
                const rowsView = e.component.getView('rowsView');
                $(e.rowElement).replaceWith($rowElement.eq(rowsView._isFixedTableRendering ? 1 : 0).clone());
            }
        };
    },

    _getDraggableRowTemplate: function() {
        return (options) => {
            let $rootElement = this.component.$element(),
                $dataGridContainer = $('<div>').width($rootElement.width()),
                items = this._dataController.items(),
                row = items && items[options.fromIndex],
                gridOptions = this._getDraggableGridOptions(row);

            this._createComponent($dataGridContainer, this.component.NAME, gridOptions);
            $dataGridContainer.find('.dx-gridbase-container').children(`:not(.${this.addWidgetPrefix(ROWS_VIEW)})`).hide();

            return $dataGridContainer;
        };
    },

    _getHandleTemplate: function() {
        return (container, options) => {
            if(options.rowType === 'data') {
                $(container).addClass(CELL_FOCUS_DISABLED_CLASS);
                return $('<span>').addClass(this.addWidgetPrefix(HANDLE_ICON_CLASS));
            } else {
                setEmptyText($(container));
            }
        };
    },

    optionChanged: function(args) {
        if(args.name === 'rowDragging') {
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
            rowDragging: {
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
                dropFeedbackMode: 'indicate',
                /**
                 * @name GridBaseOptions.rowDragging.allowReordering
                 * @type boolean
                 * @default false
                 */
                allowReordering: false,
                /**
                 * @name GridBaseOptions.rowDragging.allowDropInsideItem
                 * @type boolean
                 * @default false
                 */
                allowDropInsideItem: false
                /**
                 * @name GridBaseOptions.rowDragging.filter
                 * @type string
                 * @default "> *"
                 */
                /**
                 * @name GridBaseOptions.rowDragging.dragDirection
                 * @type Enums.DragDirection
                 * @default "both"
                 */
                /**
                 * @name GridBaseOptions.rowDragging.boundary
                 * @type string|Node|jQuery
                 * @default undefined
                 */
                /**
                 * @name GridBaseOptions.rowDragging.container
                 * @type string|Node|jQuery
                 * @default undefined
                 */
                /**
                 * @name GridBaseOptions.rowDragging.dragTemplate
                 * @type template|function
                 * @type_function_param1 dragInfo:object
                 * @type_function_param1_field1 itemData:any
                 * @type_function_param1_field2 itemElement:dxElement
                 * @type_function_param2 containerElement:dxElement
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
                 * @default 30
                 */
                /**
                 * @name GridBaseOptions.rowDragging.scrollSensitivity
                 * @type number
                 * @default 60
                 */
                /**
                 * @name GridBaseOptions.rowDragging.group
                 * @type string
                 * @default undefined
                 */
                /**
                 * @name GridBaseOptions.rowDragging.data
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
                 * @type_function_param1_field6 fromData:any
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
                 * @type_function_param1_field9 fromData:any
                 * @type_function_param1_field10 toData:any
                 * @type_function_param1_field11 dropInsideItem:boolean
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
                 * @type_function_param1_field9 fromData:any
                 * @type_function_param1_field10 toData:any
                 * @type_function_param1_field11 dropInsideItem:boolean
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
                 * @type_function_param1_field9 fromData:any
                 * @type_function_param1_field10 toData:any
                 * @type_function_param1_field11 dropInsideItem:boolean
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
                 * @type_function_param1_field8 fromData:any
                 * @type_function_param1_field9 toData:any
                 * @type_function_param1_field10 dropInsideItem:boolean
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
                 * @type_function_param1_field8 fromData:any
                 * @type_function_param1_field9 toData:any
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
                 * @type_function_param1_field8 fromData:any
                 * @type_function_param1_field9 toData:any
                 * @type_function_param1_field10 dropInsideItem:boolean
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
