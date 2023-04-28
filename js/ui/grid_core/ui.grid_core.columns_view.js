
import { getOuterWidth, getWidth, getOuterHeight, getHeight } from '../../core/utils/size';
import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import { getWindow, hasWindow } from '../../core/utils/window';
import eventsEngine from '../../events/core/events_engine';
import { data as elementData } from '../../core/element_data';
import pointerEvents from '../../events/pointer';
import { name as clickEventName } from '../../events/click';
import { name as dblclickEvent } from '../../events/double_click';
import browser from '../../core/utils/browser';
import { noop } from '../../core/utils/common';
import { setWidth } from '../../core/utils/style';
import { getPublicElement } from '../../core/element';
import { isRenderer, isFunction, isString, isDefined, isNumeric } from '../../core/utils/type';
import { getBoundingRect, getDefaultAlignment } from '../../core/utils/position';
import * as iteratorUtils from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import modules from './ui.grid_core.modules';
import gridCoreUtils from './ui.grid_core.utils';
import columnStateMixin from './ui.grid_core.column_state_mixin';
import { when, Deferred } from '../../core/utils/deferred';
import { nativeScrolling } from '../../core/utils/support';


const SCROLL_CONTAINER_CLASS = 'scroll-container';
const SCROLLABLE_SIMULATED_CLASS = 'scrollable-simulated';
const GROUP_SPACE_CLASS = 'group-space';
const CONTENT_CLASS = 'content';
const TABLE_CLASS = 'table';
const TABLE_FIXED_CLASS = 'table-fixed';
const CONTENT_FIXED_CLASS = 'content-fixed';
const ROW_CLASS = 'dx-row';
const GROUP_ROW_CLASS = 'dx-group-row';
const GROUP_CELL_CLASS = 'dx-group-cell';
const DETAIL_ROW_CLASS = 'dx-master-detail-row';
const FILTER_ROW_CLASS = 'filter-row';
const ERROR_ROW_CLASS = 'dx-error-row';
const CELL_UPDATED_ANIMATION_CLASS = 'cell-updated-animation';

const HIDDEN_COLUMNS_WIDTH = '0.0001px';

const CELL_HINT_VISIBLE = 'dxCellHintVisible';

const FORM_FIELD_ITEM_CONTENT_CLASS = 'dx-field-item-content';

const appendElementTemplate = {
    render: function(options) {
        options.container.append(options.content);
    }
};

const subscribeToRowEvents = function(that, $table) {
    let touchTarget;
    let touchCurrentTarget;
    let timeoutId;

    function clearTouchTargets(timeout) {
        return setTimeout(function() {
            touchTarget = touchCurrentTarget = null;
        }, timeout);
    }

    eventsEngine.on($table, 'touchstart touchend', '.dx-row', function(e) {
        clearTimeout(timeoutId);
        if(e.type === 'touchstart') {
            touchTarget = e.target;
            touchCurrentTarget = e.currentTarget;
            timeoutId = clearTouchTargets(1000);
        } else {
            timeoutId = clearTouchTargets();
        }
    });

    eventsEngine.on($table, [clickEventName, dblclickEvent, pointerEvents.down].join(' '), '.dx-row', that.createAction(function(e) {
        const event = e.event;

        if(touchTarget) {
            event.target = touchTarget;
            event.currentTarget = touchCurrentTarget;
        }

        if(!$(event.target).closest('a').length) {
            e.rowIndex = that.getRowIndex(event.currentTarget);

            if(e.rowIndex >= 0) {
                // @ts-ignore
                e.rowElement = getPublicElement($(event.currentTarget));
                e.columns = that.getColumns();

                if(event.type === pointerEvents.down) {
                    that._rowPointerDown(e);
                } else if(event.type === clickEventName) {
                    that._rowClick(e);
                } else {
                    that._rowDblClick(e);
                }
            }
        }
    }));
};

const getWidthStyle = function(width) {
    if(width === 'auto') return '';
    return isNumeric(width) ? width + 'px' : width;
};

const setCellWidth = function(cell, column, width) {
    cell.style.width = cell.style.maxWidth = column.width === 'auto' ? '' : width;
};

const copyAttributes = function(element, newElement) {
    if(!element || !newElement) return;

    const oldAttributes = element.attributes;
    const newAttributes = newElement.attributes;
    let i;

    for(i = 0; i < oldAttributes.length; i++) {
        const name = oldAttributes[i].nodeName;
        if(!newElement.hasAttribute(name)) {
            element.removeAttribute(name);
        }
    }

    for(i = 0; i < newAttributes.length; i++) {
        element.setAttribute(newAttributes[i].nodeName, newAttributes[i].nodeValue);
    }
};

/**
 * @type {Partial<import('./ui.grid_core.columns_view').ColumnsView>}
 */
const columnsViewMembers = {
    _createScrollableOptions: function() {
        const that = this;
        const scrollingOptions = that.option('scrolling');
        let useNativeScrolling = that.option('scrolling.useNative');

        const options = extend({}, scrollingOptions, {
            direction: 'both',
            bounceEnabled: false,
            useKeyboard: false
        });

        // TODO jsdmitry: This condition is for unit tests and testing scrollable
        if(useNativeScrolling === undefined) {
            useNativeScrolling = true;
        }
        if(useNativeScrolling === 'auto') {
            delete options.useNative;
            delete options.useSimulatedScrollbar;
        } else {
            options.useNative = !!useNativeScrolling;
            options.useSimulatedScrollbar = !useNativeScrolling;
        }
        return options;
    },

    _updateCell: function($cell, parameters) {
        if(parameters.rowType) {
            this._cellPrepared($cell, parameters);
        }
    },

    _createCell: function(options) {
        const column = options.column;
        const alignment = column.alignment || getDefaultAlignment(this.option('rtlEnabled'));

        const cell = domAdapter.createElement('td');
        cell.style.textAlign = alignment;

        const $cell = $(cell);

        if(options.rowType === 'data' && column.headerId && !column.type) {
            if(this.component.option('showColumnHeaders')) {
                this.setAria('describedby', column.headerId, $cell);
            }
        }

        if(column.cssClass) {
            $cell.addClass(column.cssClass);
        }

        if(column.command === 'expand') {
            $cell.addClass(column.cssClass);
            $cell.addClass(this.addWidgetPrefix(GROUP_SPACE_CLASS));
        }

        if(column.colspan > 1) {
            $cell.attr('colSpan', column.colspan);
        } else if(!column.isBand && column.visibleWidth !== 'auto' && this.option('columnAutoWidth')) {
            if(column.width || column.minWidth) {
                cell.style.minWidth = getWidthStyle(column.minWidth || column.width);
            }
            if(column.width) {
                setCellWidth(cell, column, getWidthStyle(column.width));
            }
        }

        return $cell;
    },

    _createRow: function(rowObject, tagName) {
        tagName = tagName || 'tr';
        const $element = $(`<${tagName}>`).addClass(ROW_CLASS);
        this.setAria('role', 'row', $element);
        return $element;
    },

    _isAltRow: function(row) {
        return row && row.dataIndex % 2 === 1;
    },

    _createTable: function(columns, isAppend) {
        const that = this;
        const $table = $('<table>')
            .addClass(that.addWidgetPrefix(TABLE_CLASS))
            .addClass(that.addWidgetPrefix(TABLE_FIXED_CLASS));

        if(columns && !isAppend) {
            $table.append(that._createColGroup(columns));
            if(browser.safari) {
                // T198380, T809552
                // @ts-expect-error
                $table.append($('<thead>').append('<tr>'));
            }
            that.setAria('role', 'presentation', $table);
        } else {
            that.setAria('hidden', true, $table);
        }

        this.setAria('role', 'presentation', $('<tbody>').appendTo($table));

        if(isAppend) {
            return $table;
        }

        // T138469
        if(browser.mozilla) {
            eventsEngine.on($table, 'mousedown', 'td', function(e) {
                if(e.ctrlKey) {
                    e.preventDefault();
                }
            });
        }

        if(that.option('cellHintEnabled')) {
            eventsEngine.on($table, 'mousemove', '.dx-row > td', this.createAction(function(args) {
                const e = args.event;
                const $element = $(e.target);
                const $cell = $(e.currentTarget);
                const $row = $cell.parent();
                const visibleColumns = that._columnsController.getVisibleColumns();
                /**
                 * @type {any}
                 */
                const rowOptions = $row.data('options');
                const columnIndex = $cell.index();
                const cellOptions = rowOptions && rowOptions.cells && rowOptions.cells[columnIndex];
                const column = cellOptions ? cellOptions.column : visibleColumns[columnIndex];

                const isHeaderRow = $row.hasClass('dx-header-row');
                const isDataRow = $row.hasClass('dx-data-row');
                const isMasterDetailRow = $row.hasClass(DETAIL_ROW_CLASS);
                const isGroupRow = $row.hasClass(GROUP_ROW_CLASS);
                const isFilterRow = $row.hasClass(that.addWidgetPrefix(FILTER_ROW_CLASS));

                const isDataRowWithTemplate = isDataRow && (!column || column.cellTemplate);
                const isEditorShown = isDataRow && cellOptions && (rowOptions.isEditing || cellOptions.isEditing || column?.showEditorAlways);
                const isHeaderRowWithTemplate = isHeaderRow && (!column || column.headerCellTemplate);
                const isGroupCellWithTemplate = isGroupRow && (!column || (column.groupIndex && column.groupCellTemplate));

                const shouldShowHint = !isMasterDetailRow
                                    && !isFilterRow
                                    && !isEditorShown
                                    && !isDataRowWithTemplate
                                    && !isHeaderRowWithTemplate
                                    && !isGroupCellWithTemplate;

                if(shouldShowHint) {
                    if($element.data(CELL_HINT_VISIBLE)) {
                        $element.removeAttr('title');
                        $element.data(CELL_HINT_VISIBLE, false);
                    }

                    const difference = $element[0].scrollWidth - $element[0].clientWidth;
                    if(difference > 0 && !isDefined($element.attr('title'))) {
                        $element.attr('title', $element.text());
                        $element.data(CELL_HINT_VISIBLE, true);
                    }
                }
            }));
        }

        const getOptions = function(event) {
            const $cell = $(event.currentTarget);
            const $fieldItemContent = $(event.target).closest('.' + FORM_FIELD_ITEM_CONTENT_CLASS);
            const $row = $cell.parent();
            /**
             * @type {any}
             */
            const rowOptions = $row.data('options');
            const options = rowOptions && rowOptions.cells && rowOptions.cells[$cell.index()];

            if(!$cell.closest('table').is(event.delegateTarget)) return;

            const resultOptions = extend({}, options, {
                // @ts-ignore
                cellElement: getPublicElement($cell),
                event: event,
                eventType: event.type
            });

            resultOptions.rowIndex = that.getRowIndex($row);

            if($fieldItemContent.length) {
                /**
                 * @type {any}
                 */
                const formItemOptions = $fieldItemContent.data('dx-form-item');
                if(formItemOptions.column) {
                    resultOptions.column = formItemOptions.column;
                    resultOptions.columnIndex = that._columnsController.getVisibleIndex(resultOptions.column.index);
                }
            }

            return resultOptions;
        };

        eventsEngine.on($table, 'mouseover', '.dx-row > td', function(e) {
            const options = getOptions(e);
            options && that.executeAction('onCellHoverChanged', options);
        });

        eventsEngine.on($table, 'mouseout', '.dx-row > td', function(e) {
            const options = getOptions(e);
            options && that.executeAction('onCellHoverChanged', options);
        });

        eventsEngine.on($table, clickEventName, '.dx-row > td', function(e) {
            const options = getOptions(e);
            options && that.executeAction('onCellClick', options);
        });

        eventsEngine.on($table, dblclickEvent, '.dx-row > td', function(e) {
            const options = getOptions(e);
            options && that.executeAction('onCellDblClick', options);
        });

        subscribeToRowEvents(that, $table);

        return $table;
    },

    _rowPointerDown: noop,

    _rowClick: noop,

    _rowDblClick: noop,

    _createColGroup: function(columns) {
        const colgroupElement = $('<colgroup>');

        for(let i = 0; i < columns.length; i++) {
            const colspan = columns[i].colspan || 1;

            for(let j = 0; j < colspan; j++) {
                colgroupElement.append(this._createCol(columns[i]));
            }
        }
        return colgroupElement;
    },

    _createCol: function(column) {
        let width = column.visibleWidth || column.width;

        if(width === 'adaptiveHidden') {
            width = HIDDEN_COLUMNS_WIDTH;
        }

        const col = $('<col>');
        setWidth(col, width);

        return col;
    },

    renderDelayedTemplates: function(change) {
        const delayedTemplates = this._delayedTemplates;
        const syncTemplates = delayedTemplates.filter(template => !template.async);
        const asyncTemplates = delayedTemplates.filter(template => template.async);

        this._delayedTemplates = [];

        this._renderDelayedTemplatesCore(syncTemplates, false, change);
        this._renderDelayedTemplatesCoreAsync(asyncTemplates);
    },

    _renderDelayedTemplatesCoreAsync: function(templates) {
        if(templates.length) {
            const templateTimeout = getWindow().setTimeout(() => {
                this._templateTimeouts.delete(templateTimeout);
                this._renderDelayedTemplatesCore(templates, true);
            });

            this._templateTimeouts.add(templateTimeout);
        }
    },

    _renderDelayedTemplatesCore: function(templates, isAsync, change) {
        const date = new Date();

        while(templates.length) {
            const templateParameters = templates.shift();

            const options = templateParameters.options;
            // @ts-expect-error
            const doc = domAdapter.getRootNode($(options.container).get(0));
            const needWaitAsyncTemplates = this.needWaitAsyncTemplates();

            // @ts-expect-error
            if(!isAsync || $(options.container).closest(doc).length || needWaitAsyncTemplates) {
                if(change) {
                    options.change = change;
                }
                templateParameters.template.render(options);
            }
            // @ts-expect-error
            if(isAsync && (new Date() - date) > 30) {
                this._renderDelayedTemplatesCoreAsync(templates);
                break;
            }
        }

        if(!templates.length && this._delayedTemplates.length) {
            this.renderDelayedTemplates();
        }
    },

    _processTemplate: function(template) {
        const that = this;
        let renderingTemplate;

        if(template && template.render && !isRenderer(template)) {
            renderingTemplate = {
                allowRenderToDetachedContainer: template.allowRenderToDetachedContainer,
                render: function(options) {
                    template.render(options.container, options.model, options.change);
                    options.deferred && options.deferred.resolve();
                }
            };
        } else if(isFunction(template)) {
            renderingTemplate = {
                render: function(options) {
                    const renderedTemplate = template(getPublicElement(options.container), options.model, options.change);
                    if(renderedTemplate && (renderedTemplate.nodeType || isRenderer(renderedTemplate))) {
                        options.container.append(renderedTemplate);
                    }
                    options.deferred && options.deferred.resolve();
                }
            };
        } else {
            /**
             * @type {any}
             */
            const templateID = isString(template) ? template : $(template).attr('id');

            if(!templateID) {
                renderingTemplate = that.getTemplate(template);
            } else {
                if(!that._templatesCache[templateID]) {
                    that._templatesCache[templateID] = that.getTemplate(template);
                }

                renderingTemplate = that._templatesCache[templateID];
            }
        }

        return renderingTemplate;
    },

    renderTemplate: function(container, template, options, allowRenderToDetachedContainer, change) {
        const renderingTemplate = this._processTemplate(template, options);
        const column = options.column;
        const isDataRow = options.rowType === 'data';
        // @ts-expect-error
        const templateDeferred = new Deferred();
        const templateOptions = {
            container: container,
            model: options,
            deferred: templateDeferred,
            onRendered: () => {
                if(this.isDisposed()) {
                    templateDeferred.reject();
                } else {
                    templateDeferred.resolve();
                }
            }
        };

        if(renderingTemplate) {
            options.component = this.component;

            const async = column && (
                (column.renderAsync && isDataRow) ||
                this.option('renderAsync') &&
                    (column.renderAsync !== false && (column.command || column.showEditorAlways) && isDataRow || options.rowType === 'filter')
            );

            if((renderingTemplate.allowRenderToDetachedContainer || allowRenderToDetachedContainer) && !async) {
                renderingTemplate.render(templateOptions);
            } else {
                this._delayedTemplates.push({ template: renderingTemplate, options: templateOptions, async: async });
            }

            this._templateDeferreds.add(templateDeferred);
        } else {
            templateDeferred.reject();
        }

        return templateDeferred.promise().always(() => {
            this._templateDeferreds.delete(templateDeferred);
        });
    },

    _getBodies: function(tableElement) {
        return $(tableElement).children('tbody').not('.dx-header').not('.dx-footer');
    },

    _needWrapRow: function($tableElement) {
        const hasRowTemplate = !!this.option().rowTemplate;

        return hasRowTemplate && !!this._getBodies($tableElement)?.filter('.' + ROW_CLASS).length;
    },

    _wrapRowIfNeed: function($table, $row, isRefreshing) {
        const $tableElement = isRefreshing ? $table || this._tableElement : this._tableElement || $table;
        const needWrapRow = this._needWrapRow($tableElement);

        if(needWrapRow) {
            const $tbody = $('<tbody>').addClass($row.attr('class'));

            this.setAria('role', 'presentation', $tbody);

            return $tbody.append($row);
        }

        return $row;
    },

    _appendRow: function($table, $row, appendTemplate) {
        appendTemplate = appendTemplate || appendElementTemplate;
        appendTemplate.render({ content: $row, container: $table });
    },

    _resizeCore: function() {
        const scrollLeft = this._scrollLeft;

        if(scrollLeft >= 0) {
            this._scrollLeft = 0;
            this.scrollTo({ left: scrollLeft });
        }
    },

    _renderCore: function(e) {
        const $root = this.element().parent();

        if(!$root || $root.parent().length) {
            this.renderDelayedTemplates(e);
        }
    },

    _renderTable: function(options) {
        options = options || {};

        options.columns = this._columnsController.getVisibleColumns();
        const changeType = options.change && options.change.changeType;
        const $table = this._createTable(options.columns, changeType === 'append' || changeType === 'prepend' || changeType === 'update');

        this._renderRows($table, options);

        return $table;
    },

    _renderRows: function($table, options) {
        const that = this;
        const rows = that._getRows(options.change);
        const columnIndices = options.change && options.change.columnIndices || [];
        const changeTypes = options.change && options.change.changeTypes || [];

        for(let i = 0; i < rows.length; i++) {
            that._renderRow($table, extend({ row: rows[i], columnIndices: columnIndices[i], changeType: changeTypes[i] }, options));
        }
    },

    _renderRow: function($table, options) {
        if(!options.columnIndices) {
            options.row.cells = [];
        }

        const $row = this._createRow(options.row);
        const $wrappedRow = this._wrapRowIfNeed($table, $row);
        if(options.changeType !== 'remove') {
            this._renderCells($row, options);
        }
        this._appendRow($table, $wrappedRow);
        const rowOptions = extend({ columns: options.columns }, options.row);

        this._addWatchMethod(rowOptions, options.row);

        this._rowPrepared($wrappedRow, rowOptions, options.row);
    },

    _needRenderCell: function(columnIndex, columnIndices) {
        return !columnIndices || columnIndices.indexOf(columnIndex) >= 0;
    },

    _renderCells: function($row, options) {
        const that = this;
        let columnIndex = 0;
        const row = options.row;
        const columns = options.columns;

        for(let i = 0; i < columns.length; i++) {
            if(this._needRenderCell(i, options.columnIndices)) {
                that._renderCell($row, extend({ column: columns[i], columnIndex: columnIndex, value: row.values && row.values[columnIndex], oldValue: row.oldValues && row.oldValues[columnIndex] }, options));
            }

            if(columns[i].colspan > 1) {
                columnIndex += columns[i].colspan;
            } else {
                columnIndex++;
            }
        }
    },

    _updateCells: function($rowElement, $newRowElement, columnIndices) {
        const $cells = $rowElement.children();
        const $newCells = $newRowElement.children();
        const highlightChanges = this.option('highlightChanges');
        const cellUpdatedClass = this.addWidgetPrefix(CELL_UPDATED_ANIMATION_CLASS);

        columnIndices.forEach(function(columnIndex, index) {
            const $cell = $cells.eq(columnIndex);
            const $newCell = $newCells.eq(index);

            $cell.replaceWith($newCell);

            if(highlightChanges && !$newCell.hasClass('dx-command-expand')) {
                $newCell.addClass(cellUpdatedClass);
            }
        });

        copyAttributes($rowElement.get(0), $newRowElement.get(0));
    },

    _setCellAriaAttributes: function($cell, cellOptions) {
        if(cellOptions.rowType !== 'freeSpace') {
            this.setAria('role', 'gridcell', $cell);

            const columnIndexOffset = this._columnsController.getColumnIndexOffset();
            const ariaColIndex = cellOptions.columnIndex + columnIndexOffset + 1;
            this.setAria('colindex', ariaColIndex, $cell);
        }
    },

    _renderCell: function($row, options) {
        const cellOptions = this._getCellOptions(options);

        if(options.columnIndices) {
            if(options.row.cells) {
                const cellIndex = options.row.cells.findIndex(cell => cell.columnIndex === cellOptions.columnIndex);
                options.row.cells[cellIndex] = cellOptions;
            }
        } else {
            options.row.cells.push(cellOptions);
        }

        const $cell = this._createCell(cellOptions);

        this._setCellAriaAttributes($cell, cellOptions);

        this._renderCellContent($cell, cellOptions, options);

        $row.get(0).appendChild($cell.get(0));

        return $cell;
    },

    _renderCellContent: function($cell, options, renderOptions) {
        const template = this._getCellTemplate(options);

        when(!template || this.renderTemplate($cell, template, options, undefined, renderOptions.change)).done(() => {
            this._updateCell($cell, options);
        });
    },

    _getCellTemplate: function() { },

    _getRows: function() {
        return [];
    },

    _getCellOptions: function(options) {
        const cellOptions = {
            column: options.column,
            columnIndex: options.columnIndex,
            rowType: options.row.rowType,
            isAltRow: this._isAltRow(options.row)
        };

        this._addWatchMethod(cellOptions);

        return cellOptions;
    },

    _addWatchMethod: function(options, source) {
        if(!this.option('repaintChangesOnly')) return;

        const watchers = [];

        source = source || options;

        source.watch = source.watch || function(getter, updateValueFunc, updateRowFunc) {
            let oldValue = getter(source.data);

            const watcher = function(row) {
                if(row && updateRowFunc) {
                    updateRowFunc(row);
                }

                const newValue = getter(source.data);

                if(JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                    if(row) {
                        updateValueFunc(newValue);
                    }
                    oldValue = newValue;
                }
            };

            watchers.push(watcher);

            const stopWatch = function() {
                const index = watchers.indexOf(watcher);
                if(index >= 0) {
                    watchers.splice(index, 1);
                }
            };

            return stopWatch;
        };

        source.update = source.update || function(row, keepRow) {
            if(row) {
                this.data = options.data = row.data;
                this.rowIndex = options.rowIndex = row.rowIndex;
                this.dataIndex = options.dataIndex = row.dataIndex;
                this.isExpanded = options.isExpanded = row.isExpanded;

                if(options.row && !keepRow) {
                    options.row = row;
                }
            }

            watchers.forEach(function(watcher) {
                watcher(row);
            });
        };

        if(source !== options) {
            options.watch = source.watch.bind(source);
        }

        return options;
    },

    _cellPrepared: function(cell, options) {
        // @ts-ignore
        options.cellElement = getPublicElement($(cell));
        this.executeAction('onCellPrepared', options);
    },

    _rowPrepared: function($row, options) {
        elementData($row.get(0), 'options', options);

        options.rowElement = getPublicElement($row);
        this.executeAction('onRowPrepared', options);
    },

    _columnOptionChanged: function(e) {
        const optionNames = e.optionNames;

        if(gridCoreUtils.checkChanges(optionNames, ['width', 'visibleWidth'])) {
            const visibleColumns = this._columnsController.getVisibleColumns();
            const widths = iteratorUtils.map(visibleColumns, function(column) {
                const width = column.visibleWidth || column.width;
                return isDefined(width) ? width : 'auto';
            });

            this.setColumnWidths({ widths, optionNames });
            return;
        }

        if(!this._requireReady) {
            this.render();
        }
    },

    getCellIndex: function($cell) {
        const cellIndex = $cell.length ? $cell[0].cellIndex : -1;

        return cellIndex;
    },

    getTableElements: function() {
        // @ts-expect-error
        return this._tableElement || $();
    },

    getTableElement: function() {
        return this._tableElement;
    },

    setTableElement: function(tableElement) {
        this._tableElement = tableElement;
    },

    optionChanged: function(args) {
        this.callBase(args);

        switch(args.name) {
            case 'cellHintEnabled':
            case 'onCellPrepared':
            case 'onRowPrepared':
            case 'onCellHoverChanged':
                this._invalidate(true, true);
                args.handled = true;
                break;
        }
    },

    init: function() {
        this._scrollLeft = -1;
        this._columnsController = this.getController('columns');
        this._dataController = this.getController('data');
        this._delayedTemplates = [];
        this._templateDeferreds = new Set();
        this._templatesCache = {};
        this._templateTimeouts = new Set();
        this.createAction('onCellClick');
        this.createAction('onRowClick');
        this.createAction('onCellDblClick');
        this.createAction('onRowDblClick');
        this.createAction('onCellHoverChanged', { excludeValidators: ['disabled', 'readOnly'] });
        this.createAction('onCellPrepared', { excludeValidators: ['disabled', 'readOnly'], category: 'rendering' });
        this.createAction('onRowPrepared', {
            excludeValidators: ['disabled', 'readOnly'], category: 'rendering', afterExecute: (e) => {
                this._afterRowPrepared(e);
            } });

        this._columnsController.columnsChanged.add(this._columnOptionChanged.bind(this));
        this._dataController && this._dataController.changed.add(this._handleDataChanged.bind(this));
    },

    _afterRowPrepared: noop,

    _handleDataChanged: function() {
    },

    callbackNames: function() {
        return ['scrollChanged'];
    },

    _updateScrollLeftPosition: function() {
        const scrollLeft = this._scrollLeft;

        if(scrollLeft >= 0) {
            this._scrollLeft = 0;
            this.scrollTo({ left: scrollLeft });
        }
    },

    scrollTo: function(pos) {
        const $element = this.element();
        const $scrollContainer = $element && $element.children('.' + this.addWidgetPrefix(SCROLL_CONTAINER_CLASS)).not('.' + this.addWidgetPrefix(CONTENT_FIXED_CLASS));

        if(isDefined(pos) && isDefined(pos.left) && this._scrollLeft !== pos.left) {
            this._scrollLeft = pos.left;
            $scrollContainer && $scrollContainer.scrollLeft(pos.left);
        }
    },

    _wrapTableInScrollContainer: function($table) {
        const $scrollContainer = $('<div>');
        const useNative = this.option('scrolling.useNative');

        if(useNative === false || (useNative === 'auto' && !nativeScrolling)) {
            $scrollContainer.addClass(this.addWidgetPrefix(SCROLLABLE_SIMULATED_CLASS));
        }

        eventsEngine.on($scrollContainer, 'scroll', () => {
            const scrollLeft = $scrollContainer.scrollLeft();

            if(scrollLeft !== this._scrollLeft) {
                this.scrollChanged.fire({ left: scrollLeft }, this.name);
            }
        });

        $scrollContainer.addClass(this.addWidgetPrefix(CONTENT_CLASS))
            .addClass(this.addWidgetPrefix(SCROLL_CONTAINER_CLASS))
            .append($table)
            .appendTo(this.element());

        this.setAria('role', 'presentation', $scrollContainer);

        return $scrollContainer;
    },

    needWaitAsyncTemplates: function() {
        return this.option('templatesRenderAsynchronously') && this.option('renderAsync') === false;
    },

    waitAsyncTemplates: function(forceWaiting = false) {
        // @ts-expect-error
        const result = new Deferred();
        const needWaitAsyncTemplates = forceWaiting || this.needWaitAsyncTemplates();

        if(!needWaitAsyncTemplates) {
            return result.resolve();
        }

        const waitTemplatesRecursion = () =>
            when.apply(this, Array.from(this._templateDeferreds))
                .done(() => {
                    if(this.isDisposed()) {
                        result.reject();
                    } else if(this._templateDeferreds.size > 0) {
                        waitTemplatesRecursion();
                    } else {
                        result.resolve();
                    }
                }).fail(result.reject);

        waitTemplatesRecursion();

        return result.promise();
    },

    _updateContent: function($newTableElement, change, isFixedTableRendering) {
        return this.waitAsyncTemplates().done(() => {
            this.setTableElement($newTableElement, isFixedTableRendering);
            this._wrapTableInScrollContainer($newTableElement, isFixedTableRendering);
        });
    },

    _findContentElement: noop,

    _getWidths: function($cellElements) {
        const result = [];
        let width;

        if($cellElements) {
            iteratorUtils.each($cellElements, function(index, item) {
                width = item.offsetWidth;
                if(item.getBoundingClientRect) {
                    const clientRect = getBoundingRect(item);
                    if(clientRect.width > width - 1) {
                        width = clientRect.width;
                    }
                }

                result.push(width);
            });
        }

        return result;
    },

    getColumnWidths: function($tableElement) {
        const that = this;
        let result = [];
        let $rows;
        let $cells;

        (this.option('forceApplyBindings') || noop)();

        $tableElement = $tableElement || that.getTableElement();

        if($tableElement) {
            $rows = $tableElement.children('tbody:not(.dx-header)').children();

            for(let i = 0; i < $rows.length; i++) {
                const $row = $rows.eq(i);
                const isRowVisible = $row.get(0).style.display !== 'none' && !$row.hasClass('dx-state-invisible');
                if(!$row.is('.' + GROUP_ROW_CLASS) && !$row.is('.' + DETAIL_ROW_CLASS) && !$row.is('.' + ERROR_ROW_CLASS) && isRowVisible) {
                    $cells = $row.children('td');
                    break;
                }
            }

            result = that._getWidths($cells);
        }

        return result;
    },

    getVisibleColumnIndex: function(columnIndex, rowIndex) {
        return columnIndex;
    },

    setColumnWidths: function({ widths, $tableElement, columns, fixed }) {
        let $cols;
        let width;
        let minWidth;
        let columnIndex;
        const columnAutoWidth = this.option('columnAutoWidth');

        $tableElement = $tableElement || this.getTableElement();

        if($tableElement && $tableElement.length && widths) {
            columnIndex = 0;
            $cols = $tableElement.children('colgroup').children('col');
            setWidth($cols, 'auto');
            columns = columns || this.getColumns(null, $tableElement);

            for(let i = 0; i < columns.length; i++) {
                if(columnAutoWidth && !fixed) {
                    width = columns[i].width;

                    if(width && !columns[i].command) {
                        width = columns[i].visibleWidth || width;

                        width = getWidthStyle(width);
                        minWidth = getWidthStyle(columns[i].minWidth || width);
                        // @ts-expect-error
                        const $rows = $rows || $tableElement.children().children('.dx-row').not('.' + DETAIL_ROW_CLASS);
                        for(let rowIndex = 0; rowIndex < $rows.length; rowIndex++) {
                            const row = $rows[rowIndex];

                            let cell;
                            const visibleIndex = this.getVisibleColumnIndex(i, rowIndex);
                            if(row.classList.contains(GROUP_ROW_CLASS)) {
                                cell = row.querySelector(`td[aria-colindex='${visibleIndex + 1}']:not(.${GROUP_CELL_CLASS})`);
                            } else {
                                cell = row.cells[visibleIndex];
                            }
                            if(cell) {
                                setCellWidth(cell, columns[i], width);
                                cell.style.minWidth = minWidth;
                            }
                        }
                    }
                }

                if(columns[i].colspan) {
                    columnIndex += columns[i].colspan;
                    continue;
                }
                width = widths[columnIndex];
                if(width === 'adaptiveHidden') {
                    width = HIDDEN_COLUMNS_WIDTH;
                }
                if(typeof width === 'number') {
                    width = width.toFixed(3) + 'px';
                }
                setWidth($cols.eq(columnIndex), isDefined(width) ? width : 'auto');

                columnIndex++;
            }
        }
    },

    getCellElements: function(rowIndex) {
        return this._getCellElementsCore(rowIndex);
    },

    _getCellElementsCore: function(rowIndex) {
        const $row = this._getRowElements().eq(rowIndex);
        return $row.children();
    },

    _getCellElement: function(rowIndex, columnIdentifier) {
        const that = this;
        let $cell;
        const $cells = that.getCellElements(rowIndex);
        const columnVisibleIndex = that._getVisibleColumnIndex($cells, rowIndex, columnIdentifier);

        if($cells.length && columnVisibleIndex >= 0) {
            $cell = $cells.eq(columnVisibleIndex);
        }

        if($cell && $cell.length) {
            return $cell;
        }
    },

    _getRowElement: function(rowIndex) {
        const that = this;
        // @ts-expect-error
        let $rowElement = $();
        const $tableElements = that.getTableElements();

        iteratorUtils.each($tableElements, function(_, tableElement) {
            $rowElement = $rowElement.add(that._getRowElements($(tableElement)).eq(rowIndex));
        });

        if($rowElement.length) {
            return $rowElement;
        }
    },

    getCellElement: function(rowIndex, columnIdentifier) {
        return getPublicElement(this._getCellElement(rowIndex, columnIdentifier));
    },

    getRowElement: function(rowIndex) {
        const $rows = this._getRowElement(rowIndex);
        let elements = [];

        // @ts-ignore
        if($rows && !getPublicElement($rows).get) {
            for(let i = 0; i < $rows.length; i++) {
                elements.push($rows[i]);
            }
        } else {
            elements = $rows;
        }
        return elements;
    },

    _getVisibleColumnIndex: function($cells, rowIndex, columnIdentifier) {

        if(isString(columnIdentifier)) {
            const columnIndex = this._columnsController.columnOption(columnIdentifier, 'index');
            return this._columnsController.getVisibleIndex(columnIndex);
        }

        return columnIdentifier;
    },

    getColumnElements: function() {},

    getColumns: function(rowIndex) {
        return this._columnsController.getVisibleColumns(rowIndex);
    },

    getCell: function(cellPosition, rows, cells) {
        const $rows = rows || this._getRowElements();
        let $cells;

        if($rows.length > 0 && cellPosition.rowIndex >= 0) {
            if(this.option('scrolling.mode') !== 'virtual' && this.option('scrolling.rowRenderingMode') !== 'virtual') {
                cellPosition.rowIndex = cellPosition.rowIndex < $rows.length ? cellPosition.rowIndex : $rows.length - 1;
            }
            $cells = cells || this.getCellElements(cellPosition.rowIndex);
            if($cells && $cells.length > 0) {
                return $cells.eq($cells.length > cellPosition.columnIndex ? cellPosition.columnIndex : $cells.length - 1);
            }
        }
    },

    getRowsCount: function() {
        const tableElement = this.getTableElement();

        if(tableElement && tableElement.length === 1) {
            return tableElement[0].rows.length;
        }
        return 0;
    },

    _getRowElementsCore: function(tableElement) {
        tableElement = tableElement || this.getTableElement();

        if(tableElement) {
            const hasRowTemplate = this.option().rowTemplate || this.option('dataRowTemplate');
            const tBodies = hasRowTemplate && tableElement.find('> tbody.' + ROW_CLASS);

            return tBodies && tBodies.length ? tBodies : tableElement.find('> tbody > ' + '.' + ROW_CLASS + ', > .' + ROW_CLASS);
        }

        // @ts-expect-error
        return $();
    },

    _getRowElements: function(tableElement) {
        return this._getRowElementsCore(tableElement);
    },

    getRowIndex: function($row) {
        return this._getRowElements().index($row);
    },

    getBoundingRect: function() { },

    getName: function() { },

    setScrollerSpacing: function(width) {
        const that = this;
        const $element = that.element();
        const rtlEnabled = that.option('rtlEnabled');

        $element && $element.css({
            paddingLeft: rtlEnabled ? width : '',
            paddingRight: !rtlEnabled ? width : ''
        });
    },

    isScrollbarVisible: function(isHorizontal) {
        const $element = this.element();
        const $tableElement = this._tableElement;

        if($element && $tableElement) {
            return isHorizontal ? (getOuterWidth($tableElement) - getWidth($element) > 0) : (getOuterHeight($tableElement) - getHeight($element) > 0);
        }

        return false;
    },

    isDisposed: function() {
        return this.component?._disposed;
    },

    dispose: function() {
        if(hasWindow()) {
            const window = getWindow();

            this._templateTimeouts?.forEach((templateTimeout) => window.clearTimeout(templateTimeout));
            this._templateTimeouts?.clear();
        }
    }
};

export const ColumnsView = modules.View.inherit(columnStateMixin).inherit(columnsViewMembers);
