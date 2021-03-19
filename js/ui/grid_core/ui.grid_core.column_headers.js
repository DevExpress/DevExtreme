import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import { ColumnsView } from './ui.grid_core.columns_view';
import messageLocalization from '../../localization/message';
import { isDefined } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import { registerKeyboardAction } from './ui.grid_core.accessibility';

const CELL_CONTENT_CLASS = 'text-content';
const HEADERS_CLASS = 'headers';
const NOWRAP_CLASS = 'nowrap';
const ROW_CLASS_SELECTOR = '.dx-row';
const HEADER_ROW_CLASS = 'dx-header-row';
const COLUMN_LINES_CLASS = 'dx-column-lines';
const CONTEXT_MENU_SORT_ASC_ICON = 'context-menu-sort-asc';
const CONTEXT_MENU_SORT_DESC_ICON = 'context-menu-sort-desc';
const CONTEXT_MENU_SORT_NONE_ICON = 'context-menu-sort-none';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
const VISIBILITY_HIDDEN_CLASS = 'dx-visibility-hidden';
const TEXT_CONTENT_ALIGNMENT_CLASS_PREFIX = 'dx-text-content-alignment-';
const SORT_INDICATOR_CLASS = 'dx-sort-indicator';
const SORT_INDEX_INDICATOR_CLASS = 'dx-sort-index-indicator';
const HEADER_FILTER_CLASS_SELECTOR = '.dx-header-filter';
const HEADER_FILTER_INDICATOR_CLASS = 'dx-header-filter-indicator';
const MULTI_ROW_HEADER_CLASS = 'dx-header-multi-row';

export default {
    defaultOptions: function() {
        return {
            showColumnHeaders: true,
            cellHintEnabled: true
        };
    },
    views: {
        columnHeadersView: ColumnsView.inherit((function() {
            const createCellContent = function(that, $cell, options) {
                const $cellContent = $('<div>').addClass(that.addWidgetPrefix(CELL_CONTENT_CLASS));

                that.setAria('role', 'presentation', $cellContent);

                addCssClassesToCellContent(that, $cell, options.column, $cellContent);
                const showColumnLines = that.option('showColumnLines');
                const contentAlignment = that.getController('columns').getHeaderContentAlignment(options.column.alignment);

                return $cellContent[(showColumnLines || contentAlignment === 'right') ? 'appendTo' : 'prependTo']($cell);
            };

            function addCssClassesToCellContent(that, $cell, column, $cellContent) {
                const $indicatorElements = that._getIndicatorElements($cell, true);
                const $visibleIndicatorElements = that._getIndicatorElements($cell);
                const indicatorCount = $indicatorElements && $indicatorElements.length;
                const columnAlignment = that._getColumnAlignment(column.alignment);

                const sortIndicatorClassName = `.${that._getIndicatorClassName('sort')}`;
                const sortIndexIndicatorClassName = `.${that._getIndicatorClassName('sortIndex')}`;

                const $sortIndicator = $visibleIndicatorElements.filter(sortIndicatorClassName);
                const $sortIndexIndicator = $visibleIndicatorElements.children().filter(sortIndexIndicatorClassName);

                $cellContent = $cellContent || $cell.children('.' + that.addWidgetPrefix(CELL_CONTENT_CLASS));

                $cellContent
                    .toggleClass(TEXT_CONTENT_ALIGNMENT_CLASS_PREFIX + columnAlignment, indicatorCount > 0)
                    .toggleClass(TEXT_CONTENT_ALIGNMENT_CLASS_PREFIX + (columnAlignment === 'left' ? 'right' : 'left'), indicatorCount > 0 && column.alignment === 'center')
                    .toggleClass(SORT_INDICATOR_CLASS, !!$sortIndicator.length)
                    .toggleClass(SORT_INDEX_INDICATOR_CLASS, !!$sortIndexIndicator.length)
                    .toggleClass(HEADER_FILTER_INDICATOR_CLASS, !!$visibleIndicatorElements.filter('.' + that._getIndicatorClassName('headerFilter')).length);
            }

            return {
                _createTable: function() {
                    const $table = this.callBase.apply(this, arguments);

                    eventsEngine.on($table, 'mousedown selectstart', this.createAction(function(e) {
                        const event = e.event;

                        if(event.shiftKey) {
                            event.preventDefault();
                        }
                    }));

                    return $table;
                },

                _isLegacyKeyboardNavigation() {
                    return this.option('useLegacyKeyboardNavigation');
                },

                _getDefaultTemplate: function(column) {
                    const that = this;

                    return function($container, options) {
                        const $content = column.command ? $container : createCellContent(that, $container, options);
                        const caption = column.command !== 'expand' && column.caption;

                        if(caption) {
                            $content.text(caption);
                        } else if(column.command) {
                            $container.html('&nbsp;');
                        }
                    };
                },

                _getHeaderTemplate: function(column) {
                    return column.headerCellTemplate || { allowRenderToDetachedContainer: true, render: this._getDefaultTemplate(column) };
                },

                _processTemplate: function(template, options) {
                    const that = this;
                    let resultTemplate;
                    const column = options.column;
                    const renderingTemplate = that.callBase(template);

                    if(options.rowType === 'header' && renderingTemplate && column.headerCellTemplate && !column.command) {
                        resultTemplate = {
                            render: function(options) {
                                const $content = createCellContent(that, options.container, options.model);
                                renderingTemplate.render(extend({}, options, { container: $content }));
                            }
                        };
                    } else {
                        resultTemplate = renderingTemplate;
                    }

                    return resultTemplate;
                },

                _handleDataChanged: function(e) {
                    if(e.changeType !== 'refresh') return;

                    if(this._isGroupingChanged || this._requireReady) {
                        this._isGroupingChanged = false;
                        this.render();
                    }
                },

                _renderCell: function($row, options) {
                    const $cell = this.callBase($row, options);

                    if(options.row.rowType === 'header') {
                        $cell.addClass(CELL_FOCUS_DISABLED_CLASS);
                        if(!this._isLegacyKeyboardNavigation()) {
                            if(options.column && !options.column.type) {
                                $cell.attr('tabindex', this.option('tabindex') || 0);
                            }
                        }
                    }

                    return $cell;
                },

                _setCellAriaAttributes: function($cell, cellOptions) {
                    this.callBase($cell, cellOptions);
                    if(cellOptions.rowType === 'header') {
                        this.setAria('role', 'columnheader', $cell);
                        if(cellOptions.column && !cellOptions.column.command && !cellOptions.column.isBand) {
                            $cell.attr('id', cellOptions.column.headerId);
                            this.setAria('label',
                                messageLocalization.format('dxDataGrid-ariaColumn') + ' ' + cellOptions.column.caption,
                                $cell);
                        }
                    }
                },

                _createRow: function(row) {
                    const $row = this.callBase(row).toggleClass(COLUMN_LINES_CLASS, this.option('showColumnLines'));

                    if(row.rowType === 'header') {
                        $row.addClass(HEADER_ROW_CLASS);
                        if(!this._isLegacyKeyboardNavigation()) {
                            registerKeyboardAction('columnHeaders', this, $row, 'td', this._handleActionKeyDown.bind(this));
                        }
                    }

                    return $row;
                },

                _handleActionKeyDown: function(args) {
                    const event = args.event;
                    const $target = $(event.target);

                    this._lastActionElement = event.target;

                    if($target.is(HEADER_FILTER_CLASS_SELECTOR)) {
                        const headerFilterController = this.getController('headerFilter');
                        const $column = $target.closest('td');
                        const columnIndex = this.getColumnIndexByElement($column);
                        if(columnIndex >= 0) {
                            headerFilterController.showHeaderFilterMenu(columnIndex, false);
                        }
                    } else {
                        const $row = $target.closest(ROW_CLASS_SELECTOR);
                        this._processHeaderAction(event, $row);
                    }

                    event.preventDefault();
                },

                _renderCore: function() {
                    const that = this;
                    const $container = that.element();

                    if(that._tableElement && !that._dataController.isLoaded() && !that._hasRowElements) {
                        return;
                    }

                    $container
                        .addClass(that.addWidgetPrefix(HEADERS_CLASS))
                        .toggleClass(that.addWidgetPrefix(NOWRAP_CLASS), !that.option('wordWrapEnabled'))
                        .empty();

                    that.setAria('role', 'presentation', $container);

                    that._updateContent(that._renderTable());

                    if(that.getRowCount() > 1) {
                        $container.addClass(MULTI_ROW_HEADER_CLASS);
                    }

                    that.callBase.apply(that, arguments);
                },

                _renderRows: function() {
                    const that = this;

                    if(that._dataController.isLoaded() || that._hasRowElements) {
                        that.callBase.apply(that, arguments);
                        that._hasRowElements = true;
                    }
                },

                _getRowVisibleColumns: function(rowIndex) {
                    return this._columnsController.getVisibleColumns(rowIndex);
                },

                _renderRow: function($table, options) {
                    options.columns = this._getRowVisibleColumns(options.row.rowIndex);
                    this.callBase($table, options);
                },

                _createCell: function(options) {
                    const column = options.column;
                    const $cellElement = this.callBase.apply(this, arguments);

                    column.rowspan > 1 && options.rowType === 'header' && $cellElement.attr('rowSpan', column.rowspan);

                    return $cellElement;
                },

                _getRows: function() {
                    const result = [];
                    const rowCount = this.getRowCount();

                    if(this.option('showColumnHeaders')) {
                        for(let i = 0; i < rowCount; i++) {
                            result.push({ rowType: 'header', rowIndex: i });
                        }
                    }

                    return result;
                },

                _getCellTemplate: function(options) {
                    if(options.rowType === 'header') {
                        return this._getHeaderTemplate(options.column);
                    }
                },

                _columnOptionChanged: function(e) {
                    const changeTypes = e.changeTypes;
                    const optionNames = e.optionNames;

                    if(changeTypes.grouping) {
                        this._isGroupingChanged = true;
                        return;
                    }

                    this.callBase(e);

                    if(optionNames.width || optionNames.visible) {
                        this.resizeCompleted.fire();
                    }
                },

                _isElementVisible: function(elementOptions) {
                    return elementOptions && elementOptions.visible;
                },

                _alignCaptionByCenter: function($cell) {
                    let $indicatorsContainer = this._getIndicatorContainer($cell, true);

                    if($indicatorsContainer && $indicatorsContainer.length) {
                        $indicatorsContainer.filter('.' + VISIBILITY_HIDDEN_CLASS).remove();
                        $indicatorsContainer = this._getIndicatorContainer($cell);

                        $indicatorsContainer
                            .clone()
                            .addClass(VISIBILITY_HIDDEN_CLASS)
                            .css('float', '')
                            .insertBefore($cell.children('.' + this.addWidgetPrefix(CELL_CONTENT_CLASS)));
                    }
                },

                _updateCell: function($cell, options) {
                    if(options.rowType === 'header' && options.column.alignment === 'center') {
                        this._alignCaptionByCenter($cell);
                    }

                    this.callBase.apply(this, arguments);
                },

                _updateIndicator: function($cell, column, indicatorName) {
                    const $indicatorElement = this.callBase.apply(this, arguments);

                    if(column.alignment === 'center') {
                        this._alignCaptionByCenter($cell);
                    }

                    addCssClassesToCellContent(this, $cell, column);

                    return $indicatorElement;
                },

                _getIndicatorContainer: function($cell, returnAll) {
                    const $indicatorsContainer = this.callBase($cell);

                    return returnAll ? $indicatorsContainer : $indicatorsContainer.filter(':not(.' + VISIBILITY_HIDDEN_CLASS + ')');
                },

                _isSortableElement: function() {
                    return true;
                },

                getHeadersRowHeight: function() {
                    const $tableElement = this.getTableElement();
                    const $headerRows = $tableElement && $tableElement.find('.' + HEADER_ROW_CLASS);

                    return $headerRows && $headerRows.toArray().reduce(function(sum, headerRow) {
                        return sum + $(headerRow).height();
                    }, 0) || 0;
                },

                getHeaderElement: function(index) {
                    const columnElements = this.getColumnElements();

                    return columnElements && columnElements.eq(index);
                },

                getColumnElements: function(index, bandColumnIndex) {
                    const that = this;
                    let $cellElement;
                    const columnsController = that._columnsController;
                    const rowCount = that.getRowCount();

                    if(that.option('showColumnHeaders')) {
                        if(rowCount > 1 && (!isDefined(index) || isDefined(bandColumnIndex))) {
                            const result = [];
                            const visibleColumns = isDefined(bandColumnIndex) ? columnsController.getChildrenByBandColumn(bandColumnIndex, true) : columnsController.getVisibleColumns();

                            each(visibleColumns, function(_, column) {
                                const rowIndex = isDefined(index) ? index : columnsController.getRowIndex(column.index);
                                $cellElement = that._getCellElement(rowIndex, columnsController.getVisibleIndex(column.index, rowIndex));
                                $cellElement && result.push($cellElement.get(0));
                            });

                            return $(result);
                        } else if(!index || index < rowCount) {
                            return that.getCellElements(index || 0);
                        }
                    }
                },

                getColumnIndexByElement: function($cell) {
                    const cellIndex = this.getCellIndex($cell);
                    const $row = $cell.closest('.dx-row');
                    const rowIndex = $row[0].rowIndex;
                    const column = this.getColumns(rowIndex)[cellIndex];

                    return column ? column.index : -1;
                },

                getVisibleColumnIndex: function(columnIndex, rowIndex) {
                    const column = this.getColumns()[columnIndex];

                    return column ? this._columnsController.getVisibleIndex(column.index, rowIndex) : -1;
                },

                getColumnWidths: function() {
                    const $columnElements = this.getColumnElements();

                    if($columnElements && $columnElements.length) {
                        return this._getWidths($columnElements);
                    }

                    return this.callBase.apply(this, arguments);
                },

                allowDragging: function(column, sourceLocation, draggingPanels) {
                    let i;
                    let draggableColumnCount = 0;

                    const rowIndex = column && this._columnsController.getRowIndex(column.index);
                    const columns = this.getColumns(rowIndex === 0 ? 0 : null);
                    const canHideColumn = column?.allowHiding && columns.length > 1;
                    const allowDrag = function(column) {
                        return column.allowReordering || column.allowGrouping || column.allowHiding;
                    };

                    for(i = 0; i < columns.length; i++) {
                        if(allowDrag(columns[i])) {
                            draggableColumnCount++;
                        }
                    }

                    if(draggableColumnCount <= 1 && !canHideColumn) {
                        return false;
                    } else if(!draggingPanels) {
                        return (this.option('allowColumnReordering') || this._columnsController.isColumnOptionUsed('allowReordering')) && column && column.allowReordering;
                    }

                    for(i = 0; i < draggingPanels.length; i++) {
                        const draggingPanel = draggingPanels[i];

                        if(draggingPanel && draggingPanel.allowDragging(column, sourceLocation)) {
                            return true;
                        }
                    }

                    return false;
                },

                getBoundingRect: function() {
                    const that = this;
                    const $columnElements = that.getColumnElements();

                    if($columnElements && $columnElements.length) {
                        const offset = that.getTableElement().offset();
                        return {
                            top: offset.top
                        };
                    }
                    return null;
                },

                getName: function() {
                    return 'headers';
                },

                getColumnCount: function() {
                    const $columnElements = this.getColumnElements();

                    return $columnElements ? $columnElements.length : 0;
                },

                isVisible: function() {
                    return this.option('showColumnHeaders');
                },

                optionChanged: function(args) {
                    const that = this;

                    switch(args.name) {
                        case 'showColumnHeaders':
                        case 'wordWrapEnabled':
                        case 'showColumnLines':
                            that._invalidate(true, true);
                            args.handled = true;
                            break;
                        default:
                            that.callBase(args);
                    }
                },

                getHeight: function() {
                    return this.getElementHeight();
                },

                getContextMenuItems: function(options) {
                    const that = this;
                    const column = options.column;

                    if(options.row && (options.row.rowType === 'header' || options.row.rowType === 'detailAdaptive')) {
                        const sortingOptions = that.option('sorting');

                        if(sortingOptions && sortingOptions.mode !== 'none' && column && column.allowSorting) {
                            const onItemClick = function(params) {
                                setTimeout(function() {
                                    that._columnsController.changeSortOrder(column.index, params.itemData.value);
                                });
                            };
                            return [
                                { text: sortingOptions.ascendingText, value: 'asc', disabled: column.sortOrder === 'asc', icon: CONTEXT_MENU_SORT_ASC_ICON, onItemClick: onItemClick },
                                { text: sortingOptions.descendingText, value: 'desc', disabled: column.sortOrder === 'desc', icon: CONTEXT_MENU_SORT_DESC_ICON, onItemClick: onItemClick },
                                { text: sortingOptions.clearText, value: 'none', disabled: !column.sortOrder, icon: CONTEXT_MENU_SORT_NONE_ICON, onItemClick: onItemClick }
                            ];
                        }
                    }
                },

                getRowCount: function() {
                    return this._columnsController && this._columnsController.getRowCount();
                },

                setRowsOpacity: function(columnIndex, value, rowIndex) {
                    const that = this;
                    let i;
                    let columnElements;
                    const rowCount = that.getRowCount();
                    const columns = that._columnsController.getColumns();
                    const column = columns && columns[columnIndex];
                    const columnID = column && column.isBand && column.index;
                    const setColumnOpacity = function(index, column) {
                        if(column.ownerBand === columnID) {
                            columnElements.eq(index).css({ opacity: value });

                            if(column.isBand) {
                                that.setRowsOpacity(column.index, value, i + 1);
                            }
                        }
                    };

                    if(isDefined(columnID)) {
                        rowIndex = rowIndex || 0;
                        for(i = rowIndex; i < rowCount; i++) {
                            columnElements = that.getCellElements(i);
                            each(that.getColumns(i), setColumnOpacity);
                        }
                    }
                }
            };
        })())
    }
};
