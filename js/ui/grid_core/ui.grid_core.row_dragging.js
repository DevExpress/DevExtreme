import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import Sortable from '../sortable';
import gridCoreUtils from './ui.grid_core.utils';
import browser from '../../core/utils/browser';

const COMMAND_HANDLE_CLASS = 'dx-command-drag';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
const HANDLE_ICON_CLASS = 'drag-icon';
const ROWS_VIEW = 'rowsview';
const SORTABLE_WITHOUT_HANDLE_CLASS = 'dx-sortable-without-handle';

const RowDraggingExtender = {
    init: function() {
        this.callBase.apply(this, arguments);
        this._updateHandleColumn();
    },

    _allowReordering: function() {
        const rowDragging = this.option('rowDragging');

        return !!(rowDragging && (rowDragging.allowReordering || rowDragging.allowDropInsideItem || rowDragging.group));
    },

    _updateHandleColumn: function() {
        const rowDragging = this.option('rowDragging');
        const allowReordering = this._allowReordering();
        const columnsController = this._columnsController;
        const isHandleColumnVisible = allowReordering && rowDragging.showDragIcons;

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
        const rowDragging = this.option('rowDragging');
        const allowReordering = this._allowReordering();
        const $content = this.callBase.apply(this, arguments);
        const isFixedTableRendering = this._isFixedTableRendering;
        const sortableName = '_sortable';
        const sortableFixedName = '_sortableFixed';
        const currentSortableName = isFixedTableRendering ? sortableFixedName : sortableName;
        const anotherSortableName = isFixedTableRendering ? sortableName : sortableFixedName;
        const togglePointerEventsStyle = (toggle) => {
            // T929503
            this[sortableFixedName]?.$element().css('pointerEvents', toggle ? 'auto' : '');
        };

        if(allowReordering && $content.length) {
            this[currentSortableName] = this._createComponent($content, Sortable, extend({
                component: this.component,
                contentTemplate: null,
                filter: '> table > tbody > .dx-row:not(.dx-freespace-row):not(.dx-virtual-row)',
                dragTemplate: this._getDraggableRowTemplate(),
                handle: rowDragging.showDragIcons && `.${COMMAND_HANDLE_CLASS}`,
                dropFeedbackMode: 'indicate'
            }, rowDragging, {
                onDragStart: (e) => {
                    const row = e.component.getVisibleRows()[e.fromIndex];
                    e.itemData = row && row.data;

                    const isDataRow = row && row.rowType === 'data';
                    e.cancel = !isDataRow;

                    rowDragging.onDragStart?.(e);
                },
                onDragEnter: () => {
                    togglePointerEventsStyle(true);
                },
                onDragLeave: () => {
                    togglePointerEventsStyle(false);
                },
                onDragEnd: (e) => {
                    togglePointerEventsStyle(false);
                    rowDragging.onDragEnd?.(e);
                },
                dropFeedbackMode: browser.msie ? 'indicate' : rowDragging.dropFeedbackMode,
                onOptionChanged: (e) => {
                    const hasFixedSortable = this[sortableFixedName];
                    if(hasFixedSortable) {
                        if(e.name === 'fromIndex' || e.name === 'toIndex') {
                            this[anotherSortableName].option(e.name, e.value);
                        }
                    }
                }
            }));

            $content.toggleClass(SORTABLE_WITHOUT_HANDLE_CLASS, !rowDragging.showDragIcons);
        }

        return $content;
    },

    _resizeCore: function() {
        this.callBase.apply(this, arguments);
        const offset = this._dataController.getRowIndexOffset();
        [this._sortable, this._sortableFixed].forEach((sortable) => {
            sortable?.option('offset', offset);
            sortable?.update();
        });
    },

    _getDraggableGridOptions: function(options) {
        const gridOptions = this.option();
        const columns = this.getColumns();
        const $rowElement = $(this.getRowElement(options.rowIndex));

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
            const $rootElement = this.component.$element();
            const $dataGridContainer = $('<div>').width($rootElement.width());
            const items = this._dataController.items();
            const row = items && items[options.fromIndex];
            const gridOptions = this._getDraggableGridOptions(row);

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
                gridCoreUtils.setEmptyText($(container));
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


export default {
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
                 * @type string|Element|jQuery
                 * @default undefined
                 */
                /**
                 * @name GridBaseOptions.rowDragging.container
                 * @type string|Element|jQuery
                 * @default undefined
                 */
                /**
                 * @name GridBaseOptions.rowDragging.dragTemplate
                 * @type template|function
                 * @type_function_param1 dragInfo:object
                 * @type_function_param1_field1 itemData:any
                 * @type_function_param1_field2 itemElement:dxElement
                 * @type_function_param2 containerElement:dxElement
                 * @type_function_return string|Element|jQuery
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
                 * @type_function_param1_field1 component:this
                 * @type_function_param1_field2 event:event
                 * @type_function_param1_field3 cancel:boolean
                 * @type_function_param1_field4 itemData:any
                 * @type_function_param1_field5 itemElement:dxElement
                 * @type_function_param1_field6 fromIndex:number
                 * @type_function_param1_field7 fromData:any
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
                 * @type_function_param1_field11 promise:Promise<void>
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
