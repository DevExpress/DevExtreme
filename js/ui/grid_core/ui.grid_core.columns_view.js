import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import { getWindow } from '../../core/utils/window';
import eventsEngine from '../../events/core/events_engine';
import dataUtils from '../../core/element_data';
import pointerEvents from '../../events/pointer';
import clickEvent from '../../events/click';
import dblclickEvent from '../../events/double_click';
import browser from '../../core/utils/browser';
import { noop } from '../../core/utils/common';
import styleUtils from '../../core/utils/style';
import { getPublicElement } from '../../core/utils/dom';
import typeUtils from '../../core/utils/type';
import { getBoundingRect } from '../../core/utils/position';
import iteratorUtils from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import { getDefaultAlignment } from '../../core/utils/position';
import modules from './ui.grid_core.modules';
import { checkChanges } from './ui.grid_core.utils';
import columnStateMixin from './ui.grid_core.column_state_mixin';
import { when, Deferred } from '../../core/utils/deferred';

const SCROLL_CONTAINER_CLASS = 'scroll-container';
const GROUP_SPACE_CLASS = 'group-space';
const CONTENT_CLASS = 'content';
const TABLE_CLASS = 'table';
const TABLE_FIXED_CLASS = 'table-fixed';
const CONTENT_FIXED_CLASS = 'content-fixed';
const ROW_CLASS = 'dx-row';
const GROUP_ROW_CLASS = 'dx-group-row';
const DETAIL_ROW_CLASS = 'dx-master-detail-row';
const FILTER_ROW_CLASS = 'filter-row';
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

    eventsEngine.on($table, [clickEvent.name, dblclickEvent.name, pointerEvents.down].join(' '), '.dx-row', { useNative: that._isNativeClick() }, that.createAction(function(e) {
        const event = e.event;

        if(touchTarget) {
            event.target = touchTarget;
            event.currentTarget = touchCurrentTarget;
        }

        if(!$(event.target).closest('a').length) {
            e.rowIndex = that.getRowIndex(event.currentTarget);

            if(e.rowIndex >= 0) {
                e.rowElement = getPublicElement($(event.currentTarget));
                e.columns = that.getColumns();

                if(event.type === pointerEvents.down) {
                    that._rowPointerDown(e);
                } else if(event.type === clickEvent.name) {
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
    return typeUtils.isNumeric(width) ? width + 'px' : width;
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

exports.ColumnsView = modules.View.inherit(columnStateMixin).inherit({
    _createScrollableOptions: function() {
        const that = this;
        const scrollingOptions = that.option('scrolling');
        let useNativeScrolling = that.option('scrolling.useNative');

        const options = extend({ pushBackValue: 0 }, scrollingOptions, {
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
        } else if(!column.isBand && column.visibleWidth !== 'auto' && !this.option('legacyRendering') && this.option('columnAutoWidth')) {
            if(column.width || column.minWidth) {
                cell.style.minWidth = getWidthStyle(column.minWidth || column.width);
            }
            if(column.width) {
                setCellWidth(cell, column, getWidthStyle(column.width));
            }
        }

        return $cell;
    },

    _createRow: function(rowObject) {
        const $element = $('<tr>').addClass(ROW_CLASS);
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
                const isDataRow = $row.hasClass('dx-data-row');
                const isHeaderRow = $row.hasClass('dx-header-row');
                const isGroupRow = $row.hasClass(GROUP_ROW_CLASS);
                const isMasterDetailRow = $row.hasClass(DETAIL_ROW_CLASS);
                const isFilterRow = $row.hasClass(that.addWidgetPrefix(FILTER_ROW_CLASS));
                const visibleColumns = that._columnsController.getVisibleColumns();
                const rowOptions = $row.data('options');
                const columnIndex = $cell.index();
                const cellOptions = rowOptions && rowOptions.cells && rowOptions.cells[columnIndex];
                const column = cellOptions ? cellOptions.column : visibleColumns[columnIndex];
                const msieCorrection = browser.msie ? 1 : 0;

                if(!isMasterDetailRow && !isFilterRow && (!isDataRow || (isDataRow && column && !column.cellTemplate)) &&
                    (!isHeaderRow || (isHeaderRow && column && !column.headerCellTemplate)) &&
                    (!isGroupRow || (isGroupRow && column && (column.groupIndex === undefined || !column.groupCellTemplate)))) {
                    if($element.data(CELL_HINT_VISIBLE)) {
                        $element.removeAttr('title');
                        $element.data(CELL_HINT_VISIBLE, false);
                    }

                    const difference = $element[0].scrollWidth - $element[0].clientWidth - msieCorrection; // T598499
                    if(difference > 0 && !typeUtils.isDefined($element.attr('title'))) {
                        $element.attr('title', $element.text());
                        $element.data(CELL_HINT_VISIBLE, true);
                    }
                }
            }));
        }

        const getOptions = function(event) {
            const $cell = $(event.currentTarget);
            const $fieldItemContent = $(event.target).closest('.' + FORM_FIELD_ITEM_CONTENT_CLASS);
            const rowOptions = $cell.parent().data('options');
            const options = rowOptions && rowOptions.cells && rowOptions.cells[$cell.index()];

            if(!$cell.closest('table').is(event.delegateTarget)) return;

            const resultOptions = extend({}, options, {
                cellElement: getPublicElement($cell),
                event: event,
                eventType: event.type
            });

            if($fieldItemContent.length) {
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

        eventsEngine.on($table, clickEvent.name, '.dx-row > td', function(e) {
            const options = getOptions(e);
            options && that.executeAction('onCellClick', options);
        });

        eventsEngine.on($table, dblclickEvent.name, '.dx-row > td', function(e) {
            const options = getOptions(e);
            options && that.executeAction('onCellDblClick', options);
        });

        subscribeToRowEvents(that, $table);

        return $table;
    },

    _isNativeClick: noop,

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
        styleUtils.setWidth(col, width);

        return col;
    },

    renderDelayedTemplates: function() {
        const delayedTemplates = this._delayedTemplates;
        const syncTemplates = delayedTemplates.filter(template => !template.async);
        const asyncTemplates = delayedTemplates.filter(template => template.async);

        this._delayedTemplates = [];

        this._renderDelayedTemplatesCore(syncTemplates);
        this._renderDelayedTemplatesCoreAsync(asyncTemplates);
    },

    _renderDelayedTemplatesCoreAsync: function(templates) {
        const that = this;
        if(templates.length) {
            getWindow().setTimeout(function() {
                that._renderDelayedTemplatesCore(templates, true);
            });
        }
    },

    _renderDelayedTemplatesCore: function(templates, isAsync) {
        const date = new Date();

        while(templates.length) {
            const templateParameters = templates.shift();

            const options = templateParameters.options;
            const doc = domAdapter.getDocument();

            if(!isAsync || $(options.container).closest(doc).length) {
                templateParameters.template.render(options);
            }
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

        if(template && template.render && !typeUtils.isRenderer(template)) {
            renderingTemplate = {
                allowRenderToDetachedContainer: template.allowRenderToDetachedContainer,
                render: function(options) {
                    template.render(options.container, options.model);
                    options.deferred && options.deferred.resolve();
                }
            };
        } else if(typeUtils.isFunction(template)) {
            renderingTemplate = {
                render: function(options) {
                    const renderedTemplate = template(getPublicElement(options.container), options.model);
                    if(renderedTemplate && (renderedTemplate.nodeType || typeUtils.isRenderer(renderedTemplate))) {
                        options.container.append(renderedTemplate);
                    }
                    options.deferred && options.deferred.resolve();
                }
            };
        } else {
            const templateID = typeUtils.isString(template) ? template : $(template).attr('id');

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

    renderTemplate: function(container, template, options, allowRenderToDetachedContainer) {
        const that = this;
        const renderingTemplate = that._processTemplate(template, options);
        const column = options.column;
        const isDataRow = options.rowType === 'data';
        const templateDeferred = new Deferred();
        const templateOptions = {
            container: container,
            model: options,
            deferred: templateDeferred,
            onRendered: () => {
                templateDeferred.resolve();
            }
        };

        if(renderingTemplate) {
            options.component = that.component;

            const async = column && (
                (column.renderAsync && isDataRow) ||
                that.option('renderAsync') &&
                    (column.renderAsync !== false && (column.command || column.showEditorAlways) && isDataRow || options.rowType === 'filter')
            );

            if((renderingTemplate.allowRenderToDetachedContainer || allowRenderToDetachedContainer) && !async) {
                renderingTemplate.render(templateOptions);
            } else {
                that._delayedTemplates.push({ template: renderingTemplate, options: templateOptions, async: async });
            }
        } else {
            templateDeferred.reject();
        }

        return templateDeferred.promise();
    },

    _getBodies: function(tableElement) {
        return $(tableElement).children('tbody').not('.dx-header').not('.dx-footer');
    },

    _wrapRowIfNeed: function($table, $row) {
        const $tBodies = this.option('rowTemplate') && this._getBodies(this._tableElement || $table);

        if($tBodies && $tBodies.filter('.' + ROW_CLASS).length) {
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
            this.setAria('selected', false, $cell);
            this.setAria('role', 'gridcell', $cell);
            this.setAria('colindex', cellOptions.columnIndex + 1, $cell);
        }
    },

    _renderCell: function($row, options) {
        const cellOptions = this._getCellOptions(options);

        if(options.columnIndices) {
            if(options.row.cells) {
                options.row.cells[cellOptions.columnIndex] = cellOptions;
            }
        } else {
            options.row.cells.push(cellOptions);
        }

        const $cell = this._createCell(cellOptions);

        this._setCellAriaAttributes($cell, cellOptions);

        this._renderCellContent($cell, cellOptions);

        $row.get(0).appendChild($cell.get(0));

        return $cell;
    },

    _renderCellContent: function($cell, options) {
        const template = this._getCellTemplate(options);

        when(!template || this.renderTemplate($cell, template, options)).done(() => {
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

        source.watch = source.watch || function(getter, updateFunc) {
            let oldValue = getter(source.data);

            const watcher = function(row) {
                const newValue = getter(source.data);

                if(JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                    if(row) {
                        updateFunc(newValue, oldValue);
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

        source.update = source.update || function(row) {
            if(row) {
                this.data = options.data = row.data;
                this.rowIndex = options.rowIndex = row.rowIndex;
                this.dataIndex = options.dataIndex = row.dataIndex;
                this.isExpanded = options.isExpanded = row.isExpanded;

                if(options.row) {
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
        options.cellElement = getPublicElement($(cell));
        this.executeAction('onCellPrepared', options);
    },

    _rowPrepared: function($row, options) {
        dataUtils.data($row.get(0), 'options', options);

        options.rowElement = getPublicElement($row);
        this.executeAction('onRowPrepared', options);
    },

    _columnOptionChanged: function(e) {
        const optionNames = e.optionNames;

        if(checkChanges(optionNames, ['width', 'visibleWidth'])) {
            const visibleColumns = this._columnsController.getVisibleColumns();
            const widths = iteratorUtils.map(visibleColumns, function(column) {
                const width = column.visibleWidth || column.width;
                return typeUtils.isDefined(width) ? width : 'auto';
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
        return this._tableElement || $();
    },

    _getTableElement: function() {
        return this._tableElement;
    },

    _setTableElement: function(tableElement) {
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
        const that = this;
        that._scrollLeft = -1;
        that._columnsController = that.getController('columns');
        that._dataController = that.getController('data');
        that._delayedTemplates = [];
        that._templatesCache = {};
        that.createAction('onCellClick');
        that.createAction('onRowClick');
        that.createAction('onCellDblClick');
        that.createAction('onRowDblClick');
        that.createAction('onCellHoverChanged', { excludeValidators: ['disabled', 'readOnly'] });
        that.createAction('onCellPrepared', { excludeValidators: ['disabled', 'readOnly'], category: 'rendering' });
        that.createAction('onRowPrepared', {
            excludeValidators: ['disabled', 'readOnly'], category: 'rendering', afterExecute: function(e) {
                that._afterRowPrepared(e);
            } });

        that._columnsController.columnsChanged.add(that._columnOptionChanged.bind(that));
        that._dataController && that._dataController.changed.add(that._handleDataChanged.bind(that));
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

        if(typeUtils.isDefined(pos) && typeUtils.isDefined(pos.left) && this._scrollLeft !== pos.left) {
            this._scrollLeft = pos.left;
            $scrollContainer && $scrollContainer.scrollLeft(pos.left);
        }
    },

    _wrapTableInScrollContainer: function($table) {
        const $scrollContainer = $('<div>');

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

    _updateContent: function($newTableElement) {
        this._setTableElement($newTableElement);
        this._wrapTableInScrollContainer($newTableElement);
    },

    _findContentElement: noop,

    _getWidths: function($cellElements) {
        const result = [];
        const legacyRendering = this.option('legacyRendering');
        let width;

        if($cellElements) {
            iteratorUtils.each($cellElements, function(index, item) {
                width = item.offsetWidth;
                if(item.getBoundingClientRect) {
                    const clientRect = getBoundingRect(item);
                    if(clientRect.width > width - 1) {
                        width = legacyRendering ? Math.ceil(clientRect.width) : clientRect.width;
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

        $tableElement = $tableElement || that._getTableElement();

        if($tableElement) {
            $rows = $tableElement.children('tbody').children();

            for(let i = 0; i < $rows.length; i++) {
                const $row = $rows.eq(i);
                const isRowVisible = $row.get(0).style.display !== 'none' && !$row.hasClass('dx-state-invisible');
                if(!$row.is('.' + GROUP_ROW_CLASS) && !$row.is('.' + DETAIL_ROW_CLASS) && isRowVisible) {
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
        const legacyRendering = this.option('legacyRendering');

        $tableElement = $tableElement || this._getTableElement();

        if($tableElement && $tableElement.length && widths) {
            columnIndex = 0;
            $cols = $tableElement.children('colgroup').children('col');
            styleUtils.setWidth($cols, 'auto');
            columns = columns || this.getColumns(null, $tableElement);

            for(let i = 0; i < columns.length; i++) {
                if(!legacyRendering && columnAutoWidth && !fixed) {
                    width = columns[i].width;

                    if(width && !columns[i].command) {
                        width = columns[i].visibleWidth || width;

                        width = getWidthStyle(width);
                        minWidth = getWidthStyle(columns[i].minWidth || width);
                        var $rows = $rows || $tableElement.children().children('.dx-row').not('.' + GROUP_ROW_CLASS).not('.' + DETAIL_ROW_CLASS);
                        for(let rowIndex = 0; rowIndex < $rows.length; rowIndex++) {
                            const visibleIndex = this.getVisibleColumnIndex(i, rowIndex);
                            const cell = $rows[rowIndex].cells[visibleIndex];
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
                styleUtils.setWidth($cols.eq(columnIndex), typeUtils.isDefined(width) ? width : 'auto');

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

        if(typeUtils.isString(columnIdentifier)) {
            const columnIndex = this._columnsController.columnOption(columnIdentifier, 'index');
            return this._columnsController.getVisibleIndex(columnIndex);
        }

        return columnIdentifier;
    },

    getColumnElements: function() {},

    getColumns: function(rowIndex) {
        return this._columnsController.getVisibleColumns(rowIndex);
    },

    getCell: function(cellPosition, rows) {
        const $rows = rows || this._getRowElements();
        let $cells;

        if($rows.length > 0 && cellPosition.rowIndex >= 0) {
            if(this.option('scrolling.mode') !== 'virtual') {
                cellPosition.rowIndex = cellPosition.rowIndex < $rows.length ? cellPosition.rowIndex : $rows.length - 1;
            }
            $cells = this.getCellElements(cellPosition.rowIndex);
            if($cells && $cells.length > 0) {
                return $cells.eq($cells.length > cellPosition.columnIndex ? cellPosition.columnIndex : $cells.length - 1);
            }
        }
    },

    getRowsCount: function() {
        const tableElement = this._getTableElement();

        if(tableElement && tableElement.length === 1) {
            return tableElement[0].rows.length;
        }
        return 0;
    },

    _getRowElementsCore: function(tableElement) {
        tableElement = tableElement || this._getTableElement();

        if(tableElement) {
            const tBodies = this.option('rowTemplate') && tableElement.find('> tbody.' + ROW_CLASS);

            return tBodies && tBodies.length ? tBodies : tableElement.find('> tbody > ' + '.' + ROW_CLASS + ', > .' + ROW_CLASS);
        }

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
            return isHorizontal ? ($tableElement.outerWidth() - $element.width() > 0) : ($tableElement.outerHeight() - $element.height() > 0);
        }

        return false;
    }
});
