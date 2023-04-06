import { getOuterWidth } from '../../core/utils/size';
import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import { name as wheelEventName } from '../../events/core/wheel';
import messageLocalization from '../../localization/message';
import gridCoreUtils from '../grid_core/ui.grid_core.utils';
import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import browser from '../../core/utils/browser';
import { getBoundingRect } from '../../core/utils/position';
import { move } from '../../animation/translator';
import Scrollable from '../scroll_view/ui.scrollable';

const CONTENT_CLASS = 'content';
const CONTENT_FIXED_CLASS = 'content-fixed';
const MASTER_DETAIL_CELL_CLASS = 'dx-master-detail-cell';
const FIRST_CELL_CLASS = 'dx-first-cell';
const LAST_CELL_CLASS = 'dx-last-cell';
const HOVER_STATE_CLASS = 'dx-state-hover';
const FIXED_COL_CLASS = 'dx-col-fixed';
const FIXED_COLUMNS_CLASS = 'dx-fixed-columns';
const POINTER_EVENTS_NONE_CLASS = 'dx-pointer-events-none';
const COMMAND_TRANSPARENT = 'transparent';
const GROUP_ROW_CLASS = 'dx-group-row';
const DETAIL_ROW_CLASS = 'dx-master-detail-row';

const getTransparentColumnIndex = function(fixedColumns) {
    let transparentColumnIndex = -1;

    each(fixedColumns, function(index, column) {
        if(column.command === COMMAND_TRANSPARENT) {
            transparentColumnIndex = index;
            return false;
        }
    });

    return transparentColumnIndex;
};

const normalizeColumnWidths = function(fixedColumns, widths, fixedWidths) {
    let fixedColumnIndex = 0;

    if(fixedColumns && widths && fixedWidths) {
        for(let i = 0; i < fixedColumns.length; i++) {
            if(fixedColumns[i].command === COMMAND_TRANSPARENT) {
                fixedColumnIndex += fixedColumns[i].colspan;
            } else {
                if(widths[fixedColumnIndex] < fixedWidths[i]) {
                    widths[fixedColumnIndex] = fixedWidths[i];
                }
                fixedColumnIndex++;
            }
        }
    }

    return widths;
};

const baseFixedColumns = {
    init: function() {
        this.callBase();
        this._isFixedTableRendering = false;
        this._isFixedColumns = false;
    },

    _createCol: function(column) {
        return this.callBase(column).toggleClass(FIXED_COL_CLASS, !!(this._isFixedTableRendering && (column.fixed || column.command && column.command !== COMMAND_TRANSPARENT)));
    },

    _correctColumnIndicesForFixedColumns: function(fixedColumns, change) {
        const transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
        const transparentColspan = fixedColumns[transparentColumnIndex].colspan;
        const columnIndices = change && change.columnIndices;

        if(columnIndices) {
            change.columnIndices = columnIndices.map(function(columnIndices) {
                if(columnIndices) {
                    return columnIndices.map(function(columnIndex) {
                        if(columnIndex < transparentColumnIndex) {
                            return columnIndex;
                        } else if(columnIndex >= transparentColumnIndex + transparentColspan) {
                            return columnIndex - transparentColspan + 1;
                        }
                        return -1;
                    }).filter(function(columnIndex) {
                        return columnIndex >= 0;
                    });
                }
            });
        }
    },

    _partialUpdateFixedTable(fixedColumns) {
        const fixedTableElement = this._fixedTableElement;
        const $rows = this._getRowElementsCore(fixedTableElement);
        const $colgroup = fixedTableElement.children('colgroup');

        $colgroup.replaceWith(this._createColGroup(fixedColumns));

        for(let i = 0; i < $rows.length; i++) {
            this._partialUpdateFixedRow($($rows[i]), fixedColumns);
        }
    },

    _partialUpdateFixedRow($row, fixedColumns) {
        const cellElements = $row.get(0).childNodes;
        const transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
        const transparentColumn = fixedColumns[transparentColumnIndex];
        const columnIndexOffset = this._columnsController.getColumnIndexOffset();
        let groupCellOptions;
        let colIndex = columnIndexOffset + 1;
        let colspan = transparentColumn.colspan;

        if($row.hasClass(DETAIL_ROW_CLASS)) {
            cellElements[0].setAttribute('colspan', this._columnsController.getVisibleColumns()?.length);

            return;
        }

        if($row.hasClass(GROUP_ROW_CLASS)) {
            groupCellOptions = this._getGroupCellOptions({
                row: $row.data('options'),
                columns: this._columnsController.getVisibleColumns()
            });

            colspan = groupCellOptions.colspan - Math.max(0, cellElements.length - (groupCellOptions.columnIndex + 2));
        }

        for(let j = 0; j < cellElements.length; j++) {
            const needUpdateColspan = groupCellOptions ? j === (groupCellOptions.columnIndex + 1) : j === transparentColumnIndex;

            cellElements[j].setAttribute('aria-colindex', colIndex);

            if(needUpdateColspan) {
                cellElements[j].setAttribute('colspan', colspan);
                colIndex += colspan;
            } else {
                colIndex++;
            }
        }
    },

    _renderTable: function(options) {
        let $fixedTable;
        const fixedColumns = this.getFixedColumns();

        this._isFixedColumns = !!fixedColumns.length;
        const $table = this.callBase(options);


        if(this._isFixedColumns) {
            const change = options?.change;

            this._isFixedTableRendering = true;

            if(change?.virtualColumnsScrolling && this.option('scrolling.legacyMode') !== true) {
                this._partialUpdateFixedTable(fixedColumns);
                this._isFixedTableRendering = false;
            } else {
                const columnIndices = change?.columnIndices;

                this._correctColumnIndicesForFixedColumns(fixedColumns, change);

                $fixedTable = this._createTable(fixedColumns);
                this._renderRows($fixedTable, extend({}, options, { columns: fixedColumns }));
                this._updateContent($fixedTable, change, true);

                if(columnIndices) {
                    change.columnIndices = columnIndices;
                }

                this._isFixedTableRendering = false;
            }
        } else {
            this._fixedTableElement && this._fixedTableElement.parent().remove();
            this._fixedTableElement = null;
        }

        return $table;
    },

    _renderRow: function($table, options) {
        let fixedCorrection;
        let cells = options.row.cells;

        this.callBase.apply(this, arguments);

        if(this._isFixedTableRendering && cells && cells.length) {
            fixedCorrection = 0;
            const fixedCells = options.row.cells || [];
            cells = cells.slice();
            options.row.cells = cells;

            for(let i = 0; i < fixedCells.length; i++) {
                if(fixedCells[i].column && fixedCells[i].column.command === COMMAND_TRANSPARENT) {
                    fixedCorrection = (fixedCells[i].column.colspan || 1) - 1;
                    continue;
                }
                cells[i + fixedCorrection] = fixedCells[i];
            }
        }
    },

    _createCell: function(options) {
        const that = this;
        const column = options.column;
        const columnCommand = column && column.command;
        const rowType = options.rowType;
        const $cell = that.callBase.apply(that, arguments);
        let fixedColumns;
        let prevFixedColumn;
        let transparentColumnIndex;

        if(that._isFixedTableRendering || rowType === 'filter') {
            fixedColumns = that.getFixedColumns();
            transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
            prevFixedColumn = fixedColumns[transparentColumnIndex - 1];
        }

        if(that._isFixedTableRendering) {
            if(columnCommand === COMMAND_TRANSPARENT) {
                $cell
                    .addClass(POINTER_EVENTS_NONE_CLASS)
                    .toggleClass(FIRST_CELL_CLASS, transparentColumnIndex === 0 || prevFixedColumn && prevFixedColumn.command === 'expand')
                    .toggleClass(LAST_CELL_CLASS, fixedColumns.length && transparentColumnIndex === (fixedColumns.length - 1));

                if(rowType !== 'freeSpace') {
                    gridCoreUtils.setEmptyText($cell);
                }
            }
        } else if(rowType === 'filter') {
            $cell.toggleClass(FIRST_CELL_CLASS, options.columnIndex === transparentColumnIndex);
        }

        const isRowAltStyle = that.option('rowAlternationEnabled') && options.isAltRow;
        const isSelectAllCell = that.option('selection.mode') === 'multiple' && options.columnIndex === 0 && options.rowType === 'header';
        // T823783, T852898, T865179, T875201, T1120812
        if(browser.mozilla && options.column.fixed && options.rowType !== 'group' && !isRowAltStyle && !isSelectAllCell) {
            $cell.addClass(FIXED_COL_CLASS);
        }

        return $cell;
    },

    _wrapTableInScrollContainer: function($table, isFixedTableRendering) {
        const $scrollContainer = this.callBase.apply(this, arguments);

        if(this._isFixedTableRendering || isFixedTableRendering) {
            $scrollContainer.addClass(this.addWidgetPrefix(CONTENT_FIXED_CLASS));
        }

        return $scrollContainer;
    },

    _renderCellContent: function($cell, options) {
        let isEmptyCell;
        const column = options.column;
        const isFixedTableRendering = this._isFixedTableRendering;
        const isGroupCell = options.rowType === 'group' && isDefined(column.groupIndex);

        // T747718, T824508, T821252
        if(isFixedTableRendering && isGroupCell && !column.command && !column.groupCellTemplate) {
            $cell.css('pointerEvents', 'none');
        }

        if(!isFixedTableRendering && this._isFixedColumns) {
            isEmptyCell = column.fixed || (column.command && column.fixed !== false);

            if(isGroupCell) {
                isEmptyCell = false;
                if(options.row.summaryCells && options.row.summaryCells.length) {
                    const columns = this._columnsController.getVisibleColumns();
                    const alignByFixedColumnCellCount = this._getAlignByColumnCellCount ? this._getAlignByColumnCellCount(column.colspan, {
                        columns: columns,
                        row: options.row,
                        isFixed: true
                    }) : 0;

                    if(alignByFixedColumnCellCount > 0) {
                        const transparentColumnIndex = getTransparentColumnIndex(this._columnsController.getFixedColumns());
                        isEmptyCell = (columns.length - alignByFixedColumnCellCount) < transparentColumnIndex;
                    }
                }
            }

            if(isEmptyCell) {
                if(column.command && column.type !== 'buttons' || options.rowType === 'group') {
                    $cell
                        .html('&nbsp;')
                        .addClass(column.cssClass);
                    return;
                } else {
                    $cell.addClass('dx-hidden-cell');
                }
            }
        }

        if(column.command !== COMMAND_TRANSPARENT) {
            this.callBase.apply(this, arguments);
        }
    },

    _getCellElementsCore: function(rowIndex) {
        const cellElements = this.callBase.apply(this, arguments);
        const isGroupRow = cellElements.parent().hasClass(GROUP_ROW_CLASS);
        const headerRowIndex = this.name === 'columnHeadersView' ? rowIndex : undefined; // TODO

        if(this._fixedTableElement && cellElements) {
            const fixedColumns = this.getFixedColumns(headerRowIndex);
            const fixedCellElements = this._getRowElements(this._fixedTableElement).eq(rowIndex).children('td');

            each(fixedCellElements, (columnIndex, cell) => {
                if(isGroupRow) {
                    if(cellElements[columnIndex] && cell.style.visibility !== 'hidden') {
                        cellElements[columnIndex] = cell;
                    }
                } else {
                    const fixedColumn = fixedColumns[columnIndex];

                    if(fixedColumn) {
                        if(fixedColumn.command === COMMAND_TRANSPARENT) {
                            if(fixedCellElements.eq(columnIndex).hasClass(MASTER_DETAIL_CELL_CLASS)) {
                                cellElements[columnIndex] = cell || cellElements[columnIndex];
                            }
                        } else {
                            const fixedColumnIndex = this._columnsController.getVisibleIndexByColumn(fixedColumn, headerRowIndex);
                            cellElements[fixedColumnIndex] = cell || cellElements[fixedColumnIndex];
                        }
                    }
                }
            });
        }

        return cellElements;
    },

    getColumnWidths: function() {
        const that = this;
        const result = that.callBase();
        const fixedColumns = that.getFixedColumns();
        const fixedWidths = that._fixedTableElement && result.length
            ? that.callBase(that._fixedTableElement)
            : undefined;

        return normalizeColumnWidths(fixedColumns, result, fixedWidths);
    },

    getTableElement: function(isFixedTableRendering) {
        isFixedTableRendering = this._isFixedTableRendering || isFixedTableRendering;
        const tableElement = isFixedTableRendering ? this._fixedTableElement : this.callBase();

        return tableElement;
    },

    setTableElement: function(tableElement, isFixedTableRendering) {
        if(this._isFixedTableRendering || isFixedTableRendering) {
            this._fixedTableElement = tableElement.addClass(POINTER_EVENTS_NONE_CLASS);
        } else {
            this.callBase(tableElement);
        }
    },

    getColumns: function(rowIndex, $tableElement) {
        $tableElement = $tableElement || this.getTableElement();

        if(this._isFixedTableRendering || $tableElement && $tableElement.closest('table').parent('.' + this.addWidgetPrefix(CONTENT_FIXED_CLASS)).length) {
            return this.getFixedColumns(rowIndex);
        }

        return this.callBase(rowIndex, $tableElement);
    },

    getRowIndex: function($row) {
        const $fixedTable = this._fixedTableElement;

        if($fixedTable && $fixedTable.find($row).length) {
            return this._getRowElements($fixedTable).index($row);
        }

        return this.callBase($row);
    },

    getTableElements: function() {
        let result = this.callBase.apply(this, arguments);

        if(this._fixedTableElement) {
            result = $([result.get(0), this._fixedTableElement.get(0)]);
        }

        return result;
    },

    getFixedColumns: function(rowIndex) {
        return this._columnsController.getFixedColumns(rowIndex);
    },

    getFixedColumnsOffset: function() {
        let offset = { left: 0, right: 0 };
        let $transparentColumn;

        if(this._fixedTableElement) {
            $transparentColumn = this.getTransparentColumnElement();
            const positionTransparentColumn = $transparentColumn.position();

            offset = {
                left: positionTransparentColumn.left,
                right: getOuterWidth(this.element(), true) - (getOuterWidth($transparentColumn, true) + positionTransparentColumn.left)
            };
        }

        return offset;
    },

    getTransparentColumnElement: function() {
        return this._fixedTableElement && this._fixedTableElement.find('.' + POINTER_EVENTS_NONE_CLASS).first();
    },

    getFixedTableElement: function() {
        return this._fixedTableElement;
    },

    isFixedColumns: function() {
        return this._isFixedColumns;
    },

    _resizeCore: function() {
        this.callBase();
        this.synchronizeRows();
    },

    setColumnWidths: function(options) {
        let columns;
        const visibleColumns = this._columnsController.getVisibleColumns();
        const widths = options.widths;
        const isWidthsSynchronized = widths && widths.length && isDefined(visibleColumns[0].visibleWidth);
        const optionNames = options.optionNames;
        const isColumnWidthChanged = optionNames && optionNames.width;
        let useVisibleColumns = false;

        this.callBase.apply(this, arguments);

        if(this._fixedTableElement) {
            const hasAutoWidth = widths && widths.some(function(width) { return width === 'auto'; });
            useVisibleColumns = hasAutoWidth && (!isWidthsSynchronized || !this.isScrollbarVisible(true));

            if(useVisibleColumns) {
                columns = visibleColumns;
            }
            this.callBase(extend({}, options, { $tableElement: this._fixedTableElement, columns, fixed: true }));
        }

        if(isWidthsSynchronized || isColumnWidthChanged && this.option('wordWrapEnabled')) {
            this.synchronizeRows();
        }
    },

    _createColGroup: function(columns) {
        if(this._isFixedTableRendering && !this.option('columnAutoWidth')) {
            const visibleColumns = this._columnsController.getVisibleColumns();
            const useVisibleColumns = visibleColumns.filter(function(column) { return !column.width; }).length;
            if(useVisibleColumns) {
                columns = visibleColumns;
            }
        }
        return this.callBase(columns);
    },

    _getClientHeight: function(element) {
        const boundingClientRectElement = element.getBoundingClientRect && getBoundingRect(element);

        return boundingClientRectElement && boundingClientRectElement.height ? boundingClientRectElement.height : element.clientHeight;
    },

    synchronizeRows: function() {
        const rowHeights = [];
        const fixedRowHeights = [];
        let rowIndex;
        let $rowElements;
        let $fixedRowElements;
        let $contentElement;

        this.waitAsyncTemplates(true).done(() => {
            if(this._isFixedColumns && this._tableElement && this._fixedTableElement) {
                const heightTable = this._getClientHeight(this._tableElement.get(0));
                const heightFixedTable = this._getClientHeight(this._fixedTableElement.get(0));
                $rowElements = this._getRowElements(this._tableElement);
                $fixedRowElements = this._getRowElements(this._fixedTableElement);
                $contentElement = this._findContentElement();

                if(heightTable !== heightFixedTable) {
                    $contentElement && $contentElement.css('height', heightTable);
                    $rowElements.css('height', '');
                    $fixedRowElements.css('height', '');

                    for(rowIndex = 0; rowIndex < $rowElements.length; rowIndex++) {
                        rowHeights.push(this._getClientHeight($rowElements.get(rowIndex)));
                        fixedRowHeights.push(this._getClientHeight($fixedRowElements.get(rowIndex)));
                    }
                    for(rowIndex = 0; rowIndex < $rowElements.length; rowIndex++) {
                        const rowHeight = rowHeights[rowIndex];
                        const fixedRowHeight = fixedRowHeights[rowIndex];
                        if(rowHeight > fixedRowHeight) {
                            $fixedRowElements.eq(rowIndex).css('height', rowHeight);
                        } else if(rowHeight < fixedRowHeight) {
                            $rowElements.eq(rowIndex).css('height', fixedRowHeight);
                        }
                    }

                    $contentElement && $contentElement.css('height', '');
                }
            }
        });
    },

    setScrollerSpacing: function(width) {
        const rtlEnabled = this.option('rtlEnabled');

        this.callBase(width);
        this.element().children('.' + this.addWidgetPrefix(CONTENT_FIXED_CLASS)).css({
            paddingLeft: rtlEnabled ? width : '',
            paddingRight: !rtlEnabled ? width : ''
        });
    }
};

const ColumnHeadersViewFixedColumnsExtender = extend({}, baseFixedColumns, {
    _getRowVisibleColumns: function(rowIndex) {
        if(this._isFixedTableRendering) {
            return this.getFixedColumns(rowIndex);
        }
        return this.callBase(rowIndex);
    },

    getContextMenuItems: function(options) {
        const column = options.column;
        const columnFixingOptions = this.option('columnFixing');
        let items = this.callBase(options);

        if(options.row && options.row.rowType === 'header') {
            if(columnFixingOptions.enabled === true && column && column.allowFixing) {
                const onItemClick = (params) => {
                    switch(params.itemData.value) {
                        case 'none':
                            this._columnsController.columnOption(column.index, 'fixed', false);
                            break;
                        case 'left':
                            this._columnsController.columnOption(column.index, {
                                fixed: true,
                                fixedPosition: 'left'
                            });
                            break;
                        case 'right':
                            this._columnsController.columnOption(column.index, {
                                fixed: true,
                                fixedPosition: 'right'
                            });
                            break;
                    }
                };

                items = items || [];
                items.push({
                    text: columnFixingOptions.texts.fix, beginGroup: true, items: [
                        { text: columnFixingOptions.texts.leftPosition, value: 'left', disabled: column.fixed && (!column.fixedPosition || column.fixedPosition === 'left'), onItemClick: onItemClick },
                        { text: columnFixingOptions.texts.rightPosition, value: 'right', disabled: column.fixed && column.fixedPosition === 'right', onItemClick: onItemClick }]
                },
                { text: columnFixingOptions.texts.unfix, value: 'none', disabled: !column.fixed, onItemClick: onItemClick });
            }
        }
        return items;
    },

    getFixedColumnElements: function(rowIndex) {
        const that = this;

        if(isDefined(rowIndex)) {
            return this._fixedTableElement && this._getRowElements(this._fixedTableElement).eq(rowIndex).children();
        }

        const columnElements = that.getColumnElements();
        const $transparentColumnElement = that.getTransparentColumnElement();
        if(columnElements && $transparentColumnElement && $transparentColumnElement.length) {
            const transparentColumnIndex = getTransparentColumnIndex(that.getFixedColumns());
            columnElements.splice(transparentColumnIndex, $transparentColumnElement.get(0).colSpan, $transparentColumnElement.get(0));
        }

        return columnElements;
    },

    getColumnWidths: function() {
        const that = this;
        let fixedWidths;
        const result = that.callBase();
        const $fixedColumnElements = that.getFixedColumnElements();
        const fixedColumns = that.getFixedColumns();

        if(that._fixedTableElement) {
            if($fixedColumnElements && $fixedColumnElements.length) {
                fixedWidths = that._getWidths($fixedColumnElements);
            } else {
                fixedWidths = that.callBase(that._fixedTableElement);
            }
        }

        return normalizeColumnWidths(fixedColumns, result, fixedWidths);
    }
});

const RowsViewFixedColumnsExtender = extend({}, baseFixedColumns, {
    _detachHoverEvents: function() {
        this._fixedTableElement && eventsEngine.off(this._fixedTableElement, 'mouseover mouseout', '.dx-data-row');
        this._tableElement && eventsEngine.off(this._tableElement, 'mouseover mouseout', '.dx-data-row');
    },

    _attachHoverEvents: function() {
        const that = this;
        const attachHoverEvent = function($table) {
            eventsEngine.on($table, 'mouseover mouseout', '.dx-data-row', that.createAction(function(args) {
                const event = args.event;
                const rowIndex = that.getRowIndex($(event.target).closest('.dx-row'));
                const isHover = event.type === 'mouseover';

                if(rowIndex >= 0) {
                    that._tableElement && that._getRowElements(that._tableElement).eq(rowIndex).toggleClass(HOVER_STATE_CLASS, isHover);
                    that._fixedTableElement && that._getRowElements(that._fixedTableElement).eq(rowIndex).toggleClass(HOVER_STATE_CLASS, isHover);
                }
            }));
        };

        if(that._fixedTableElement && that._tableElement) {
            attachHoverEvent(that._fixedTableElement);
            attachHoverEvent(that._tableElement);
        }
    },

    _getScrollDelay: function() {
        const hasResizeTimeout = this.getController('resizing')?.hasResizeTimeout();

        if(hasResizeTimeout) {
            return this.option('scrolling.updateTimeout');
        }

        return browser.mozilla ? 60 : 0;
    },

    _findContentElement: function(isFixedTableRendering) {
        let $content;
        let scrollTop;
        const contentClass = this.addWidgetPrefix(CONTENT_CLASS);
        const element = this.element();

        isFixedTableRendering = this._isFixedTableRendering || isFixedTableRendering;

        if(element && isFixedTableRendering) {
            $content = element.children('.' + contentClass);

            const scrollable = this.getScrollable();
            if(!$content.length && scrollable) {
                $content = $('<div>').addClass(contentClass);

                eventsEngine.on($content, 'scroll', (e) => {
                    const scrollDelay = this._getScrollDelay();

                    clearTimeout(this._fixedScrollTimeout);
                    this._fixedScrollTimeout = setTimeout(() => {
                        scrollTop = $(e.target).scrollTop();
                        scrollable.scrollTo({ y: scrollTop });
                    }, scrollDelay);
                });
                eventsEngine.on($content, wheelEventName, (e) => {
                    const $nearestScrollable = $(e.target).closest('.dx-scrollable');
                    let shouldScroll = false;

                    if(scrollable && scrollable.$element().is($nearestScrollable)) {
                        shouldScroll = true;
                    } else {
                        const nearestScrollableInstance = $nearestScrollable.length && Scrollable.getInstance($nearestScrollable.get(0));
                        const nearestScrollableHasVerticalScrollbar = nearestScrollableInstance && (nearestScrollableInstance.scrollHeight() - nearestScrollableInstance.clientHeight() > 0);

                        shouldScroll = nearestScrollableInstance && !nearestScrollableHasVerticalScrollbar;
                    }

                    if(shouldScroll) {
                        scrollTop = scrollable.scrollTop();
                        scrollable.scrollTo({ y: scrollTop - e.delta });

                        const scrollableTop = scrollable.scrollTop() + scrollable.clientHeight();
                        const scrollableHeight = scrollable.scrollHeight() + this.getScrollbarWidth();
                        const isPreventDefault = scrollable.scrollTop() > 0 && scrollableTop < scrollableHeight;

                        if(isPreventDefault) {
                            return false;
                        }
                    }
                });

                $content.appendTo(element);
            }

            return $content;
        }

        return this.callBase();
    },

    _updateScrollable: function() {
        this.callBase();

        const scrollable = this.getScrollable();

        if(scrollable?._disposed) {
            return;
        }

        const scrollTop = scrollable && scrollable.scrollOffset().top;

        this._updateFixedTablePosition(scrollTop);
    },

    _renderContent: function(contentElement, tableElement, isFixedTableRendering) {
        if(this._isFixedTableRendering || isFixedTableRendering) {
            return contentElement
                .empty()
                .addClass(this.addWidgetPrefix(CONTENT_CLASS) + ' ' + this.addWidgetPrefix(CONTENT_FIXED_CLASS))
                .append(tableElement);
        }

        return this.callBase(contentElement, tableElement);
    },

    _getGroupCellOptions: function(options) {
        if(this._isFixedTableRendering) {
            return this.callBase(extend({}, options, { columns: this._columnsController.getVisibleColumns() }));
        }

        return this.callBase(options);
    },

    _renderGroupedCells: function($row, options) {
        return this.callBase($row, extend({}, options, { columns: this._columnsController.getVisibleColumns() }));
    },

    _renderGroupSummaryCells: function($row, options) {
        if(this._isFixedTableRendering) {
            this.callBase($row, extend({}, options, { columns: this._columnsController.getVisibleColumns() }));
        } else {
            this.callBase($row, options);
        }
    },

    _hasAlignByColumnSummaryItems: function(columnIndex, options) {
        const result = this.callBase.apply(this, arguments);
        const column = options.columns[columnIndex];

        if(options.isFixed) {
            return column.fixed && (result || column.fixedPosition === 'right');
        }

        return result && (!this._isFixedColumns || !column.fixed);
    },

    _renderGroupSummaryCellsCore: function($groupCell, options, groupCellColSpan, alignByColumnCellCount) {
        let alignByFixedColumnCellCount;

        if(this._isFixedTableRendering) {
            options.isFixed = true;
            alignByFixedColumnCellCount = this._getAlignByColumnCellCount(groupCellColSpan, options);
            options.isFixed = false;

            const startColumnIndex = options.columns.length - alignByFixedColumnCellCount;
            options = extend({}, options, { columns: this.getFixedColumns() });
            const transparentColumnIndex = getTransparentColumnIndex(options.columns);

            if(startColumnIndex < transparentColumnIndex) {
                alignByFixedColumnCellCount -= (options.columns[transparentColumnIndex].colspan - 1) || 0;
                groupCellColSpan -= (options.columns[transparentColumnIndex].colspan - 1) || 0;
            } else if(alignByColumnCellCount > 0) {
                $groupCell.css('visibility', 'hidden');
            }
            alignByColumnCellCount = alignByFixedColumnCellCount;
        }

        this.callBase($groupCell, options, groupCellColSpan, alignByColumnCellCount);
    },

    _getSummaryCellIndex: function(columnIndex, columns) {

        if(this._isFixedTableRendering) {
            const transparentColumnIndex = getTransparentColumnIndex(columns);

            if(columnIndex > transparentColumnIndex) {
                columnIndex += columns[transparentColumnIndex].colspan - 1;
            }

            return columnIndex;
        }

        return this.callBase.apply(this, arguments);
    },

    _renderCore: function(change) {
        this._detachHoverEvents();

        const deferred = this.callBase(change);

        const isFixedColumns = this._isFixedColumns;

        this.element().toggleClass(FIXED_COLUMNS_CLASS, isFixedColumns);

        if(this.option('hoverStateEnabled') && isFixedColumns) {
            this._attachHoverEvents();
        }
        return deferred;
    },

    setRowsOpacity: function(columnIndex, value) {
        this.callBase(columnIndex, value);

        const $rows = this._getRowElements(this._fixedTableElement);
        this._setRowsOpacityCore($rows, this.getFixedColumns(), columnIndex, value);
    },

    optionChanged: function(args) {
        const that = this;

        that.callBase(args);

        if(args.name === 'hoverStateEnabled' && that._isFixedColumns) {
            args.value ? this._attachHoverEvents() : this._detachHoverEvents();
        }
    },

    getCellIndex: function($cell) {
        const $fixedTable = this._fixedTableElement;
        let cellIndex = 0;

        if($fixedTable && $cell.is('td') && $cell.closest($fixedTable).length) {
            const columns = this.getFixedColumns();

            each(columns, function(index, column) {
                if(index === $cell[0].cellIndex) {
                    return false;
                }

                if(column.colspan) {
                    cellIndex += column.colspan;
                    return;
                }

                cellIndex++;
            });

            return cellIndex;
        }

        return this.callBase.apply(this, arguments);
    },

    _updateFixedTablePosition: function(scrollTop, needFocus) {
        if(this._fixedTableElement && this._tableElement) {
            let $focusedElement;
            const editorFactory = this.getController('editorFactory');

            this._fixedTableElement.parent().scrollTop(scrollTop);

            if(needFocus && editorFactory) {
                $focusedElement = editorFactory.focus();
                $focusedElement && editorFactory.focus($focusedElement);
            }
        }
    },

    setScrollerSpacing: function(vWidth, hWidth) {
        const that = this;
        const styles = { marginBottom: 0 };
        const $fixedContent = that.element().children('.' + this.addWidgetPrefix(CONTENT_FIXED_CLASS));

        if($fixedContent.length && that._fixedTableElement) {
            $fixedContent.css(styles);
            that._fixedTableElement.css(styles);

            styles[that.option('rtlEnabled') ? 'marginLeft' : 'marginRight'] = vWidth;
            styles.marginBottom = hWidth;

            const useNativeScrolling = that._scrollable && that._scrollable.option('useNative');
            (useNativeScrolling ? $fixedContent : that._fixedTableElement).css(styles);
        }
    },

    _getElasticScrollTop: function(e) {
        let elasticScrollTop = 0;

        if(e.scrollOffset.top < 0) {
            elasticScrollTop = -e.scrollOffset.top;
        } else if(e.reachedBottom) {
            const $scrollableContent = $(e.component.content());
            const $scrollableContainer = $(e.component.container());
            const maxScrollTop = Math.max($scrollableContent.get(0).clientHeight - $scrollableContainer.get(0).clientHeight, 0);
            elasticScrollTop = maxScrollTop - e.scrollOffset.top;
        }

        return Math.floor(elasticScrollTop);
    },

    _applyElasticScrolling: function(e) {
        if(this._fixedTableElement) {
            const elasticScrollTop = this._getElasticScrollTop(e);

            if(Math.ceil(elasticScrollTop) !== 0) {
                move(this._fixedTableElement, { top: elasticScrollTop });
            } else {
                this._fixedTableElement.css('transform', '');
            }
        }
    },

    _handleScroll: function(e) {
        this._updateFixedTablePosition(e.scrollOffset.top, true);
        this._applyElasticScrolling(e);
        this.callBase(e);
    },

    _updateContentPosition: function(isRender) {
        this.callBase.apply(this, arguments);
        if(!isRender) {
            this._updateFixedTablePosition(this._scrollTop);
        }
    },
    _afterRowPrepared: function(e) {
        if(this._isFixedTableRendering) return;
        this.callBase(e);
    },

    _scrollToElement: function($element) {
        this.callBase($element, this.getFixedColumnsOffset());
    },

    dispose: function() {
        this.callBase.apply(this, arguments);
        clearTimeout(this._fixedScrollTimeout);
    }
});

const FooterViewFixedColumnsExtender = baseFixedColumns;

export const columnFixingModule = {
    defaultOptions: function() {
        return {
            columnFixing: {
                enabled: false,
                texts: {
                    fix: messageLocalization.format('dxDataGrid-columnFixingFix'),
                    unfix: messageLocalization.format('dxDataGrid-columnFixingUnfix'),
                    leftPosition: messageLocalization.format('dxDataGrid-columnFixingLeftPosition'),
                    rightPosition: messageLocalization.format('dxDataGrid-columnFixingRightPosition')
                }
            }
        };
    },
    extenders: {
        views: {
            columnHeadersView: ColumnHeadersViewFixedColumnsExtender,
            rowsView: RowsViewFixedColumnsExtender,
            footerView: FooterViewFixedColumnsExtender
        },
        controllers: (function() {
            const normalizeColumnIndicesByPoints = function(columns, fixedColumns, pointsByColumns) {
                const transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
                const correctIndex = columns.length - fixedColumns.length;

                each(pointsByColumns, function(_, point) {
                    if(point.index > transparentColumnIndex) {
                        point.columnIndex += correctIndex;
                        point.index += correctIndex;
                    }
                });

                return pointsByColumns;
            };

            return {
                draggingHeader: {
                    _generatePointsByColumns: function(options) {
                        const visibleColumns = options.columns;
                        const targetDraggingPanel = options.targetDraggingPanel;

                        if(targetDraggingPanel && targetDraggingPanel.getName() === 'headers' && targetDraggingPanel.isFixedColumns()) {
                            if(options.sourceColumn.fixed) {
                                if(!options.rowIndex) {
                                    options.columnElements = targetDraggingPanel.getFixedColumnElements(0);
                                }
                                options.columns = targetDraggingPanel.getFixedColumns(options.rowIndex);

                                const pointsByColumns = this.callBase(options);
                                normalizeColumnIndicesByPoints(visibleColumns, options.columns, pointsByColumns);
                                return pointsByColumns;
                            }
                        }

                        return this.callBase(options);
                    },

                    _pointCreated: function(point, columns, location, sourceColumn) {
                        const result = this.callBase.apply(this, arguments);
                        const targetColumn = columns[point.columnIndex];
                        const $transparentColumn = this._columnHeadersView.getTransparentColumnElement();

                        if(!result && location === 'headers' && $transparentColumn && $transparentColumn.length) {
                            const boundingRect = getBoundingRect($transparentColumn.get(0));

                            if(sourceColumn && sourceColumn.fixed) {
                                return sourceColumn.fixedPosition === 'right' ? point.x < boundingRect.right : point.x > boundingRect.left;
                            } else {
                                if(targetColumn && targetColumn.fixed && targetColumn.fixedPosition !== 'right') {
                                    return true;
                                }

                                return point.x < boundingRect.left || point.x > boundingRect.right;
                            }
                        }

                        return result;
                    }
                },

                columnsResizer: {
                    _generatePointsByColumns: function() {
                        const that = this;
                        const columnsController = that._columnsController;
                        const columns = columnsController && that._columnsController.getVisibleColumns();
                        const fixedColumns = columnsController && that._columnsController.getFixedColumns();
                        const transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
                        const correctIndex = columns.length - fixedColumns.length;
                        const cells = that._columnHeadersView.getFixedColumnElements();

                        that.callBase();

                        if(cells && cells.length > 0) {
                            that._pointsByFixedColumns = gridCoreUtils.getPointsByColumns(cells, function(point) {
                                if(point.index > transparentColumnIndex) {
                                    point.columnIndex += correctIndex;
                                    point.index += correctIndex;
                                }

                                return that._pointCreated(point, columns.length, columns);
                            });
                        }
                    },

                    _getTargetPoint: function(pointsByColumns, currentX, deltaX) {
                        const $transparentColumn = this._columnHeadersView.getTransparentColumnElement();

                        if($transparentColumn && $transparentColumn.length) {
                            const boundingRect = getBoundingRect($transparentColumn.get(0));

                            if(currentX <= boundingRect.left || currentX >= boundingRect.right) {
                                return this.callBase(this._pointsByFixedColumns, currentX, deltaX);
                            }
                        }

                        return this.callBase(pointsByColumns, currentX, deltaX);
                    }
                }
            };
        })()
    }
};
