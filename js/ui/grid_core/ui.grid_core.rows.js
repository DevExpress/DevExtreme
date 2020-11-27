import $ from '../../core/renderer';
import { getWindow, hasWindow } from '../../core/utils/window';
import eventsEngine from '../../events/core/events_engine';
import { deferRender, deferUpdate } from '../../core/utils/common';
import { setHeight } from '../../core/utils/style';
import { isDefined, isNumeric, isString } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import { getBoundingRect, getDefaultAlignment } from '../../core/utils/position';
import { isEmpty } from '../../core/utils/string';
import { compileGetter } from '../../core/utils/data';
import gridCoreUtils from './ui.grid_core.utils';
import { ColumnsView } from './ui.grid_core.columns_view';
import Scrollable from '../scroll_view/ui.scrollable';
import removeEvent from '../../core/remove_event';
import messageLocalization from '../../localization/message';
import browser from '../../core/utils/browser';

const ROWS_VIEW_CLASS = 'rowsview';
const CONTENT_CLASS = 'content';
const NOWRAP_CLASS = 'nowrap';
const GROUP_ROW_CLASS = 'dx-group-row';
const GROUP_CELL_CLASS = 'dx-group-cell';
const DATA_ROW_CLASS = 'dx-data-row';
const FREE_SPACE_CLASS = 'dx-freespace-row';
const ROW_LINES_CLASS = 'dx-row-lines';
const COLUMN_LINES_CLASS = 'dx-column-lines';
const ROW_ALTERNATION_CLASS = 'dx-row-alt';
const LAST_ROW_BORDER = 'dx-last-row-border';
const EMPTY_CLASS = 'dx-empty';
const ROW_INSERTED_ANIMATION_CLASS = 'row-inserted-animation';

const LOADPANEL_HIDE_TIMEOUT = 200;

function getMaxHorizontalScrollOffset(scrollable) {
    return scrollable ? scrollable.scrollWidth() - scrollable.clientWidth() : 0;
}

export default {
    defaultOptions: function() {
        return {
            hoverStateEnabled: false,

            scrolling: {
                useNative: 'auto'
            },

            loadPanel: {
                /**
                 * @name GridBaseOptions.loadPanel.enabled
                 * @type boolean|Enums.Mode
                 * @default "auto"
                 */
                enabled: 'auto',
                /**
                 * @name GridBaseOptions.loadPanel.text
                 * @type string
                 * @default "Loading..."
                 */
                text: messageLocalization.format('Loading'),
                /**
                 * @name GridBaseOptions.loadPanel.width
                 * @type number
                 * @default 200
                 */
                width: 200,
                /**
                 * @name GridBaseOptions.loadPanel.height
                 * @type number
                 * @default 90
                 */
                height: 90,
                /**
                * @name GridBaseOptions.loadPanel.showIndicator
                * @type boolean
                * @default true
                */
                showIndicator: true,

                /**
                * @name GridBaseOptions.loadPanel.indicatorSrc
                * @type string
                * @default ""
                */
                indicatorSrc: '',

                /**
                * @name GridBaseOptions.loadPanel.showPane
                * @type boolean
                * @default true
                */
                showPane: true

                /**
                * @name GridBaseOptions.loadPanel.shading
                * @type boolean
                * @default false
                */

                /**
                * @name GridBaseOptions.loadPanel.shadingColor
                * @type string
                * @default ''
                */
            },
            rowTemplate: null,
            columnAutoWidth: false,
            noDataText: messageLocalization.format('dxDataGrid-noDataText'),
            wordWrapEnabled: false,
            showColumnLines: true,
            showRowLines: false,
            rowAlternationEnabled: false,
            activeStateEnabled: false,
            twoWayBindingEnabled: true
        };
    },
    views: {
        rowsView: ColumnsView.inherit((function() {
            const defaultCellTemplate = function($container, options) {
                const isDataTextEmpty = isEmpty(options.text) && options.rowType === 'data';
                const text = options.text;
                const container = $container.get(0);

                if(isDataTextEmpty) {
                    gridCoreUtils.setEmptyText($container);
                } else if(options.column.encodeHtml) {
                    container.textContent = text;
                } else {
                    container.innerHTML = text;
                }
            };

            const getScrollableBottomPadding = function(that) {
                const scrollable = that.getScrollable();
                return scrollable ? Math.ceil(parseFloat(scrollable.$content().css('paddingBottom'))) : 0;
            };

            return {
                _getDefaultTemplate: function(column) {
                    switch(column.command) {
                        case 'empty':
                            return function(container) {
                                container.html('&nbsp;');
                            };
                        default:
                            return defaultCellTemplate;
                    }
                },

                _getDefaultGroupTemplate: function(column) {
                    const that = this;
                    const summaryTexts = that.option('summary.texts');

                    return function($container, options) {
                        const data = options.data;
                        let text = options.column.caption + ': ' + options.text;
                        const container = $container.get(0);

                        if(options.summaryItems && options.summaryItems.length) {
                            text += ' ' + gridCoreUtils.getGroupRowSummaryText(options.summaryItems, summaryTexts);
                        }

                        if(data) {
                            if(options.groupContinuedMessage && options.groupContinuesMessage) {
                                text += ' (' + options.groupContinuedMessage + '. ' + options.groupContinuesMessage + ')';
                            } else if(options.groupContinuesMessage) {
                                text += ' (' + options.groupContinuesMessage + ')';
                            } else if(options.groupContinuedMessage) {
                                text += ' (' + options.groupContinuedMessage + ')';
                            }
                        }

                        $container.addClass(GROUP_CELL_CLASS);

                        if(column.encodeHtml) {
                            container.textContent = text;
                        } else {
                            container.innerHTML = text;
                        }
                    };
                },

                _update: function() { },

                _getCellTemplate: function(options) {
                    const that = this;
                    const column = options.column;
                    let template;

                    if(options.rowType === 'group' && isDefined(column.groupIndex) && !column.showWhenGrouped && !column.command) {
                        template = column.groupCellTemplate || { allowRenderToDetachedContainer: true, render: that._getDefaultGroupTemplate(column) };
                    } else if((options.rowType === 'data' || column.command) && column.cellTemplate) {
                        template = column.cellTemplate;
                    } else {
                        template = { allowRenderToDetachedContainer: true, render: that._getDefaultTemplate(column) };
                    }

                    return template;
                },

                _createRow: function(row) {
                    const $row = this.callBase(row);

                    if(row) {
                        const isGroup = row.rowType === 'group';
                        const isDataRow = row.rowType === 'data';

                        isDataRow && $row.addClass(DATA_ROW_CLASS);
                        isDataRow && this.option('showRowLines') && $row.addClass(ROW_LINES_CLASS);

                        this.option('showColumnLines') && $row.addClass(COLUMN_LINES_CLASS);

                        if(row.visible === false) {
                            $row.hide();
                        }

                        if(isGroup) {
                            $row.addClass(GROUP_ROW_CLASS);
                            const isRowExpanded = row.isExpanded;
                            this.setAria('role', 'row', $row);
                            this.setAria('expanded', isDefined(isRowExpanded) && isRowExpanded.toString(), $row);
                        }
                    }

                    return $row;
                },

                _rowPrepared: function($row, rowOptions, row) {
                    if(rowOptions.rowType === 'data') {
                        if(this.option('rowAlternationEnabled')) {
                            this._isAltRow(row) && $row.addClass(ROW_ALTERNATION_CLASS);
                            rowOptions.watch && rowOptions.watch(() => this._isAltRow(row), value => {
                                $row.toggleClass(ROW_ALTERNATION_CLASS, value);
                            });
                        }

                        this._setAriaRowIndex(rowOptions, $row);
                        rowOptions.watch && rowOptions.watch(() => rowOptions.rowIndex, () => this._setAriaRowIndex(rowOptions, $row));
                    }

                    this.callBase.apply(this, arguments);
                },

                _setAriaRowIndex: function(row, $row) {
                    const component = this.component;
                    const isPagerMode = component.option('scrolling.mode') === 'standard' && component.option('scrolling.rowRenderingMode') !== 'virtual';
                    let rowIndex = row.rowIndex + 1;

                    if(isPagerMode) {
                        rowIndex = component.pageIndex() * component.pageSize() + rowIndex;
                    } else {
                        rowIndex += this._dataController.getRowIndexOffset();
                    }
                    this.setAria('rowindex', rowIndex, $row);
                },

                _afterRowPrepared: function(e) {
                    const arg = e.args[0];
                    const dataController = this._dataController;
                    const row = dataController.getVisibleRows()[arg.rowIndex];
                    const watch = this.option('integrationOptions.watchMethod');

                    if(!arg.data || arg.rowType !== 'data' || arg.isNewRow || !this.option('twoWayBindingEnabled') || !watch || !row) return;

                    const dispose = watch(
                        () => {
                            return dataController.generateDataValues(arg.data, arg.columns);
                        },
                        () => {
                            dataController.repaintRows([row.rowIndex], this.option('repaintChangesOnly'));
                        },
                        {
                            deep: true,
                            skipImmediate: true
                        }
                    );

                    eventsEngine.on(arg.rowElement, removeEvent, dispose);
                },

                _renderScrollable: function(force) {
                    const that = this;
                    const $element = that.element();

                    if(!$element.children().length) {
                        $element.append('<div>');
                    }
                    if((force || !that._loadPanel)) {
                        that._renderLoadPanel($element, $element.parent(), that._dataController.isLocalStore());
                    }

                    if((force || !that.getScrollable()) && that._dataController.isLoaded()) {
                        const columns = that.getColumns();
                        let allColumnsHasWidth = true;

                        for(let i = 0; i < columns.length; i++) {
                            if(!columns[i].width && !columns[i].minWidth) {
                                allColumnsHasWidth = false;
                                break;
                            }
                        }

                        if(that.option('columnAutoWidth') || that._hasHeight || allColumnsHasWidth || that._columnsController._isColumnFixing()) {
                            that._renderScrollableCore($element);
                        }
                    }
                },

                _handleScroll: function(e) {
                    const that = this;
                    const rtlEnabled = that.option('rtlEnabled');

                    that._isScrollByEvent = !!e.event;
                    that._scrollTop = e.scrollOffset.top;
                    that._scrollLeft = e.scrollOffset.left;
                    if(rtlEnabled) {
                        this._scrollRight = getMaxHorizontalScrollOffset(e.component) - this._scrollLeft;
                    }
                    that.scrollChanged.fire(e.scrollOffset, that.name);
                },

                _renderScrollableCore: function($element) {
                    const that = this;
                    const dxScrollableOptions = that._createScrollableOptions();
                    const scrollHandler = that._handleScroll.bind(that);

                    dxScrollableOptions.onScroll = scrollHandler;
                    dxScrollableOptions.onStop = scrollHandler;

                    that._scrollable = that._createComponent($element, Scrollable, dxScrollableOptions);
                    that._scrollableContainer = that._scrollable && that._scrollable._$container;
                },

                _renderLoadPanel: gridCoreUtils.renderLoadPanel,

                _renderContent: function(contentElement, tableElement) {
                    contentElement.empty().append(tableElement);

                    return this._findContentElement();
                },

                _updateContent: function(newTableElement, change) {
                    const that = this;
                    const tableElement = that._getTableElement();
                    const contentElement = that._findContentElement();
                    const changeType = change && change.changeType;
                    const executors = [];
                    const highlightChanges = this.option('highlightChanges');
                    const rowInsertedClass = this.addWidgetPrefix(ROW_INSERTED_ANIMATION_CLASS);

                    switch(changeType) {
                        case 'update':
                            each(change.rowIndices, function(index, rowIndex) {
                                const $newRowElement = that._getRowElements(newTableElement).eq(index);
                                const changeType = change.changeTypes && change.changeTypes[index];
                                const item = change.items && change.items[index];

                                executors.push(function() {
                                    const $rowsElement = that._getRowElements();
                                    const $rowElement = $rowsElement.eq(rowIndex);

                                    switch(changeType) {
                                        case 'update':
                                            if(item) {
                                                const columnIndices = change.columnIndices && change.columnIndices[index];
                                                if(isDefined(item.visible) && item.visible !== $rowElement.is(':visible')) {
                                                    $rowElement.toggle(item.visible);
                                                } else if(columnIndices) {
                                                    that._updateCells($rowElement, $newRowElement, columnIndices);
                                                } else {
                                                    $rowElement.replaceWith($newRowElement);
                                                }
                                            }
                                            break;
                                        case 'insert':
                                            if(!$rowsElement.length) {
                                                if(tableElement) {
                                                    const target = $newRowElement.is('tbody') ? tableElement : tableElement.children('tbody');
                                                    $newRowElement.prependTo(target);
                                                }
                                            } else if($rowElement.length) {
                                                $newRowElement.insertBefore($rowElement);
                                            } else {
                                                $newRowElement.insertAfter($rowsElement.last());
                                            }
                                            if(highlightChanges && change.isLiveUpdate) {
                                                $newRowElement.addClass(rowInsertedClass);
                                            }
                                            break;
                                        case 'remove':
                                            $rowElement.remove();
                                            break;
                                    }
                                });
                            });
                            each(executors, function() {
                                this();
                            });

                            newTableElement.remove();
                            break;
                        default:
                            that._setTableElement(newTableElement);
                            contentElement.addClass(that.addWidgetPrefix(CONTENT_CLASS));
                            that._renderContent(contentElement, newTableElement);
                            break;
                    }
                },

                _createEmptyRow: function(className, isFixed, height) {
                    const that = this;
                    let $cell;
                    const $row = that._createRow();
                    const columns = isFixed ? this.getFixedColumns() : this.getColumns();

                    $row
                        .addClass(className)
                        .toggleClass(COLUMN_LINES_CLASS, that.option('showColumnLines'));

                    for(let i = 0; i < columns.length; i++) {
                        $cell = that._createCell({ column: columns[i], rowType: 'freeSpace', columnIndex: i, columns: columns });
                        isNumeric(height) && $cell.css('height', height);

                        $row.append($cell);
                    }

                    that.setAria('role', 'presentation', $row);

                    return $row;
                },

                _appendEmptyRow: function($table, $emptyRow, location) {
                    const $tBodies = this._getBodies($table);
                    const isTableContainer = !$tBodies.length || $emptyRow.is('tbody');
                    const $container = isTableContainer ? $table : $tBodies;

                    if(location === 'top') {
                        $container.first().prepend($emptyRow);
                        if(isTableContainer) {
                            const $colgroup = $container.children('colgroup');
                            $container.prepend($colgroup);
                        }
                    } else {
                        $container.last().append($emptyRow);
                    }
                },

                _renderFreeSpaceRow: function($tableElement) {
                    let $freeSpaceRowElement = this._createEmptyRow(FREE_SPACE_CLASS);

                    $freeSpaceRowElement = this._wrapRowIfNeed($tableElement, $freeSpaceRowElement);

                    this._appendEmptyRow($tableElement, $freeSpaceRowElement);
                },

                _checkRowKeys: function(options) {
                    const that = this;
                    const rows = that._getRows(options);
                    const keyExpr = that._dataController.store() && that._dataController.store().key();

                    keyExpr && rows.some(function(row) {
                        if(row.rowType === 'data' && row.key === undefined) {
                            that._dataController.fireError('E1046', keyExpr);
                            return true;
                        }
                    });
                },

                _needUpdateRowHeight: function(itemsCount) {
                    return itemsCount > 0 && !this._rowHeight;
                },

                _getRowsHeight: function($tableElement) {
                    const $rowElements = $tableElement.children('tbody').children().not('.dx-virtual-row').not('.' + FREE_SPACE_CLASS);

                    return $rowElements.toArray().reduce(function(sum, row) {
                        return sum + getBoundingRect(row).height;
                    }, 0);
                },

                _updateRowHeight: function() {
                    const that = this;
                    const $tableElement = that._getTableElement();
                    const itemsCount = that._dataController.items().length;

                    if($tableElement && that._needUpdateRowHeight(itemsCount)) {
                        const rowsHeight = that._getRowsHeight($tableElement);
                        that._rowHeight = rowsHeight / itemsCount;
                    }
                },

                _findContentElement: function() {
                    let $content = this.element();
                    const scrollable = this.getScrollable();

                    if($content) {
                        if(scrollable) {
                            $content = scrollable.$content();
                        }
                        return $content.children().first();
                    }
                },

                _getRowElements: function(tableElement) {
                    const $rows = this.callBase(tableElement);

                    return $rows && $rows.not('.' + FREE_SPACE_CLASS);
                },

                _getFreeSpaceRowElements: function($table) {
                    const tableElements = $table || this.getTableElements();

                    return tableElements && tableElements.children('tbody').children('.' + FREE_SPACE_CLASS);
                },

                _getNoDataText: function() {
                    return this.option('noDataText');
                },

                _rowClick: function(e) {
                    const item = this._dataController.items()[e.rowIndex] || {};
                    this.executeAction('onRowClick', extend({
                        evaluate: function(expr) {
                            const getter = compileGetter(expr);
                            return getter(item.data);
                        }
                    }, e, item));
                },

                _rowDblClick: function(e) {
                    const item = this._dataController.items()[e.rowIndex] || {};
                    this.executeAction('onRowDblClick', extend({}, e, item));
                },

                _getColumnsCountBeforeGroups: function(columns) {
                    for(let i = 0; i < columns.length; i++) {
                        if(columns[i].type === 'groupExpand') {
                            return i;
                        }
                    }

                    return 0;
                },

                _getGroupCellOptions: function(options) {
                    const columnsCountBeforeGroups = this._getColumnsCountBeforeGroups(options.columns);
                    const columnIndex = (options.row.groupIndex || 0) + columnsCountBeforeGroups;

                    return {
                        columnIndex: columnIndex,
                        colspan: options.columns.length - columnIndex - 1
                    };
                },

                _renderCells: function($row, options) {
                    if(options.row.rowType === 'group') {
                        this._renderGroupedCells($row, options);
                    } else if(options.row.values) {
                        this.callBase($row, options);
                    }
                },

                _renderGroupedCells: function($row, options) {
                    const row = options.row;
                    let expandColumn;
                    const columns = options.columns;
                    const rowIndex = row.rowIndex;
                    let isExpanded;
                    const groupCellOptions = this._getGroupCellOptions(options);

                    for(let i = 0; i <= groupCellOptions.columnIndex; i++) {
                        if(i === groupCellOptions.columnIndex && columns[i].allowCollapsing && options.scrollingMode !== 'infinite') {
                            isExpanded = !!row.isExpanded;
                            expandColumn = columns[i];
                        } else {
                            isExpanded = null;
                            expandColumn = {
                                command: 'expand',
                                cssClass: columns[i].cssClass
                            };
                        }

                        this._renderCell($row, {
                            value: isExpanded,
                            row: row,
                            rowIndex: rowIndex,
                            column: expandColumn,
                            columnIndex: i
                        });
                    }

                    const groupColumnAlignment = getDefaultAlignment(this.option('rtlEnabled'));

                    const groupColumn = extend(
                        {},
                        columns[groupCellOptions.columnIndex],
                        {
                            command: null,
                            cssClass: null,
                            width: null,
                            showWhenGrouped: false,
                            alignment: groupColumnAlignment
                        }
                    );

                    if(groupCellOptions.colspan > 1) {
                        groupColumn.colspan = groupCellOptions.colspan;
                    }

                    this._renderCell($row, {
                        value: row.values[row.groupIndex],
                        row: row,
                        rowIndex: rowIndex,
                        column: groupColumn,
                        columnIndex: groupCellOptions.columnIndex
                    });
                },

                _renderRows: function($table, options) {
                    const that = this;
                    const scrollingMode = that.option('scrolling.mode');

                    that.callBase($table, extend({
                        scrollingMode: scrollingMode
                    }, options));

                    that._checkRowKeys(options.change);

                    that._renderFreeSpaceRow($table);
                    if(!that._hasHeight) {
                        that.updateFreeSpaceRowHeight($table);
                    }
                },

                _renderRow: function($table, options) {
                    const that = this;
                    const row = options.row;
                    const rowTemplate = that.option('rowTemplate');

                    if((row.rowType === 'data' || row.rowType === 'group') && !isDefined(row.groupIndex) && rowTemplate) {
                        that.renderTemplate($table, rowTemplate, extend({ columns: options.columns }, row), true);
                    } else {
                        that.callBase($table, options);
                    }
                },

                _renderTable: function(options) {
                    const that = this;
                    const $table = that.callBase(options);
                    const resizeCompletedHandler = function() {
                        const scrollableInstance = that.getScrollable();
                        if(scrollableInstance && that.element().closest(getWindow().document).length) {
                            that.resizeCompleted.remove(resizeCompletedHandler);
                            scrollableInstance._visibilityChanged(true);
                        }
                    };

                    if(!isDefined(that._getTableElement())) {
                        that._setTableElement($table);
                        that._renderScrollable(true);
                        that.resizeCompleted.add(resizeCompletedHandler);
                    } else {
                        that._renderScrollable();
                    }

                    return $table;
                },

                _createTable: function() {
                    const $table = this.callBase.apply(this, arguments);

                    if(this.option('rowTemplate')) {
                        $table.appendTo(this.component.$element());
                    }

                    return $table;
                },

                _renderCore: function(change) {
                    const that = this;
                    const $element = that.element();

                    $element.addClass(that.addWidgetPrefix(ROWS_VIEW_CLASS)).toggleClass(that.addWidgetPrefix(NOWRAP_CLASS), !that.option('wordWrapEnabled'));
                    $element.toggleClass(EMPTY_CLASS, that._dataController.items().length === 0);

                    that.setAria('role', 'presentation', $element);

                    const $table = that._renderTable({ change: change });
                    that._updateContent($table, change);

                    that.callBase(change);

                    that._lastColumnWidths = null;
                },

                _getRows: function(change) {
                    return change && change.items || this._dataController.items();
                },

                _getCellOptions: function(options) {
                    const that = this;
                    const column = options.column;
                    const row = options.row;
                    const data = row.data;
                    const summaryCells = row && row.summaryCells;
                    const value = options.value;
                    const displayValue = gridCoreUtils.getDisplayValue(column, value, data, row.rowType);

                    const parameters = this.callBase(options);
                    parameters.value = value;
                    parameters.oldValue = options.oldValue;
                    parameters.displayValue = displayValue;
                    parameters.row = row;
                    parameters.key = row.key;
                    parameters.data = data;
                    parameters.rowType = row.rowType;
                    parameters.values = row.values;
                    parameters.text = !column.command ? gridCoreUtils.formatValue(displayValue, column) : '';
                    parameters.rowIndex = row.rowIndex;
                    parameters.summaryItems = summaryCells && summaryCells[options.columnIndex];
                    parameters.resized = column.resizedCallbacks;

                    if(isDefined(column.groupIndex) && !column.command) {
                        const groupingTextsOptions = that.option('grouping.texts');
                        const scrollingMode = that.option('scrolling.mode');
                        if(scrollingMode !== 'virtual' && scrollingMode !== 'infinite') {
                            parameters.groupContinuesMessage = data && data.isContinuationOnNextPage && groupingTextsOptions && groupingTextsOptions.groupContinuesMessage;
                            parameters.groupContinuedMessage = data && data.isContinuation && groupingTextsOptions && groupingTextsOptions.groupContinuedMessage;
                        }
                    }

                    return parameters;
                },

                _setRowsOpacityCore: function($rows, visibleColumns, columnIndex, value) {
                    const columnsController = this._columnsController;
                    const columns = columnsController.getColumns();
                    const column = columns && columns[columnIndex];
                    const columnID = column && column.isBand && column.index;

                    each($rows, function(rowIndex, row) {
                        if(!$(row).hasClass(GROUP_ROW_CLASS)) {
                            for(let i = 0; i < visibleColumns.length; i++) {
                                if(isNumeric(columnID) && columnsController.isParentBandColumn(visibleColumns[i].index, columnID) || visibleColumns[i].index === columnIndex) {
                                    $rows.eq(rowIndex).children().eq(i).css({ opacity: value });
                                    if(!isNumeric(columnID)) {
                                        break;
                                    }
                                }
                            }
                        }
                    });
                },

                _getDevicePixelRatio: function() {
                    return getWindow().devicePixelRatio;
                },

                renderNoDataText: gridCoreUtils.renderNoDataText,

                getCellOptions: function(rowIndex, columnIdentifier) {
                    const rowOptions = this._dataController.items()[rowIndex];
                    let cellOptions;
                    let column;

                    if(rowOptions) {
                        if(isString(columnIdentifier)) {
                            column = this._columnsController.columnOption(columnIdentifier);
                        } else {
                            column = this._columnsController.getVisibleColumns()[columnIdentifier];
                        }

                        if(column) {
                            cellOptions = this._getCellOptions({
                                value: column.calculateCellValue(rowOptions.data),
                                rowIndex: rowOptions.rowIndex,
                                row: rowOptions,
                                column: column
                            });
                        }
                    }
                    return cellOptions;
                },

                getRow: function(index) {
                    if(index >= 0) {
                        const rows = this._getRowElements();

                        if(rows.length > index) {
                            return $(rows[index]);
                        }
                    }
                },

                updateFreeSpaceRowHeight: function($table) {
                    const dataController = this._dataController;
                    const itemCount = dataController.items(true).length;
                    const contentElement = this._findContentElement();
                    const freeSpaceRowElements = this._getFreeSpaceRowElements($table);

                    if(freeSpaceRowElements && contentElement && dataController.totalCount() >= 0) {
                        let isFreeSpaceRowVisible = false;

                        if(itemCount > 0) {
                            if(!this._hasHeight) {
                                const freeSpaceRowCount = dataController.pageSize() - itemCount;
                                const scrollingMode = this.option('scrolling.mode');

                                if(freeSpaceRowCount > 0 && dataController.pageCount() > 1 && scrollingMode !== 'virtual' && scrollingMode !== 'infinite') {
                                    setHeight(freeSpaceRowElements, freeSpaceRowCount * this._rowHeight);
                                    isFreeSpaceRowVisible = true;
                                }
                                if(!isFreeSpaceRowVisible && $table) {
                                    setHeight(freeSpaceRowElements, 0);
                                } else {
                                    freeSpaceRowElements.toggle(isFreeSpaceRowVisible);
                                }
                                this._updateLastRowBorder(isFreeSpaceRowVisible);
                            } else {
                                freeSpaceRowElements.hide();
                                deferUpdate(() => {
                                    const scrollbarWidth = this.getScrollbarWidth(true);
                                    const elementHeightWithoutScrollbar = this.element().height() - scrollbarWidth;
                                    const contentHeight = contentElement.outerHeight();
                                    const showFreeSpaceRow = (elementHeightWithoutScrollbar - contentHeight) > 0;
                                    const rowsHeight = this._getRowsHeight(contentElement.children().first());
                                    const $tableElement = $table || this.getTableElements();
                                    const borderTopWidth = Math.ceil(parseFloat($tableElement.css('borderTopWidth')));
                                    const heightCorrection = this._getHeightCorrection();
                                    const resultHeight = elementHeightWithoutScrollbar - rowsHeight - borderTopWidth - heightCorrection;

                                    if(showFreeSpaceRow) {
                                        deferRender(() => {
                                            freeSpaceRowElements.css('height', resultHeight);
                                            isFreeSpaceRowVisible = true;
                                            freeSpaceRowElements.show();
                                        });
                                    }
                                    deferRender(() => this._updateLastRowBorder(isFreeSpaceRowVisible));
                                });
                            }
                        } else {
                            freeSpaceRowElements.css('height', 0);
                            freeSpaceRowElements.show();
                            this._updateLastRowBorder(true);
                        }
                    }
                },

                _getHeightCorrection: function() {
                    const isZoomedWebkit = browser.webkit && this._getDevicePixelRatio() >= 2; // T606935
                    const hasExtraBorderTop = browser.mozilla && browser.version >= 70 && !this.option('showRowLines');
                    return isZoomedWebkit || hasExtraBorderTop ? 1 : 0;
                },

                _columnOptionChanged: function(e) {
                    const optionNames = e.optionNames;

                    if(e.changeTypes.grouping) return;

                    if(optionNames.width || optionNames.visibleWidth) {
                        this.callBase(e);
                        this._fireColumnResizedCallbacks();
                    }
                },

                getScrollable: function() {
                    return this._scrollable;
                },

                init: function() {
                    const that = this;
                    const dataController = that.getController('data');

                    that.callBase();
                    that._editorFactoryController = that.getController('editorFactory');
                    that._rowHeight = 0;
                    that._scrollTop = 0;
                    that._scrollLeft = -1;
                    that._scrollRight = 0;
                    that._hasHeight = false;
                    dataController.loadingChanged.add(function(isLoading, messageText) {
                        that.setLoading(isLoading, messageText);
                    });

                    dataController.dataSourceChanged.add(function() {
                        if(that._scrollLeft >= 0) {
                            that._handleScroll({
                                component: that.getScrollable(),
                                scrollOffset: { top: that._scrollTop, left: that._scrollLeft } });
                        }
                    });
                },

                _handleDataChanged: function(change) {
                    const that = this;

                    switch(change.changeType) {
                        case 'refresh':
                        case 'prepend':
                        case 'append':
                        case 'update':
                            that.render(null, change);
                            break;
                        default:
                            that._update(change);
                            break;
                    }
                },

                publicMethods: function() {
                    return ['isScrollbarVisible', 'getTopVisibleRowData', 'getScrollbarWidth', 'getCellElement', 'getRowElement', 'getScrollable'];
                },

                contentWidth: function() {
                    return this.element().width() - this.getScrollbarWidth();
                },

                getScrollbarWidth: function(isHorizontal) {
                    const scrollableContainer = this._scrollableContainer && this._scrollableContainer.get(0);
                    let scrollbarWidth = 0;

                    if(scrollableContainer) {
                        if(!isHorizontal) {
                            scrollbarWidth = scrollableContainer.clientWidth ? scrollableContainer.offsetWidth - scrollableContainer.clientWidth : 0;
                        } else {
                            scrollbarWidth = scrollableContainer.clientHeight ? scrollableContainer.offsetHeight - scrollableContainer.clientHeight : 0;
                            scrollbarWidth += getScrollableBottomPadding(this); // T703649, T697699
                        }
                    }
                    return scrollbarWidth > 0 ? scrollbarWidth : 0;
                },

                // TODO remove this call, move _fireColumnResizedCallbacks functionality to columnsController
                _fireColumnResizedCallbacks: function() {
                    const that = this;
                    const lastColumnWidths = that._lastColumnWidths || [];
                    const columnWidths = [];
                    const columns = that.getColumns();

                    for(let i = 0; i < columns.length; i++) {
                        columnWidths[i] = columns[i].visibleWidth;
                        if(columns[i].resizedCallbacks && !isDefined(columns[i].groupIndex) && lastColumnWidths[i] !== columnWidths[i]) {
                            columns[i].resizedCallbacks.fire(columnWidths[i]);
                        }
                    }

                    that._lastColumnWidths = columnWidths;
                },

                _updateLastRowBorder: function(isFreeSpaceRowVisible) {
                    if(this.option('showBorders') && this.option('showRowLines') && !isFreeSpaceRowVisible) {
                        this.element().addClass(LAST_ROW_BORDER);
                    } else {
                        this.element().removeClass(LAST_ROW_BORDER);
                    }
                },

                _updateScrollable: function() {
                    const dxScrollable = Scrollable.getInstance(this.element());

                    if(dxScrollable) {
                        dxScrollable.update();
                        this._updateHorizontalScrollPosition();
                    }
                },

                _updateHorizontalScrollPosition: function() {
                    const scrollable = this.getScrollable();
                    const scrollLeft = scrollable && scrollable.scrollOffset().left;
                    const rtlEnabled = this.option('rtlEnabled');

                    if(rtlEnabled) {
                        const maxHorizontalScrollOffset = getMaxHorizontalScrollOffset(scrollable);
                        const scrollRight = maxHorizontalScrollOffset - scrollLeft;
                        if(scrollRight !== this._scrollRight) {
                            this._scrollLeft = maxHorizontalScrollOffset - this._scrollRight;
                        }
                    }

                    if(this._scrollLeft >= 0 && scrollLeft !== this._scrollLeft) {
                        scrollable.scrollTo({ x: this._scrollLeft });
                    }
                },

                _resizeCore: function() {
                    const that = this;

                    that._fireColumnResizedCallbacks();
                    that._updateRowHeight();

                    deferRender(function() {
                        that._renderScrollable();
                        that.renderNoDataText();
                        that.updateFreeSpaceRowHeight();
                        deferUpdate(function() {
                            that._updateScrollable();
                        });
                    });
                },

                scrollTo: function(location) {
                    const $element = this.element();
                    const dxScrollable = $element && Scrollable.getInstance($element);

                    if(dxScrollable) {
                        dxScrollable.scrollTo(location);
                    }
                },

                height: function(height, hasHeight) {
                    const that = this;
                    const $element = this.element();

                    if(arguments.length === 0) {
                        return $element ? $element.outerHeight(true) : 0;
                    }

                    that._hasHeight = hasHeight === undefined ? height !== 'auto' : hasHeight;

                    if(isDefined(height) && $element) {
                        setHeight($element, height);
                    }
                },

                setLoading: function(isLoading, messageText) {
                    const that = this;
                    let loadPanel = that._loadPanel;
                    const dataController = that._dataController;
                    const loadPanelOptions = that.option('loadPanel') || {};
                    const animation = dataController.isLoaded() ? loadPanelOptions.animation : null;
                    const $element = that.element();

                    if(!hasWindow()) {
                        return;
                    }

                    if(!loadPanel && messageText !== undefined && dataController.isLocalStore() && loadPanelOptions.enabled === 'auto' && $element) {
                        that._renderLoadPanel($element, $element.parent());
                        loadPanel = that._loadPanel;
                    }
                    if(loadPanel) {
                        const visibilityOptions = {
                            message: messageText || loadPanelOptions.text,
                            animation: animation,
                            visible: isLoading
                        };
                        clearTimeout(that._hideLoadingTimeoutID);
                        if(loadPanel.option('visible') && !isLoading) {
                            that._hideLoadingTimeoutID = setTimeout(function() {
                                loadPanel.option(visibilityOptions);
                            }, LOADPANEL_HIDE_TIMEOUT);
                        } else {
                            loadPanel.option(visibilityOptions);
                        }
                    }
                },

                setRowsOpacity: function(columnIndex, value) {
                    const $rows = this._getRowElements().not('.' + GROUP_ROW_CLASS) || [];
                    this._setRowsOpacityCore($rows, this.getColumns(), columnIndex, value);
                },

                _getCellElementsCore: function(rowIndex) {
                    const $cells = this.callBase(rowIndex);

                    if($cells) {
                        const groupCellIndex = $cells.filter('.' + GROUP_CELL_CLASS).index();
                        if(groupCellIndex >= 0 && $cells.length > groupCellIndex + 1) {
                            return $cells.slice(0, groupCellIndex + 1);
                        }
                    }
                    return $cells;
                },

                getTopVisibleItemIndex: function(isFloor) {
                    const that = this;
                    let itemIndex = 0;
                    let prevOffsetTop = 0;
                    let offsetTop = 0;
                    const scrollPosition = that._scrollTop;
                    const $contentElement = that._findContentElement();
                    const contentElementOffsetTop = $contentElement && $contentElement.offset().top;
                    const items = that._dataController.items();
                    const tableElement = that._getTableElement();

                    if(items.length && tableElement) {
                        const rowElements = that._getRowElements(tableElement).filter(':visible');

                        for(itemIndex = 0; itemIndex < items.length; itemIndex++) {
                            prevOffsetTop = offsetTop;
                            const rowElement = rowElements.eq(itemIndex);
                            if(rowElement.length) {
                                offsetTop = rowElement.offset().top - contentElementOffsetTop;
                                if(offsetTop > scrollPosition) {
                                    if(itemIndex) {
                                        if(isFloor || scrollPosition * 2 < Math.round(offsetTop + prevOffsetTop)) {
                                            itemIndex--;
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                        if(itemIndex && itemIndex === items.length) {
                            itemIndex--;
                        }
                    }

                    return itemIndex;
                },

                getTopVisibleRowData: function() {
                    const itemIndex = this.getTopVisibleItemIndex();
                    const items = this._dataController.items();

                    if(items[itemIndex]) {
                        return items[itemIndex].data;
                    }
                },

                _scrollToElement: function($element, offset) {
                    const scrollable = this.getScrollable();
                    scrollable && scrollable.scrollToElement($element, offset);
                },

                optionChanged: function(args) {
                    const that = this;

                    that.callBase(args);

                    switch(args.name) {
                        case 'wordWrapEnabled':
                        case 'showColumnLines':
                        case 'showRowLines':
                        case 'rowAlternationEnabled':
                        case 'rowTemplate':
                        case 'twoWayBindingEnabled':
                            that._invalidate(true, true);
                            args.handled = true;
                            break;
                        case 'scrolling':
                            that._rowHeight = null;
                            that._tableElement = null;
                            args.handled = true;
                            break;
                        case 'rtlEnabled':
                            that._rowHeight = null;
                            that._tableElement = null;
                            break;
                        case 'loadPanel':
                            that._tableElement = null;
                            that._invalidate(true, args.fullName !== 'loadPanel.enabled');
                            args.handled = true;
                            break;
                        case 'noDataText':
                            that.renderNoDataText();
                            args.handled = true;
                            break;
                    }
                },

                dispose: function() {
                    clearTimeout(this._hideLoadingTimeoutID);
                    this._scrollable && this._scrollable.dispose();
                },

                setScrollerSpacing: function() { }
            };
        })())
    }
};
/**
 * @name dxDataGridRowObject
 * @type object
 */
/**
 * @name dxTreeListRowObject
 * @type object
 */


