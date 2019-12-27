import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import wheelEvent from '../../events/core/wheel';
import messageLocalization from '../../localization/message';
import gridCoreUtils from '../grid_core/ui.grid_core.utils';
import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import browser from '../../core/utils/browser';
import translator from '../../animation/translator';

const CONTENT_CLASS = 'content';
const CONTENT_FIXED_CLASS = 'content-fixed';
const MASTER_DETAIL_CELL_CLASS = 'dx-master-detail-cell';
const FIRST_CELL_CLASS = 'dx-first-cell';
const LAST_CELL_CLASS = 'dx-last-cell';
const HOVER_STATE_CLASS = 'dx-state-hover';
const FIXED_COL_CLASS = 'dx-col-fixed';
const FIXED_COLUMNS_CLASS = 'dx-fixed-columns';
const POINTER_EVENTS_TARGET_CLASS = 'dx-pointer-events-target';
const POINTER_EVENTS_NONE_CLASS = 'dx-pointer-events-none';
const COMMAND_TRANSPARENT = 'transparent';
const GROUP_ROW_CLASS = 'dx-group-row';

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
    let i;
    let fixedColumnIndex = 0;

    if(fixedColumns && widths && fixedWidths) {
        for(i = 0; i < fixedColumns.length; i++) {
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

    _renderTable: function(options) {
        const that = this;
        let $fixedTable;
        let $table;
        const fixedColumns = that.getFixedColumns();

        that._isFixedColumns = !!fixedColumns.length;
        $table = that.callBase(options);

        if(that._isFixedColumns) {
            that._isFixedTableRendering = true;

            const change = options && options.change;
            // cells = options.cells,
            const columnIndices = change && change.columnIndices;

            that._correctColumnIndicesForFixedColumns(fixedColumns, change);

            $fixedTable = that._createTable(fixedColumns);
            that._renderRows($fixedTable, extend({}, options, { columns: fixedColumns }));
            that._updateContent($fixedTable, change);

            if(columnIndices) {
                change.columnIndices = columnIndices;
            }

            that._isFixedTableRendering = false;
        } else {
            that._fixedTableElement && that._fixedTableElement.parent().remove();
            that._fixedTableElement = null;
        }

        return $table;
    },

    _renderRow: function($table, options) {
        let fixedCells;
        let fixedCorrection;
        let cells = options.row.cells;

        this.callBase.apply(this, arguments);

        if(this._isFixedTableRendering && cells && cells.length) {
            fixedCorrection = 0;
            fixedCells = options.row.cells || [];
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

        return $cell;
    },

    _wrapTableInScrollContainer: function() {
        const $scrollContainer = this.callBase.apply(this, arguments);

        if(this._isFixedTableRendering) {
            $scrollContainer.addClass(this.addWidgetPrefix(CONTENT_FIXED_CLASS) + ' ' + POINTER_EVENTS_TARGET_CLASS);
        }

        return $scrollContainer;
    },

    _renderCellContent: function($cell, options) {
        const that = this;
        let columns;
        let isEmptyCell;
        let transparentColumnIndex;
        let alignByFixedColumnCellCount;
        const column = options.column;
        const isFixedTableRendering = that._isFixedTableRendering;
        const isGroupCell = options.rowType === 'group' && isDefined(column.groupIndex);

        // T747718, T824508, T821252
        if(isFixedTableRendering && isGroupCell && !column.command && !column.groupCellTemplate) {
            $cell.css('pointerEvents', 'none');
        }

        if(!isFixedTableRendering && that._isFixedColumns) {
            isEmptyCell = column.fixed || (column.command && column.fixed !== false);

            if(isGroupCell) {
                isEmptyCell = false;
                if(options.row.summaryCells && options.row.summaryCells.length) {
                    columns = that._columnsController.getVisibleColumns();
                    alignByFixedColumnCellCount = that._getAlignByColumnCellCount ? that._getAlignByColumnCellCount(column.colspan, {
                        columns: columns,
                        row: options.row,
                        isFixed: true
                    }) : 0;

                    if(alignByFixedColumnCellCount > 0) {
                        transparentColumnIndex = getTransparentColumnIndex(that._columnsController.getFixedColumns());
                        isEmptyCell = (columns.length - alignByFixedColumnCellCount) < transparentColumnIndex;
                    }
                }
            }

            if(isEmptyCell) {
                if(that.option('legacyRendering') || (column.command && column.type !== 'buttons' || options.rowType === 'group')) {
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
            that.callBase($cell, options);
        }
    },

    _getCellElementsCore: function(rowIndex) {
        const that = this;
        let fixedColumn;
        let fixedColumns;
        let fixedColumnIndex;
        let fixedCellElements;
        const cellElements = that.callBase(rowIndex);
        const isGroupRow = cellElements.parent().hasClass(GROUP_ROW_CLASS);
        const index = that.name === 'columnHeadersView' ? rowIndex : undefined; // TODO

        if(that._fixedTableElement && cellElements) {
            fixedColumns = that.getFixedColumns(index);
            fixedCellElements = that._getRowElements(that._fixedTableElement).eq(rowIndex).children('td');

            each(fixedCellElements, function(columnIndex, cell) {
                if(isGroupRow) {
                    if(cellElements[columnIndex] && cell.style.visibility !== 'hidden') {
                        cellElements[columnIndex] = cell;
                    }
                } else {
                    fixedColumn = fixedColumns[columnIndex];

                    if(fixedColumn) {
                        if(fixedColumn.command === COMMAND_TRANSPARENT) {
                            if(fixedCellElements.eq(columnIndex).hasClass(MASTER_DETAIL_CELL_CLASS)) {
                                cellElements[columnIndex] = cell || cellElements[columnIndex];
                            }
                        } else {
                            fixedColumnIndex = that._columnsController.getVisibleIndex(fixedColumn.index, index);
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
        let fixedWidths;
        const result = that.callBase();
        const fixedColumns = that.getFixedColumns();

        if(that._fixedTableElement && result.length) {
            fixedWidths = that.callBase(that._fixedTableElement);
        }

        return normalizeColumnWidths(fixedColumns, result, fixedWidths);
    },

    _getTableElement: function() {
        const tableElement = this._isFixedTableRendering ? this._fixedTableElement : this.callBase();

        return tableElement;
    },

    _setTableElement: function(tableElement) {
        if(this._isFixedTableRendering) {
            this._fixedTableElement = tableElement.addClass(POINTER_EVENTS_NONE_CLASS);
        } else {
            this.callBase(tableElement);
        }
    },

    getColumns: function(rowIndex, $tableElement) {
        $tableElement = $tableElement || this._getTableElement();

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
        let positionTransparentColumn;

        if(this._fixedTableElement) {
            $transparentColumn = this.getTransparentColumnElement();
            positionTransparentColumn = $transparentColumn.position();

            offset = {
                left: positionTransparentColumn.left,
                right: this.element().outerWidth(true) - ($transparentColumn.outerWidth(true) + positionTransparentColumn.left)
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
            if(this.option('legacyRendering')) {
                useVisibleColumns = widths && widths.length && !this.isScrollbarVisible(true);
            } else {
                const hasAutoWidth = widths && widths.some(function(width) { return width === 'auto'; });
                useVisibleColumns = hasAutoWidth && (!isWidthsSynchronized || !this.isScrollbarVisible(true));
            }

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
        if(!this.option('legacyRendering') && this._isFixedTableRendering && !this.option('columnAutoWidth')) {
            const visibleColumns = this._columnsController.getVisibleColumns();
            const useVisibleColumns = visibleColumns.filter(function(column) { return !column.width; }).length;
            if(useVisibleColumns) {
                columns = visibleColumns;
            }
        }
        return this.callBase(columns);
    },

    _getClientHeight: function(element) {
        const boundingClientRectElement = element.getBoundingClientRect && element.getBoundingClientRect();

        return boundingClientRectElement && boundingClientRectElement.height ? boundingClientRectElement.height : element.clientHeight;
    },

    synchronizeRows: function() {
        const that = this;
        let rowHeight;
        let fixedRowHeight;
        const rowHeights = [];
        const fixedRowHeights = [];
        let rowIndex;
        let heightTable;
        let heightFixedTable;
        let $rowElements;
        let $fixedRowElements;
        let $contentElement;


        if(that._isFixedColumns && that._tableElement && that._fixedTableElement) {
            heightTable = that._getClientHeight(that._tableElement.get(0));
            heightFixedTable = that._getClientHeight(that._fixedTableElement.get(0));
            $rowElements = that._getRowElements(that._tableElement);
            $fixedRowElements = that._getRowElements(that._fixedTableElement);
            $contentElement = that._findContentElement();

            if(heightTable !== heightFixedTable) {
                $contentElement && $contentElement.css('height', heightTable);
                $rowElements.css('height', '');
                $fixedRowElements.css('height', '');

                for(rowIndex = 0; rowIndex < $rowElements.length; rowIndex++) {
                    rowHeights.push(that._getClientHeight($rowElements.get(rowIndex)));
                    fixedRowHeights.push(that._getClientHeight($fixedRowElements.get(rowIndex)));
                }
                for(rowIndex = 0; rowIndex < $rowElements.length; rowIndex++) {
                    rowHeight = rowHeights[rowIndex];
                    fixedRowHeight = fixedRowHeights[rowIndex];
                    if(rowHeight > fixedRowHeight) {
                        $fixedRowElements.eq(rowIndex).css('height', rowHeight);
                    } else if(rowHeight < fixedRowHeight) {
                        $rowElements.eq(rowIndex).css('height', fixedRowHeight);
                    }
                }

                $contentElement && $contentElement.css('height', '');
            }
        }
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
        const that = this;
        const column = options.column;
        let onItemClick;
        const columnFixingOptions = that.option('columnFixing');
        let items = that.callBase(options);

        if(options.row && options.row.rowType === 'header') {
            if(column && column.allowFixing) {
                onItemClick = function(params) {
                    switch(params.itemData.value) {
                        case 'none':
                            that._columnsController.columnOption(column.index, 'fixed', false);
                            break;
                        case 'left':
                            that._columnsController.columnOption(column.index, {
                                fixed: true,
                                fixedPosition: 'left'
                            });
                            break;
                        case 'right':
                            that._columnsController.columnOption(column.index, {
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

    setScrollerSpacing: function(width) {
        const that = this;
        const rtlEnabled = that.option('rtlEnabled');

        that.callBase(width);
        that.element().children('.' + this.addWidgetPrefix(CONTENT_FIXED_CLASS)).css(rtlEnabled ? { paddingLeft: width } : { paddingRight: width });
    },

    getFixedColumnElements: function(rowIndex) {
        const that = this;
        let columnElements;
        let transparentColumnIndex;
        let $transparentColumnElement;

        if(isDefined(rowIndex)) {
            return this._fixedTableElement && this._getRowElements(this._fixedTableElement).eq(rowIndex).children();
        }

        columnElements = that.getColumnElements();
        $transparentColumnElement = that.getTransparentColumnElement();
        if(columnElements && $transparentColumnElement && $transparentColumnElement.length) {
            transparentColumnIndex = getTransparentColumnIndex(that.getFixedColumns());
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

    _findContentElement: function() {
        const that = this;
        let $content;
        let scrollable;
        let scrollTop;
        const contentClass = that.addWidgetPrefix(CONTENT_CLASS);
        const element = that.element();
        const scrollDelay = browser.mozilla ? 60 : 0;

        if(element && that._isFixedTableRendering) {
            $content = element.children('.' + contentClass);

            scrollable = that.getScrollable();
            if(!$content.length && scrollable) {
                $content = $('<div>').addClass(contentClass);

                eventsEngine.on($content, 'scroll', function(e) {
                    clearTimeout(that._fixedScrollTimeout);
                    that._fixedScrollTimeout = setTimeout(function() {
                        scrollTop = $(e.target).scrollTop();
                        scrollable.scrollTo({ y: scrollTop });
                    }, scrollDelay);
                });
                eventsEngine.on($content, wheelEvent.name, function(e) {
                    if(scrollable) {
                        scrollTop = scrollable.scrollTop();
                        scrollable.scrollTo({ y: scrollTop - e.delta });

                        if(scrollable.scrollTop() > 0 && (scrollable.scrollTop() + scrollable.clientHeight()) < (scrollable.scrollHeight() + that.getScrollbarWidth())) {
                            return false;
                        }
                    }
                });

                $content.appendTo(element);
            }

            return $content;
        }

        return that.callBase();
    },

    _updateScrollable: function() {
        this.callBase();

        const scrollable = this.getScrollable();
        const scrollTop = scrollable && scrollable.scrollOffset().top;

        this._updateFixedTablePosition(scrollTop);
    },

    _renderContent: function(contentElement, tableElement) {
        if(this._isFixedTableRendering) {
            return contentElement
                .empty()
                .addClass(this.addWidgetPrefix(CONTENT_CLASS) + ' ' + this.addWidgetPrefix(CONTENT_FIXED_CLASS) + ' ' + POINTER_EVENTS_TARGET_CLASS)
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

        return result && !column.fixed;
    },

    _renderGroupSummaryCellsCore: function($groupCell, options, groupCellColSpan, alignByColumnCellCount) {
        let startColumnIndex;
        let transparentColumnIndex;
        let alignByFixedColumnCellCount;

        if(this._isFixedTableRendering) {
            options.isFixed = true;
            alignByFixedColumnCellCount = this._getAlignByColumnCellCount(groupCellColSpan, options);
            options.isFixed = false;

            startColumnIndex = options.columns.length - alignByFixedColumnCellCount;
            options = extend({}, options, { columns: this.getFixedColumns() });
            transparentColumnIndex = getTransparentColumnIndex(options.columns);

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
        let transparentColumnIndex;

        if(this._isFixedTableRendering) {
            transparentColumnIndex = getTransparentColumnIndex(columns);

            if(columnIndex > transparentColumnIndex) {
                columnIndex += columns[transparentColumnIndex].colspan - 1;
            }

            return columnIndex;
        }

        return this.callBase.apply(this, arguments);
    },

    _renderCore: function(change) {
        this._detachHoverEvents();

        this.callBase(change);

        const isFixedColumns = this._isFixedColumns;

        this.element().toggleClass(FIXED_COLUMNS_CLASS, isFixedColumns);

        if(this.option('hoverStateEnabled') && isFixedColumns) {
            this._attachHoverEvents();
        }
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
        let columns;
        let cellIndex = 0;

        if($fixedTable && $cell.is('td') && $cell.closest($fixedTable).length) {
            columns = this.getFixedColumns();

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

            if(needFocus) {
                $focusedElement = editorFactory.focus();
                $focusedElement && editorFactory.focus($focusedElement);
            }
        }
    },

    setScrollerSpacing: function(vWidth, hWidth) {
        const that = this;
        let useNativeScrolling;
        const styles = { marginBottom: 0 };
        const $fixedContent = that.element().children('.' + this.addWidgetPrefix(CONTENT_FIXED_CLASS));

        if($fixedContent.length && that._fixedTableElement) {
            $fixedContent.css(styles);
            that._fixedTableElement.css(styles);

            styles[that.option('rtlEnabled') ? 'marginLeft' : 'marginRight'] = vWidth;
            styles.marginBottom = hWidth;

            useNativeScrolling = that._scrollable && that._scrollable.option('useNative');
            (useNativeScrolling ? $fixedContent : that._fixedTableElement).css(styles);
        }
    },

    _getElasticScrollTop: function(e) {
        let maxScrollTop;
        let scrollableContent;
        let scrollableContainer;
        let elasticScrollTop = 0;
        const scrollbarWidth = this.getScrollbarWidth(true);

        if(e.scrollOffset.top < 0) {
            elasticScrollTop = -e.scrollOffset.top;
        } else if(e.reachedBottom) {
            scrollableContent = this._findContentElement();
            scrollableContainer = e.component._container();
            maxScrollTop = Math.max(scrollableContent.height() + scrollbarWidth - scrollableContainer.height(), 0);
            elasticScrollTop = maxScrollTop - e.scrollOffset.top;
        }

        return elasticScrollTop;
    },

    _applyElasticScrolling: function(e) {
        if(this._fixedTableElement) {
            const elasticScrollTop = this._getElasticScrollTop(e);

            if(Math.ceil(elasticScrollTop) !== 0) {
                translator.move(this._fixedTableElement, { top: elasticScrollTop });
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

module.exports = {
    defaultOptions: function() {
        return {
            columnFixing: {
                /**
                * @name GridBaseOptions.columnFixing.enabled
                * @type boolean
                * @default false
                */
                enabled: false,
                /**
                 * @name GridBaseOptions.columnFixing.texts
                 * @type object
                 */
                texts: {
                    /**
                     * @name GridBaseOptions.columnFixing.texts.fix
                     * @type string
                     * @default "Fix"
                     */
                    fix: messageLocalization.format('dxDataGrid-columnFixingFix'),
                    /**
                     * @name GridBaseOptions.columnFixing.texts.unfix
                     * @type string
                     * @default "Unfix"
                     */
                    unfix: messageLocalization.format('dxDataGrid-columnFixingUnfix'),
                    /**
                     * @name GridBaseOptions.columnFixing.texts.leftPosition
                     * @type string
                     * @default "To the left"
                     */
                    leftPosition: messageLocalization.format('dxDataGrid-columnFixingLeftPosition'),
                    /**
                     * @name GridBaseOptions.columnFixing.texts.rightPosition
                     * @type string
                     * @default "To the right"
                     */
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
                        let pointsByColumns;
                        const visibleColumns = options.columns;
                        const targetDraggingPanel = options.targetDraggingPanel;

                        if(targetDraggingPanel && targetDraggingPanel.getName() === 'headers' && targetDraggingPanel.isFixedColumns()) {
                            if(options.sourceColumn.fixed) {
                                if(!options.rowIndex) {
                                    options.columnElements = targetDraggingPanel.getFixedColumnElements(0);
                                }
                                options.columns = targetDraggingPanel.getFixedColumns(options.rowIndex);

                                pointsByColumns = this.callBase(options);
                                normalizeColumnIndicesByPoints(visibleColumns, options.columns, pointsByColumns);
                                return pointsByColumns;
                            }
                        }

                        return this.callBase(options);
                    },

                    _pointCreated: function(point, columns, location, sourceColumn) {
                        const result = this.callBase.apply(this, arguments);
                        const $transparentColumn = this._columnHeadersView.getTransparentColumnElement();
                        let boundingRect;


                        if(!result && location === 'headers' && $transparentColumn && $transparentColumn.length) {
                            boundingRect = $transparentColumn.get(0).getBoundingClientRect();

                            if(sourceColumn && sourceColumn.fixed) {
                                return sourceColumn.fixedPosition === 'right' ? point.x < boundingRect.right : point.x > boundingRect.left;
                            } else {
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
                        const cells = that._columnHeadersView.getFixedColumnElements();
                        let pointsByFixedColumns = [];

                        that.callBase();

                        if(cells && cells.length > 0) {
                            pointsByFixedColumns = gridCoreUtils.getPointsByColumns(cells, function(point) {
                                return that._pointCreated(point, cells.length, fixedColumns);
                            });

                            that._pointsByFixedColumns = normalizeColumnIndicesByPoints(columns, fixedColumns, pointsByFixedColumns);
                        }
                    },

                    _pointCreated: function(point, cellsLength, columns) {
                        let currentColumn;
                        let nextColumn;
                        const isWidgetResizingMode = this.option('columnResizingMode') === 'widget';

                        if(point.index > 0 && point.index < cellsLength) {
                            currentColumn = columns[point.columnIndex - 1] || {};
                            nextColumn = columns[point.columnIndex] || {};

                            if(currentColumn.fixed || nextColumn.fixed) {
                                point.columnIndex -= 1;
                                return !((currentColumn.allowResizing || currentColumn.command === COMMAND_TRANSPARENT) && (isWidgetResizingMode || nextColumn.allowResizing || nextColumn.command === COMMAND_TRANSPARENT));
                            }
                        }

                        return this.callBase.apply(this, arguments);
                    },

                    _getTargetPoint: function(pointsByColumns, currentX, deltaX) {
                        const $transparentColumn = this._columnHeadersView.getTransparentColumnElement();
                        let boundingRect;

                        if($transparentColumn && $transparentColumn.length) {
                            boundingRect = $transparentColumn.get(0).getBoundingClientRect();

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
