import { setWidth, getWidth } from '../../../core/utils/size';
import $ from '../../../core/renderer';
import { extend } from '../../../core/utils/extend';
import Sortable from '../../sortable';
import gridCoreUtils from './../ui.grid_core.utils';
import { deferUpdate } from '../../../core/utils/common';
import { GridCoreRowDraggingDom } from './dom';
import { CLASSES } from './const';

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
            cssClass: CLASSES.commandDrag,
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

        const rowSelector = '.dx-row:not(.dx-freespace-row):not(.dx-virtual-row):not(.dx-header-row):not(.dx-footer-row)';
        const filter = this.option('dataRowTemplate')
            ? `> table > tbody${rowSelector}`
            : `> table > tbody > ${rowSelector}`;

        if((allowReordering || this[currentSortableName]) && $content.length) {
            this[currentSortableName] = this._createComponent($content, Sortable, extend({
                component: this.component,
                contentTemplate: null,
                filter,
                cursorOffset: (options) => {
                    const event = options.event;
                    const rowsViewOffset = $(this.element()).offset();

                    return {
                        x: event.pageX - rowsViewOffset.left
                    };
                },
                onDraggableElementShown: (e) => {
                    if(rowDragging.dragTemplate) {
                        return;
                    }

                    const $dragElement = $(e.dragElement);
                    const gridInstance = $dragElement.children('.dx-widget').data(this.component.NAME);

                    this._synchronizeScrollLeftPosition(gridInstance);
                },
                dragTemplate: this._getDraggableRowTemplate(),
                handle: rowDragging.showDragIcons && `.${CLASSES.commandDrag}`,
                dropFeedbackMode: 'indicate'
            }, rowDragging, {
                onDragStart: (e) => {
                    this.getController('keyboardNavigation')?._resetFocusedCell();

                    const row = e.component.getVisibleRows()[e.fromIndex];
                    e.itemData = row && row.data;

                    const isDataRow = row && row.rowType === 'data';

                    e.cancel = !allowReordering || !isDataRow;

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
                onAdd: (e) => {
                    togglePointerEventsStyle(false);
                    rowDragging.onAdd?.(e);
                },
                dropFeedbackMode: rowDragging.dropFeedbackMode,
                onOptionChanged: (e) => {
                    const hasFixedSortable = this[sortableFixedName];
                    if(hasFixedSortable) {
                        if(e.name === 'fromIndex' || e.name === 'toIndex') {
                            this[anotherSortableName].option(e.name, e.value);
                        }
                    }
                }
            }));

            $content.toggleClass('dx-scrollable-container', isFixedTableRendering);
            $content.toggleClass(CLASSES.sortableWithoutHandle, allowReordering && !rowDragging.showDragIcons);
        }

        return $content;
    },

    _renderCore(e) {
        this.callBase.apply(this, arguments);

        if(e && e.changeType === 'update' &&
        e.repaintChangesOnly &&
        gridCoreUtils.isVirtualRowRendering(this)) {
            deferUpdate(() => {
                this._updateSortable();
            });
        }
    },

    _updateSortable() {
        const offset = this._dataController.getRowIndexOffset();
        [this._sortable, this._sortableFixed].forEach((sortable) => {
            sortable?.option('offset', offset);
            sortable?.update();
        });
    },

    _resizeCore: function() {
        this.callBase.apply(this, arguments);
        this._updateSortable();
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
                showScrollbar: 'never'
            },
            pager: {
                visible: false
            },
            loadingTimeout: null,
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

    _synchronizeScrollLeftPosition: function(gridInstance) {
        const scrollable = gridInstance?.getScrollable();

        scrollable?.scrollTo({ x: this._scrollLeft });
    },

    _getDraggableRowTemplate: function() {
        return (options) => {
            const $rootElement = this.component.$element();
            const $dataGridContainer = $('<div>');
            setWidth($dataGridContainer, getWidth($rootElement));
            const items = this._dataController.items();
            const row = items && items[options.fromIndex];
            const gridOptions = this._getDraggableGridOptions(row);

            this._createComponent($dataGridContainer, this.component.NAME, gridOptions);
            $dataGridContainer
                .find('.dx-gridbase-container')
                .children(`:not(.${this.addWidgetPrefix(CLASSES.rowsView)})`)
                .hide();

            return $dataGridContainer;
        };
    },

    _getHandleTemplate: function() {
        return GridCoreRowDraggingDom.createHandleTemplateFunc(
            (string) => this.addWidgetPrefix(string),
        );
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


export const rowDraggingModule = {
    defaultOptions: function() {
        return {
            rowDragging: {
                showDragIcons: true,
                dropFeedbackMode: 'indicate',
                allowReordering: false,
                allowDropInsideItem: false
            }
        };
    },
    extenders: {
        views: {
            rowsView: RowDraggingExtender
        }
    }
};
