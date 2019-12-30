import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import * as eventUtils from '../../events/utils';
import clickEvent from '../../events/click';
import typeUtils from '../../core/utils/type';
import browser from '../../core/utils/browser';
import Guid from '../../core/guid';
import modules from './ui.grid_core.modules';
import Form from '../form';
import gridCoreUtils from './ui.grid_core.utils';
import themes from '../themes';
import { getWindow } from '../../core/utils/window';
import { equalByValue } from '../../core/utils/common';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import { Deferred, when } from '../../core/utils/deferred';

const COLUMN_HEADERS_VIEW = 'columnHeadersView';
const ROWS_VIEW = 'rowsView';
const FOOTER_VIEW = 'footerView';
const COLUMN_VIEWS = [COLUMN_HEADERS_VIEW, ROWS_VIEW, FOOTER_VIEW];

const ADAPTIVE_NAMESPACE = 'dxDataGridAdaptivity';
const HIDDEN_COLUMNS_WIDTH = 'adaptiveHidden';
const ADAPTIVE_ROW_TYPE = 'detailAdaptive';

const FORM_ITEM_CONTENT_CLASS = 'dx-field-item-content';
const FORM_ITEM_MODIFIED = 'dx-item-modified';

const HIDDEN_COLUMN_CLASS = 'hidden-column';
const ADAPTIVE_COLUMN_BUTTON_CLASS = 'adaptive-more';
const ADAPTIVE_COLUMN_NAME_CLASS = 'dx-command-adaptive';
const COMMAND_ADAPTIVE_HIDDEN_CLASS = 'dx-command-adaptive-hidden';
const ADAPTIVE_DETAIL_ROW_CLASS = 'dx-adaptive-detail-row';
const ADAPTIVE_ITEM_TEXT_CLASS = 'dx-adaptive-item-text';
const MASTER_DETAIL_CELL_CLASS = 'dx-master-detail-cell';
const LAST_DATA_CELL_CLASS = 'dx-last-data-cell';
const ADAPTIVE_COLUMN_NAME = 'adaptive';
const EDIT_MODE_BATCH = 'batch';
const EDIT_MODE_ROW = 'row';
const EDIT_MODE_FORM = 'form';
const EDIT_MODE_POPUP = 'popup';
const REVERT_TOOLTIP_CLASS = 'revert-tooltip';

function getColumnId(that, column) {
    return that._columnsController.getColumnId(column);
}

function getDataCellElements($row) {
    return $row.find('td:not(.dx-datagrid-hidden-column):not([class*=\'dx-command-\'])');
}

function adaptiveCellTemplate(container, options) {
    let $adaptiveColumnButton;
    const $container = $(container);
    const adaptiveColumnsController = options.component.getController('adaptiveColumns');

    if(options.rowType === 'data') {
        $adaptiveColumnButton = $('<span>').addClass(adaptiveColumnsController.addWidgetPrefix(ADAPTIVE_COLUMN_BUTTON_CLASS));
        eventsEngine.on($adaptiveColumnButton, eventUtils.addNamespace(clickEvent.name, ADAPTIVE_NAMESPACE), adaptiveColumnsController.createAction(function() {
            adaptiveColumnsController.toggleExpandAdaptiveDetailRow(options.key);
        }));
        $adaptiveColumnButton.appendTo($container);
    } else {
        gridCoreUtils.setEmptyText($container);
    }
}

const AdaptiveColumnsController = modules.ViewController.inherit({
    _isRowEditMode: function() {
        const editMode = this._getEditMode();
        return editMode === EDIT_MODE_ROW;
    },

    _isItemModified: function(item, cellOptions) {
        const columnIndex = this._columnsController.getVisibleIndex(item.column.index);
        const rowIndex = this._dataController.getRowIndexByKey(cellOptions.key);
        const row = this._dataController.items()[rowIndex + 1];

        return row && row.modifiedValues && typeUtils.isDefined(row.modifiedValues[columnIndex]);
    },

    _renderFormViewTemplate: function(item, cellOptions, $container) {
        const that = this;
        const column = item.column;
        const focusAction = that.createAction(function() {
            eventsEngine.trigger($container, clickEvent.name);
        });
        let container;
        const value = column.calculateCellValue(cellOptions.data);
        const displayValue = gridCoreUtils.getDisplayValue(column, value, cellOptions.data, cellOptions.rowType);
        const text = gridCoreUtils.formatValue(displayValue, column);
        const isCellOrBatchEditMode = this._editingController.isCellOrBatchEditMode();

        if(column.allowEditing && that.getController('keyboardNavigation').isKeyboardEnabled()) {
            $container.attr('tabIndex', that.option('tabIndex'));

            if(isCellOrBatchEditMode) {
                eventsEngine.off($container, 'focus', focusAction);
                eventsEngine.on($container, 'focus', focusAction);
            }
        }

        if(column.cellTemplate) {
            const templateOptions = extend({}, cellOptions, { value: value, displayValue: displayValue, text: text, column: column });
            that._rowsView.renderTemplate($container, column.cellTemplate, templateOptions, !!$container.closest(getWindow().document).length);
        } else {
            container = $container.get(0);
            if(column.encodeHtml) {
                container.textContent = text;
            } else {
                container.innerHTML = text;
            }

            $container.addClass(ADAPTIVE_ITEM_TEXT_CLASS);
            if(!typeUtils.isDefined(text) || text === '') {
                $container.html('&nbsp;');
            }

            if(!that._isRowEditMode()) {
                if(that._isItemModified(item, cellOptions)) {
                    $container.addClass(FORM_ITEM_MODIFIED);
                }
            }
        }

        that.getView('rowsView')._cellPrepared($container, cellOptions);
    },

    _getTemplate: function(item, cellOptions) {
        const that = this;
        const column = item.column;
        const editingController = this.getController('editing');

        return function(options, container) {
            const $container = $(container);
            const columnIndex = that._columnsController.getVisibleIndex(column.visibleIndex);
            const templateOptions = extend({}, cellOptions);

            const renderFormTemplate = function() {
                const isItemEdited = that._isItemEdited(item);
                templateOptions.value = cellOptions.row.values[columnIndex];
                if(isItemEdited || column.showEditorAlways) {
                    editingController.renderFormEditTemplate(templateOptions, item, options.component, $container, !isItemEdited);
                } else {
                    templateOptions.column = column;
                    templateOptions.columnIndex = columnIndex;
                    that._renderFormViewTemplate(item, templateOptions, $container);
                }
            };

            renderFormTemplate();
            templateOptions.watch && templateOptions.watch(function() {
                return {
                    isItemEdited: that._isItemEdited(item),
                    value: cellOptions.row.values[columnIndex]
                };
            }, function() {
                $container.contents().remove();
                $container.removeClass(ADAPTIVE_ITEM_TEXT_CLASS);
                renderFormTemplate();
            });
        };
    },

    _isVisibleColumnsValid: function(visibleColumns) {
        const getCommandColumnsCount = function() {
            let result = 0;
            let j;
            let visibleColumn;

            for(j = 0; j < visibleColumns.length; j++) {
                visibleColumn = visibleColumns[j];
                if(visibleColumn.command) {
                    result++;
                }
            }
            return result;
        };

        if(visibleColumns < 2) {
            return false;
        }

        if(visibleColumns.length - getCommandColumnsCount() <= 1) {
            return false;
        }

        return true;
    },

    _calculatePercentWidths: function(widths, visibleColumns) {
        const that = this;
        let percentWidths = 0;

        visibleColumns.forEach(function(item, index) {
            if(widths[index] !== HIDDEN_COLUMNS_WIDTH) {
                percentWidths += that._getItemPercentWidth(item);
            }
        });

        return percentWidths;
    },

    _isPercentWidth: function(width) {
        return typeUtils.isString(width) && width.slice(-1) === '%';
    },

    _isColumnHidden: function(column) {
        return this._hiddenColumns.filter(function(hiddenColumn) {
            return hiddenColumn.index === column.index;
        }).length > 0;
    },

    _getAverageColumnsWidth: function(containerWidth, columns, columnsCanFit) {
        const that = this;
        let fixedColumnsWidth = 0;
        let columnsWithoutFixedWidthCount = 0;

        columns.forEach(function(column) {
            if(!that._isColumnHidden(column)) {
                const width = column.width;
                if(typeUtils.isDefined(width) && !isNaN(parseFloat(width))) {
                    fixedColumnsWidth += that._isPercentWidth(width) ? that._calculatePercentWidth({
                        visibleIndex: column.visibleIndex,
                        columnsCount: columns.length,
                        columnsCanFit: columnsCanFit,
                        bestFitWidth: column.bestFitWidth,
                        columnWidth: width,
                        containerWidth: containerWidth
                    }) : parseFloat(width);
                } else {
                    columnsWithoutFixedWidthCount++;
                }
            }
        });
        return (containerWidth - fixedColumnsWidth) / columnsWithoutFixedWidthCount;
    },

    _calculateColumnWidth: function(column, containerWidth, contentColumns, columnsCanFit) {
        const columnId = getColumnId(this, column);
        const widthOption = this._columnsController.columnOption(columnId, 'width');
        const bestFitWidth = this._columnsController.columnOption(columnId, 'bestFitWidth');
        const columnsCount = contentColumns.length;
        let colWidth;

        if(widthOption && widthOption !== 'auto') {
            if(this._isPercentWidth(widthOption)) {
                colWidth = this._calculatePercentWidth({
                    visibleIndex: column.visibleIndex,
                    columnsCount: columnsCount,
                    columnsCanFit: columnsCanFit,
                    bestFitWidth: bestFitWidth,
                    columnWidth: widthOption,
                    containerWidth: containerWidth
                });
            } else {
                return widthOption;
            }
        } else {
            const columnAutoWidth = this.option('columnAutoWidth');
            colWidth = columnAutoWidth || !!column.command ? bestFitWidth : this._getAverageColumnsWidth(containerWidth, contentColumns, columnsCanFit);
        }

        return colWidth;
    },

    _calculatePercentWidth: function(options) {
        const columnFitted = (options.visibleIndex < options.columnsCount - 1) && options.columnsCanFit;
        const partialWidth = options.containerWidth * parseFloat(options.columnWidth) / 100;
        const resultWidth = options.columnsCanFit && (partialWidth < options.bestFitWidth) ? options.bestFitWidth : partialWidth;

        return columnFitted ? options.containerWidth * parseFloat(options.columnWidth) / 100 : resultWidth;
    },

    _getNotTruncatedColumnWidth: function(column, containerWidth, contentColumns, columnsCanFit) {
        const columnId = getColumnId(this, column);
        const widthOption = this._columnsController.columnOption(columnId, 'width');
        const bestFitWidth = this._columnsController.columnOption(columnId, 'bestFitWidth');
        let colWidth;

        if(widthOption && widthOption !== 'auto' && !this._isPercentWidth(widthOption)) {
            return parseFloat(widthOption);
        }

        colWidth = this._calculateColumnWidth(column, containerWidth, contentColumns, columnsCanFit);

        return colWidth < bestFitWidth ? null : colWidth;
    },

    _getItemPercentWidth: function(item) {
        let result = 0;

        if(item.width && this._isPercentWidth(item.width)) {
            result = parseFloat(item.width);
        }

        return result;
    },

    _getCommandColumnsWidth: function() {
        const that = this;
        const columns = that._columnsController.getVisibleColumns();
        let colWidth = 0;

        each(columns, function(index, column) {
            if(column.index < 0 || column.command) {
                colWidth += that._columnsController.columnOption(getColumnId(that, column), 'bestFitWidth') || 0;
            }
        });

        return colWidth;
    },

    _isItemEdited: function(item) {
        if(this.isFormEditMode()) {
            return false;
        }

        if(this._isRowEditMode()) {
            const editRowKey = this._editingController.getEditRowKey();
            if(equalByValue(editRowKey, this._dataController.adaptiveExpandedKey())) {
                return true;
            }
        } else {
            const rowIndex = this._dataController.getRowIndexByKey(this._dataController.adaptiveExpandedKey()) + 1;
            const columnIndex = this._columnsController.getVisibleIndex(item.column.index);

            return this._editingController.isEditCell(rowIndex, columnIndex);
        }
    },

    _getFormItemsByHiddenColumns: function(hiddenColumns) {
        const items = [];
        each(hiddenColumns, function(_, column) {
            items.push({
                column: column,
                name: column.name,
                dataField: column.dataField,
                visibleIndex: column.visibleIndex
            });
        });

        return items;
    },

    _getAdaptiveColumnVisibleIndex: function(visibleColumns) {
        let i;
        let column;

        for(i = 0; i < visibleColumns.length; i++) {
            column = visibleColumns[i];
            if(column.command === ADAPTIVE_COLUMN_NAME) {
                return i;
            }
        }
    },

    _hideAdaptiveColumn: function(resultWidths, visibleColumns) {
        const visibleIndex = this._getAdaptiveColumnVisibleIndex(visibleColumns);
        if(typeUtils.isDefined(visibleIndex)) {
            resultWidths[visibleIndex] = HIDDEN_COLUMNS_WIDTH;
            this._addCssClassToColumn(COMMAND_ADAPTIVE_HIDDEN_CLASS, visibleIndex);
        }
    },

    _removeCssClassFromColumn: function(cssClassName) {
        let i;
        let view;
        let $cells;

        for(i = 0; i < COLUMN_VIEWS.length; i++) {
            view = this.getView(COLUMN_VIEWS[i]);
            if(view && view.isVisible() && view.element()) {
                $cells = view.element().find('.' + cssClassName);
                $cells.removeClass(cssClassName);
            }
        }
    },

    _removeCssClassesFromColumns: function() {
        this._removeCssClassFromColumn(COMMAND_ADAPTIVE_HIDDEN_CLASS);
        this._removeCssClassFromColumn(this.addWidgetPrefix(HIDDEN_COLUMN_CLASS));
    },

    _isCellValid: function($cell) {
        return $cell && $cell.length && !$cell.hasClass(MASTER_DETAIL_CELL_CLASS);
    },

    _addCssClassToColumn: function(cssClassName, visibleIndex) {
        const that = this;
        COLUMN_VIEWS.forEach(function(viewName) {
            const view = that.getView(viewName);
            view && that._addCssClassToViewColumn(view, cssClassName, visibleIndex);
        });
    },

    _addCssClassToViewColumn: function(view, cssClassName, visibleIndex) {
        const viewName = view.name;
        let rowsCount;
        let rowIndex;
        let $cellElement;
        let currentVisibleIndex;
        const column = this._columnsController.getVisibleColumns()[visibleIndex];
        const editFormRowIndex = this._editingController && this._editingController.getEditFormRowIndex();

        if(view && view.isVisible() && column) {
            rowsCount = view.getRowsCount();
            const $rowElements = view._getRowElements();
            for(rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
                if(rowIndex !== editFormRowIndex || viewName !== ROWS_VIEW) {
                    currentVisibleIndex = viewName === COLUMN_HEADERS_VIEW ? this._columnsController.getVisibleIndex(column.index, rowIndex) : visibleIndex;
                    if(currentVisibleIndex >= 0) {
                        $cellElement = $rowElements.eq(rowIndex).children().eq(currentVisibleIndex);
                        this._isCellValid($cellElement) && $cellElement.addClass(cssClassName);
                    }
                }
            }
        }
    },

    _getEditMode: function() {
        return this._editingController.getEditMode();
    },

    isFormEditMode: function() {
        const editMode = this._getEditMode();

        return editMode === EDIT_MODE_FORM || editMode === EDIT_MODE_POPUP;
    },

    hideRedundantColumns: function(resultWidths, visibleColumns, hiddenQueue) {
        const that = this;
        let visibleColumn;

        this._hiddenColumns = [];

        if(that._isVisibleColumnsValid(visibleColumns) && hiddenQueue.length) {
            let totalWidth = 0;
            let percentWidths;
            const $rootElement = that.component.$element();
            let rootElementWidth = $rootElement.width() - that._getCommandColumnsWidth();
            const getVisibleContentColumns = function() {
                return visibleColumns.filter(item => !item.command && this._hiddenColumns.filter(i => i.dataField === item.dataField).length === 0);
            }.bind(this);
            let visibleContentColumns = getVisibleContentColumns();
            const contentColumnsCount = visibleContentColumns.length;
            let columnsCanFit;
            let i;
            let hasHiddenColumns;
            let needHideColumn;

            do {
                needHideColumn = false;
                totalWidth = 0;

                percentWidths = that._calculatePercentWidths(resultWidths, visibleColumns);

                columnsCanFit = percentWidths < 100 && percentWidths !== 0;
                for(i = 0; i < visibleColumns.length; i++) {
                    visibleColumn = visibleColumns[i];

                    let columnWidth = that._getNotTruncatedColumnWidth(visibleColumn, rootElementWidth, visibleContentColumns, columnsCanFit);
                    const columnId = getColumnId(that, visibleColumn);
                    const widthOption = that._columnsController.columnOption(columnId, 'width');
                    const minWidth = that._columnsController.columnOption(columnId, 'minWidth');
                    const columnBestFitWidth = that._columnsController.columnOption(columnId, 'bestFitWidth');

                    if(resultWidths[i] === HIDDEN_COLUMNS_WIDTH) {
                        hasHiddenColumns = true;
                        continue;
                    }
                    if(!columnWidth && !visibleColumn.command && !visibleColumn.fixed) {
                        needHideColumn = true;
                        break;
                    }

                    if(!widthOption || widthOption === 'auto') {
                        columnWidth = Math.max(columnBestFitWidth || 0, minWidth || 0);
                    }

                    if(visibleColumn.command !== ADAPTIVE_COLUMN_NAME || hasHiddenColumns) {
                        totalWidth += columnWidth;
                    }
                }

                needHideColumn = needHideColumn || totalWidth > $rootElement.width();

                if(needHideColumn) {
                    const column = hiddenQueue.pop();
                    const visibleIndex = that._columnsController.getVisibleIndex(column.index);

                    rootElementWidth += that._calculateColumnWidth(column, rootElementWidth, visibleContentColumns, columnsCanFit);

                    that._addCssClassToColumn(that.addWidgetPrefix(HIDDEN_COLUMN_CLASS), visibleIndex);
                    resultWidths[visibleIndex] = HIDDEN_COLUMNS_WIDTH;
                    this._hiddenColumns.push(column);
                    visibleContentColumns = getVisibleContentColumns();
                }
            }
            while(needHideColumn && visibleContentColumns.length > 1 && hiddenQueue.length);

            if(contentColumnsCount === visibleContentColumns.length) {
                that._hideAdaptiveColumn(resultWidths, visibleColumns);
            }
        } else {
            that._hideAdaptiveColumn(resultWidths, visibleColumns);
        }
    },

    getItemContentByColumnIndex: function(visibleColumnIndex) {
        let $itemContent;
        let i;
        let item;

        for(i = 0; i < this._$itemContents.length; i++) {
            $itemContent = this._$itemContents.eq(i);
            item = $itemContent.data('dx-form-item');
            if(item && item.column && this._columnsController.getVisibleIndex(item.column.index) === visibleColumnIndex) {
                return $itemContent;
            }
        }
    },

    toggleExpandAdaptiveDetailRow: function(key, alwaysExpanded) {
        if(!(this.isFormEditMode() && this._editingController.isEditing())) {
            this.getController('data').toggleExpandAdaptiveDetailRow(key, alwaysExpanded);
        }
    },

    createFormByHiddenColumns: function(container, options) {
        const that = this;
        const $container = $(container);
        const userFormOptions = {
            items: that._getFormItemsByHiddenColumns(that._hiddenColumns),
            formID: 'dx-' + new Guid()
        };
        const defaultFormOptions = themes.isMaterial() ? { colCount: 2 } : {};

        this.executeAction('onAdaptiveDetailRowPreparing', { formOptions: userFormOptions });

        that._$itemContents = null;

        that._form = that._createComponent($('<div>').appendTo($container), Form, extend(defaultFormOptions, userFormOptions, {
            customizeItem: function(item) {
                const column = item.column || that._columnsController.columnOption(item.name || item.dataField);
                if(column) {
                    item.label = item.label || {};
                    item.label.text = item.label.text || column.caption;
                    item.column = column;
                    item.template = that._getTemplate(item, options, that.updateForm.bind(that));
                }
                userFormOptions.customizeItem && userFormOptions.customizeItem.call(this, item);
            },
            onContentReady: function(e) {
                userFormOptions.onContentReady && userFormOptions.onContentReady.call(this, e);
                that._$itemContents = $container.find('.' + FORM_ITEM_CONTENT_CLASS);
            }
        }));
    },

    hasAdaptiveDetailRowExpanded: function() {
        return typeUtils.isDefined(this._dataController.adaptiveExpandedKey());
    },

    updateForm: function(hiddenColumns) {
        if(this.hasAdaptiveDetailRowExpanded()) {
            if(this._form && typeUtils.isDefined(this._form._contentReadyAction)) {
                if(hiddenColumns && hiddenColumns.length) {
                    this._form.option('items', this._getFormItemsByHiddenColumns(hiddenColumns));
                } else {
                    this._form.repaint();
                }
            }
        }
    },

    updateHidingQueue: function(columns) {
        const that = this;
        const hideableColumns = columns.filter(function(column) {
            return column.visible && !column.type && !column.fixed && !(typeUtils.isDefined(column.groupIndex) && column.groupIndex >= 0);
        });
        let columnsHasHidingPriority;
        let i;

        that._hidingColumnsQueue = [];

        if(that.option('allowColumnResizing') && that.option('columnResizingMode') === 'widget') {
            return that._hidingColumnsQueue;
        }

        for(i = 0; i < hideableColumns.length; i++) {
            if(typeUtils.isDefined(hideableColumns[i].hidingPriority) && hideableColumns[i].hidingPriority >= 0) {
                columnsHasHidingPriority = true;
                that._hidingColumnsQueue[hideableColumns[i].hidingPriority] = hideableColumns[i];
            }
        }

        if(columnsHasHidingPriority) {
            that._hidingColumnsQueue.reverse();
        } else if(that.option('columnHidingEnabled')) {
            for(i = 0; i < hideableColumns.length; i++) {
                const visibleIndex = that._columnsController.getVisibleIndex(hideableColumns[i].index);
                that._hidingColumnsQueue[visibleIndex] = hideableColumns[i];
            }
        }

        that._hidingColumnsQueue = that._hidingColumnsQueue.filter(Object);
        return that._hidingColumnsQueue;
    },

    getHiddenColumns: function() {
        return this._hiddenColumns;
    },

    hasHiddenColumns: function() {
        return this._hiddenColumns.length > 0;
    },

    getHidingColumnsQueue: function() {
        return this._hidingColumnsQueue;
    },

    init: function() {
        const that = this;
        that._columnsController = that.getController('columns');
        that._dataController = that.getController('data');
        that._rowsView = that.getView('rowsView');

        that._columnsController.addCommandColumn({
            type: ADAPTIVE_COLUMN_NAME,
            command: ADAPTIVE_COLUMN_NAME,
            visible: true,
            adaptiveHidden: true,
            cssClass: ADAPTIVE_COLUMN_NAME_CLASS,
            alignment: 'center',
            width: 'auto',
            cellTemplate: adaptiveCellTemplate,
            fixedPosition: 'right'
        });

        that._columnsController.columnsChanged.add(function() {
            const isAdaptiveVisible = !!that.updateHidingQueue(that._columnsController.getColumns()).length;
            that._columnsController.columnOption('command:adaptive', 'adaptiveHidden', !isAdaptiveVisible, true);
        });
        that._editingController = that.getController('editing');
        that._hidingColumnsQueue = [];
        that._hiddenColumns = [];
        that.createAction('onAdaptiveDetailRowPreparing');

        that.callBase();
    },

    optionChanged: function(args) {
        if(args.name === 'columnHidingEnabled') {
            this._columnsController.columnOption('command:adaptive', 'adaptiveHidden', !args.value);
        }

        this.callBase(args);
    },

    publicMethods: function() {
        return ['isAdaptiveDetailRowExpanded', 'expandAdaptiveDetailRow', 'collapseAdaptiveDetailRow'];
    },

    /**
     * @name GridBaseMethods.isAdaptiveDetailRowExpanded
     * @publicName isAdaptiveDetailRowExpanded(key)
     * @param1 key:any
     * @return boolean
     */
    isAdaptiveDetailRowExpanded: function(key) {
        return this._dataController.adaptiveExpandedKey() && equalByValue(this._dataController.adaptiveExpandedKey(), key);
    },

    /**
    * @name GridBaseMethods.expandAdaptiveDetailRow
    * @publicName expandAdaptiveDetailRow(key)
    * @param1 key:any
    */
    expandAdaptiveDetailRow: function(key) {
        if(!this.hasAdaptiveDetailRowExpanded()) {
            this.toggleExpandAdaptiveDetailRow(key);
        }
    },

    /**
    * @name GridBaseMethods.collapseAdaptiveDetailRow
    * @publicName collapseAdaptiveDetailRow()
    */
    collapseAdaptiveDetailRow: function() {
        if(this.hasAdaptiveDetailRowExpanded()) {
            this.toggleExpandAdaptiveDetailRow();
        }
    }
});

module.exports = {
    defaultOptions: function() {
        return {
            /**
            * @name GridBaseOptions.columnHidingEnabled
            * @type boolean
            * @default false
            */
            columnHidingEnabled: false,
            /**
            * @name GridBaseOptions.onAdaptiveDetailRowPreparing
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 formOptions:object
            * @action
            */
            onAdaptiveDetailRowPreparing: null
        };
    },
    controllers: {
        adaptiveColumns: AdaptiveColumnsController
    },
    extenders: {
        views: {
            rowsView: {
                _getCellTemplate: function(options) {
                    const that = this;
                    const column = options.column;

                    if(options.rowType === ADAPTIVE_ROW_TYPE && column.command === 'detail') {
                        return function(container, options) {
                            that._adaptiveColumnsController.createFormByHiddenColumns($(container), options);
                        };
                    }
                    return that.callBase(options);
                },

                _createRow: function(row) {
                    const $row = this.callBase(row);

                    if(row && row.rowType === ADAPTIVE_ROW_TYPE && row.key === this._dataController.adaptiveExpandedKey()) {
                        $row.addClass(ADAPTIVE_DETAIL_ROW_CLASS);
                    }
                    return $row;
                },

                _renderCells: function($row, options) {
                    this.callBase($row, options);

                    const hidingColumnsQueueLength = this._adaptiveColumnsController.getHidingColumnsQueue().length;
                    const hiddenColumnsLength = this._adaptiveColumnsController.getHiddenColumns().length;

                    if(hidingColumnsQueueLength && !hiddenColumnsLength) {
                        getDataCellElements($row).last().addClass(LAST_DATA_CELL_CLASS);
                    }
                },

                _getColumnIndexByElementCore: function($element) {
                    const $itemContent = $element.closest('.' + FORM_ITEM_CONTENT_CLASS);
                    if($itemContent.length && $itemContent.closest(this.component.$element()).length) {
                        const formItem = $itemContent.length ? $itemContent.first().data('dx-form-item') : null;
                        return formItem && formItem.column && this._columnsController.getVisibleIndex(formItem.column.index);
                    } else {
                        return this.callBase($element);
                    }
                },

                _cellPrepared: function($cell, options) {
                    this.callBase.apply(this, arguments);

                    if(options.row.rowType !== ADAPTIVE_ROW_TYPE && options.column.visibleWidth === HIDDEN_COLUMNS_WIDTH) {
                        $cell.addClass(this.addWidgetPrefix(HIDDEN_COLUMN_CLASS));
                    }
                },

                _getCellElement: function(rowIndex, columnIdentifier) {
                    const item = this._dataController.items()[rowIndex];

                    if(item && item.rowType === ADAPTIVE_ROW_TYPE) {
                        return this._adaptiveColumnsController.getItemContentByColumnIndex(columnIdentifier);
                    } else {
                        return this.callBase(rowIndex, columnIdentifier);
                    }
                },

                getContextMenuItems: function(options) {
                    if(options.row && options.row.rowType === 'detailAdaptive') {
                        const view = this.component.getView('columnHeadersView');
                        const formItem = $(options.targetElement).closest('.dx-field-item-label').next().data('dx-form-item');
                        options.column = formItem ? formItem.column : options.column;
                        return view.getContextMenuItems && view.getContextMenuItems(options);
                    }
                    return this.callBase && this.callBase(options);
                },

                isClickableElement: function($target) {
                    const isClickable = this.callBase ? this.callBase($target) : false;

                    return isClickable || !!$target.closest('.' + ADAPTIVE_COLUMN_NAME_CLASS).length;
                },

                init: function() {
                    this.callBase();
                    this._adaptiveColumnsController = this.getController('adaptiveColumns');
                }
            }
        },
        controllers: {
            export: {
                _updateColumnWidth: function(column, width) {
                    this.callBase(column, column.visibleWidth === HIDDEN_COLUMNS_WIDTH ? column.bestFitWidth : width);
                }
            },
            columnsResizer: {
                _pointCreated: function(point, cellsLength, columns) {
                    const result = this.callBase(point, cellsLength, columns);
                    const currentColumn = columns[point.columnIndex] || {};
                    const nextColumnIndex = this._getNextColumnIndex(point.columnIndex);
                    const nextColumn = columns[nextColumnIndex] || {};
                    const hasHiddenColumnsOnly = nextColumnIndex !== point.columnIndex + 1 && nextColumn.command;
                    const hasAdaptiveHiddenWidth = currentColumn.visibleWidth === HIDDEN_COLUMNS_WIDTH || hasHiddenColumnsOnly;

                    return result || hasAdaptiveHiddenWidth;
                },
                _getNextColumnIndex: function(currentColumnIndex) {
                    const visibleColumns = this._columnsController.getVisibleColumns();
                    let index = this.callBase(currentColumnIndex);

                    while(visibleColumns[index] && visibleColumns[index].visibleWidth === HIDDEN_COLUMNS_WIDTH) {
                        index++;
                    }

                    return index;
                }
            },
            draggingHeader: {
                _pointCreated: function(point, columns, location, sourceColumn) {
                    const result = this.callBase(point, columns, location, sourceColumn);
                    const column = columns[point.columnIndex - 1] || {};
                    const hasAdaptiveHiddenWidth = column.visibleWidth === HIDDEN_COLUMNS_WIDTH;

                    return result || hasAdaptiveHiddenWidth;
                }
            },
            editing: {
                _isRowEditMode: function() {
                    return this.getEditMode() === EDIT_MODE_ROW;
                },

                _getFormEditItemTemplate: function(cellOptions, column) {
                    if(this.getEditMode() !== EDIT_MODE_ROW && cellOptions.rowType === 'detailAdaptive') {
                        cellOptions.columnIndex = this._columnsController.getVisibleIndex(column.index);
                        return this.getColumnTemplate(cellOptions);
                    }

                    return this.callBase(cellOptions, column);
                },

                _closeEditItem: function($targetElement) {
                    const $itemContents = $targetElement.closest('.' + FORM_ITEM_CONTENT_CLASS);
                    const rowIndex = this._dataController.getRowIndexByKey(this._dataController.adaptiveExpandedKey()) + 1;
                    const formItem = $itemContents.length ? $itemContents.first().data('dx-form-item') : null;
                    const columnIndex = formItem && formItem.column && this._columnsController.getVisibleIndex(formItem.column.index);

                    if(!this.isEditCell(rowIndex, columnIndex)) {
                        this.callBase($targetElement);
                    }
                },

                _beforeUpdateItems: function(rowIndices, rowIndex) {
                    if(!this._adaptiveController.isFormEditMode() && this._adaptiveController.hasHiddenColumns()) {
                        const items = this._dataController.items();
                        const item = items[rowIndex];
                        const oldExpandRowIndex = gridCoreUtils.getIndexByKey(this._dataController.adaptiveExpandedKey(), items);

                        this._isForceRowAdaptiveExpand = !this._adaptiveController.hasAdaptiveDetailRowExpanded();

                        if(oldExpandRowIndex >= 0 && rowIndex > oldExpandRowIndex) {
                            this._editRowIndex--;
                        }

                        if(oldExpandRowIndex >= 0) {
                            rowIndices.push(oldExpandRowIndex + 1);
                        }

                        rowIndices.push(rowIndex + 1);
                        this._dataController.adaptiveExpandedKey(item.key);
                    }
                },

                _afterInsertRow: function(options) {
                    this.callBase(options);

                    if(this._adaptiveController.hasHiddenColumns()) {
                        this._adaptiveController.toggleExpandAdaptiveDetailRow(options.key, this.isRowEditMode());
                        this._isForceRowAdaptiveExpand = true;
                    }
                },

                _collapseAdaptiveDetailRow: function() {
                    if(this._isRowEditMode() && this._isForceRowAdaptiveExpand) {
                        this._adaptiveController.collapseAdaptiveDetailRow();
                        this._isForceRowAdaptiveExpand = false;
                    }
                },

                _cancelEditAdaptiveDetailRow: function() {
                    if(this._adaptiveController.hasHiddenColumns()) {
                        this._collapseAdaptiveDetailRow();
                    }
                },

                _afterSaveEditData: function() {
                    this.callBase();
                    const deferred = new Deferred();
                    if(this._isRowEditMode() && this._adaptiveController.hasHiddenColumns()) {
                        when(this.getController('validating').validate(true)).done((isValid) => {
                            if(isValid) {
                                this._cancelEditAdaptiveDetailRow();
                            }
                            deferred.resolve();
                        });
                    } else {
                        deferred.resolve();
                    }
                    return deferred.promise();
                },

                _beforeCancelEditData: function() {
                    this.callBase();
                    this._cancelEditAdaptiveDetailRow();
                },

                _getRowIndicesForCascadeUpdating: function(row) {
                    const rowIndices = this.callBase.apply(this, arguments);

                    if(this._adaptiveController.isAdaptiveDetailRowExpanded(row.key)) {
                        rowIndices.push(row.rowType === ADAPTIVE_ROW_TYPE ? row.rowIndex - 1 : row.rowIndex + 1);
                    }

                    return rowIndices;
                },

                _beforeCloseEditCellInBatchMode: function(rowIndices) {
                    const expandedKey = this._dataController._adaptiveExpandedKey;
                    let rowIndex;

                    if(expandedKey) {
                        rowIndex = gridCoreUtils.getIndexByKey(expandedKey, this._dataController.items());
                        if(rowIndex > -1) {
                            rowIndices.unshift(rowIndex);
                        }
                    }
                },

                editRow: function(rowIndex) {
                    if(this._adaptiveController.isFormEditMode()) {
                        this._adaptiveController.collapseAdaptiveDetailRow();
                    }

                    this.callBase(rowIndex);
                },

                deleteRow: function(rowIndex) {
                    const rowKey = this._dataController.getKeyByRowIndex(rowIndex);

                    if(this.getEditMode() === EDIT_MODE_BATCH && this._adaptiveController.isAdaptiveDetailRowExpanded(rowKey)) {
                        this._adaptiveController.collapseAdaptiveDetailRow();
                    }

                    this.callBase(rowIndex);
                },

                init: function() {
                    this.callBase();
                    this._adaptiveController = this.getController('adaptiveColumns');
                }
            },
            resizing: {
                _needBestFit: function() {
                    return this.callBase() || !!this._adaptiveColumnsController.getHidingColumnsQueue().length;
                },

                _updateScrollableForIE: function() {
                    const that = this;

                    if(browser.msie && parseInt(browser.version) <= 11) {
                        this._updateScrollableTimeoutID = setTimeout(function() {
                            that.getView('rowsView')._updateScrollable();
                        });
                    }
                },

                _correctColumnWidths: function(resultWidths, visibleColumns) {
                    const adaptiveController = this._adaptiveColumnsController;
                    const columnAutoWidth = this.option('columnAutoWidth');
                    const oldHiddenColumns = adaptiveController.getHiddenColumns();
                    let hiddenColumns;
                    const hidingColumnsQueue = adaptiveController.updateHidingQueue(this._columnsController.getColumns());

                    adaptiveController.hideRedundantColumns(resultWidths, visibleColumns, hidingColumnsQueue);
                    hiddenColumns = adaptiveController.getHiddenColumns();
                    if(adaptiveController.hasAdaptiveDetailRowExpanded()) {
                        if(oldHiddenColumns.length !== hiddenColumns.length) {
                            adaptiveController.updateForm(hiddenColumns);
                        }
                    }

                    !hiddenColumns.length && adaptiveController.collapseAdaptiveDetailRow();

                    if(columnAutoWidth && hidingColumnsQueue.length && !hiddenColumns.length) {
                        this._updateScrollableForIE();
                    }

                    return this.callBase.apply(this, arguments);
                },

                _toggleBestFitMode: function(isBestFit) {
                    isBestFit && this._adaptiveColumnsController._removeCssClassesFromColumns();
                    this.callBase(isBestFit);
                },

                _needStretch: function() {
                    const adaptiveColumnsController = this._adaptiveColumnsController;
                    return this.callBase.apply(this, arguments) || adaptiveColumnsController.getHidingColumnsQueue().length || adaptiveColumnsController.hasHiddenColumns();
                },

                init: function() {
                    this._adaptiveColumnsController = this.getController('adaptiveColumns');
                    this.callBase();
                },
                dispose: function() {
                    this.callBase.apply(this, arguments);
                    clearTimeout(this._updateScrollableTimeoutID);
                }
            },
            data: {
                _processItems: function(items, change) {
                    const that = this;
                    let item;
                    let expandRowIndex;
                    const changeType = change.changeType;

                    items = that.callBase.apply(that, arguments);

                    if((changeType === 'loadingAll') || !typeUtils.isDefined(that._adaptiveExpandedKey)) {
                        return items;
                    }

                    expandRowIndex = gridCoreUtils.getIndexByKey(that._adaptiveExpandedKey, items);

                    if(expandRowIndex >= 0) {
                        item = items[expandRowIndex];
                        items.splice(expandRowIndex + 1, 0, {
                            visible: true,
                            rowType: ADAPTIVE_ROW_TYPE,
                            key: item.key,
                            data: item.data,
                            modifiedValues: item.modifiedValues,
                            isNewRow: item.isNewRow,
                            values: item.values
                        });
                    } else if(changeType === 'refresh') {
                        that._adaptiveExpandedKey = undefined;
                    }

                    return items;
                },

                _getRowIndicesForExpand: function(key) {
                    const rowIndices = this.callBase.apply(this, arguments);
                    let lastRowIndex;

                    if(this.getController('adaptiveColumns').isAdaptiveDetailRowExpanded(key)) {
                        lastRowIndex = rowIndices[rowIndices.length - 1];
                        rowIndices.push(lastRowIndex + 1);
                    }

                    return rowIndices;
                },

                adaptiveExpandedKey: function(value) {
                    if(typeUtils.isDefined(value)) {
                        this._adaptiveExpandedKey = value;
                    } else {
                        return this._adaptiveExpandedKey;
                    }
                },

                toggleExpandAdaptiveDetailRow: function(key, alwaysExpanded) {
                    const that = this;

                    let oldExpandLoadedRowIndex = gridCoreUtils.getIndexByKey(that._adaptiveExpandedKey, that._items);
                    let newExpandLoadedRowIndex = gridCoreUtils.getIndexByKey(key, that._items);

                    if(oldExpandLoadedRowIndex >= 0 && oldExpandLoadedRowIndex === newExpandLoadedRowIndex && !alwaysExpanded) {
                        key = undefined;
                        newExpandLoadedRowIndex = -1;
                    }

                    that._adaptiveExpandedKey = key;

                    if(oldExpandLoadedRowIndex >= 0) {
                        oldExpandLoadedRowIndex++;
                    }
                    if(newExpandLoadedRowIndex >= 0) {
                        newExpandLoadedRowIndex++;
                    }

                    const rowIndexDelta = that.getRowIndexDelta();

                    that.updateItems({
                        allowInvisibleRowIndices: true,
                        changeType: 'update',
                        rowIndices: [oldExpandLoadedRowIndex - rowIndexDelta, newExpandLoadedRowIndex - rowIndexDelta]
                    });
                },

                init: function() {
                    this.callBase();
                    this._adaptiveExpandedKey = undefined;
                }
            },
            editorFactory: {
                _getFocusCellSelector: function() {
                    return this.callBase() + ', .dx-adaptive-detail-row .dx-field-item > .dx-field-item-content';
                },

                _getTooltipsSelector: function() {
                    return this.callBase() + ', .dx-field-item-content .' + this.addWidgetPrefix(REVERT_TOOLTIP_CLASS);
                }
            },
            columns: {
                _isColumnVisible: function(column) {
                    return this.callBase(column) && !column.adaptiveHidden;
                }
            },
            keyboardNavigation: {
                _isCellValid: function($cell) {
                    return this.callBase.apply(this, arguments) && !$cell.hasClass(this.addWidgetPrefix(HIDDEN_COLUMN_CLASS));
                },

                _processNextCellInMasterDetail: function($nextCell) {
                    this.callBase($nextCell);

                    const isCellOrBatchMode = this._editingController.isCellOrBatchEditMode();

                    if(!this._isInsideEditForm($nextCell) && $nextCell && isCellOrBatchMode) {
                        const focusHandler = function() {
                            eventsEngine.off($nextCell, 'focus', focusHandler);
                            eventsEngine.trigger($nextCell, 'dxclick');
                        };
                        eventsEngine.on($nextCell, 'focus', focusHandler);
                    }
                },

                _handleTabKeyOnMasterDetailCell: function(eventTarget, direction) {
                    const result = this.callBase(eventTarget, direction);
                    const $currentCell = this._getFocusedCell();
                    const $row = $currentCell && $currentCell.parent();

                    if(!result && $row && $row.length) {
                        const $dataCells = getDataCellElements($row);
                        const $targetCell = direction === 'next' ? $dataCells.last() : $dataCells.first();
                        const rowIndex = $row.get(0).rowIndex;
                        const adaptiveController = this._adaptiveController;
                        const key = this._dataController.getKeyByRowIndex(direction === 'next' ? rowIndex : rowIndex - 1);
                        const isCellElementsEquals = $currentCell && $targetCell && $currentCell.get(0) === $targetCell.get(0);

                        return adaptiveController.isAdaptiveDetailRowExpanded(key) && isCellElementsEquals;
                    }
                    return result;
                },

                init: function() {
                    this.callBase();
                    this._adaptiveController = this.getController('adaptiveColumns');
                }
            }
        }
    }
};
