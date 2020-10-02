import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { normalizeKeyName } from '../../events/utils/index';
import { each, map } from '../../core/utils/iterator';
import modules from './ui.grid_core.modules';
import gridCoreUtils from './ui.grid_core.utils';
import messageLocalization from '../../localization/message';
import Editor from '../editor/editor';
import Overlay from '../overlay';
import Menu from '../menu';
import { selectView } from '../shared/accessibility';

const OPERATION_ICONS = {
    '=': 'filter-operation-equals',
    '<>': 'filter-operation-not-equals',
    '<': 'filter-operation-less',
    '<=': 'filter-operation-less-equal',
    '>': 'filter-operation-greater',
    '>=': 'filter-operation-greater-equal',
    'default': 'filter-operation-default',
    'notcontains': 'filter-operation-not-contains',
    'contains': 'filter-operation-contains',
    'startswith': 'filter-operation-starts-with',
    'endswith': 'filter-operation-ends-with',
    'between': 'filter-operation-between'
};

const OPERATION_DESCRIPTORS = {
    '=': 'equal',
    '<>': 'notEqual',
    '<': 'lessThan',
    '<=': 'lessThanOrEqual',
    '>': 'greaterThan',
    '>=': 'greaterThanOrEqual',
    'startswith': 'startsWith',
    'contains': 'contains',
    'notcontains': 'notContains',
    'endswith': 'endsWith',
    'between': 'between'
};

const FILTERING_TIMEOUT = 700;
const CORRECT_FILTER_RANGE_OVERLAY_WIDTH = 1;
const FILTER_ROW_CLASS = 'filter-row';
const FILTER_RANGE_OVERLAY_CLASS = 'filter-range-overlay';
const FILTER_RANGE_START_CLASS = 'filter-range-start';
const FILTER_RANGE_END_CLASS = 'filter-range-end';
const MENU_CLASS = 'dx-menu';
const EDITOR_WITH_MENU_CLASS = 'dx-editor-with-menu';
const EDITOR_CONTAINER_CLASS = 'dx-editor-container';
const EDITOR_CELL_CLASS = 'dx-editor-cell';
const FILTER_MENU = 'dx-filter-menu';
const APPLY_BUTTON_CLASS = 'dx-apply-button';
const HIGHLIGHT_OUTLINE_CLASS = 'dx-highlight-outline';
const FOCUSED_CLASS = 'dx-focused';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
const FILTER_RANGE_CONTENT_CLASS = 'dx-filter-range-content';
const FILTER_MODIFIED_CLASS = 'dx-filter-modified';

const EDITORS_INPUT_SELECTOR = 'input:not([type=\'hidden\'])';

const BETWEEN_OPERATION_DATA_TYPES = ['date', 'datetime', 'number'];

function isOnClickApplyFilterMode(that) {
    return that.option('filterRow.applyFilter') === 'onClick';
}

const ColumnHeadersViewFilterRowExtender = (function() {
    const getEditorInstance = function($editorContainer) {
        const $editor = $editorContainer && $editorContainer.children();
        const componentNames = $editor && $editor.data('dxComponents');
        const editor = componentNames && componentNames.length && $editor.data(componentNames[0]);

        if(editor instanceof Editor) {
            return editor;
        }
    };

    const getRangeTextByFilterValue = function(that, column) {
        let result = '';
        let rangeEnd = '';
        const filterValue = getColumnFilterValue(that, column);
        const formatOptions = gridCoreUtils.getFormatOptionsByColumn(column, 'filterRow');

        if(Array.isArray(filterValue)) {
            result = gridCoreUtils.formatValue(filterValue[0], formatOptions);
            rangeEnd = gridCoreUtils.formatValue(filterValue[1], formatOptions);

            if(rangeEnd !== '') {
                result += ' - ' + rangeEnd;
            }
        } else if(isDefined(filterValue)) {
            result = gridCoreUtils.formatValue(filterValue, formatOptions);
        }

        return result;
    };

    function getColumnFilterValue(that, column) {
        if(column) {
            return isOnClickApplyFilterMode(that) && column.bufferedFilterValue !== undefined ? column.bufferedFilterValue : column.filterValue;
        }
    }

    const getColumnSelectedFilterOperation = function(that, column) {
        if(column) {
            return isOnClickApplyFilterMode(that) && column.bufferedSelectedFilterOperation !== undefined ? column.bufferedSelectedFilterOperation : column.selectedFilterOperation;
        }
    };

    const isValidFilterValue = function(filterValue, column) {
        if(column && BETWEEN_OPERATION_DATA_TYPES.indexOf(column.dataType) >= 0 && Array.isArray(filterValue)) {
            return false;
        }

        return filterValue !== undefined;
    };

    const getFilterValue = function(that, columnIndex, $editorContainer) {
        const column = that._columnsController.columnOption(columnIndex);
        const filterValue = getColumnFilterValue(that, column);
        const isFilterRange = $editorContainer.closest('.' + that.addWidgetPrefix(FILTER_RANGE_OVERLAY_CLASS)).length;
        const isRangeStart = $editorContainer.hasClass(that.addWidgetPrefix(FILTER_RANGE_START_CLASS));

        if(filterValue && Array.isArray(filterValue) && getColumnSelectedFilterOperation(that, column) === 'between') {
            if(isRangeStart) {
                return filterValue[0];
            } else {
                return filterValue[1];
            }
        }

        return !isFilterRange && isValidFilterValue(filterValue, column) ? filterValue : null;
    };

    const normalizeFilterValue = function(that, filterValue, column, $editorContainer) {
        if(getColumnSelectedFilterOperation(that, column) === 'between') {
            const columnFilterValue = getColumnFilterValue(that, column);
            if($editorContainer.hasClass(that.addWidgetPrefix(FILTER_RANGE_START_CLASS))) {
                return [filterValue, Array.isArray(columnFilterValue) ? columnFilterValue[1] : undefined];
            } else {
                return [Array.isArray(columnFilterValue) ? columnFilterValue[0] : columnFilterValue, filterValue];
            }
        }

        return filterValue;
    };

    const updateFilterValue = function(that, options) {
        const value = options.value === '' ? null : options.value;
        const $editorContainer = options.container;
        const column = that._columnsController.columnOption(options.column.index);
        const filterValue = getFilterValue(that, column.index, $editorContainer);

        if(!isDefined(filterValue) && !isDefined(value)) return;

        that._applyFilterViewController.setHighLight($editorContainer, filterValue !== value);
        that._columnsController.columnOption(column.index, isOnClickApplyFilterMode(that) ? 'bufferedFilterValue' : 'filterValue', normalizeFilterValue(that, value, column, $editorContainer), options.notFireEvent);
    };

    return {
        _updateEditorValue: function(column, $editorContainer) {
            const that = this;
            const editor = getEditorInstance($editorContainer);

            editor && editor.option('value', getFilterValue(that, column.index, $editorContainer));
        },

        _columnOptionChanged: function(e) {
            const that = this;
            const optionNames = e.optionNames;
            let $cell;
            let $editorContainer;
            let $editorRangeElements;
            let $menu;

            if(gridCoreUtils.checkChanges(optionNames, ['filterValue', 'bufferedFilterValue', 'selectedFilterOperation', 'bufferedSelectedFilterOperation']) && e.columnIndex !== undefined) {
                const visibleIndex = that._columnsController.getVisibleIndex(e.columnIndex);
                const column = that._columnsController.columnOption(e.columnIndex);
                $cell = that._getCellElement(that.element().find('.' + that.addWidgetPrefix(FILTER_ROW_CLASS)).index(), visibleIndex) || $();
                $editorContainer = $cell.find('.' + EDITOR_CONTAINER_CLASS).first();

                if(optionNames.filterValue || optionNames.bufferedFilterValue) {
                    that._updateEditorValue(column, $editorContainer);

                    const overlayInstance = $cell.find('.' + that.addWidgetPrefix(FILTER_RANGE_OVERLAY_CLASS)).data('dxOverlay');
                    if(overlayInstance) {
                        $editorRangeElements = overlayInstance.$content().find('.' + EDITOR_CONTAINER_CLASS);

                        that._updateEditorValue(column, $editorRangeElements.first());
                        that._updateEditorValue(column, $editorRangeElements.last());
                    }
                    if(!overlayInstance || !overlayInstance.option('visible')) {
                        that._updateFilterRangeContent($cell, getRangeTextByFilterValue(that, column));
                    }
                }
                if(optionNames.selectedFilterOperation || optionNames.bufferedSelectedFilterOperation) {
                    if(visibleIndex >= 0 && column) {
                        $menu = $cell.find('.' + MENU_CLASS);

                        if($menu.length) {
                            that._updateFilterOperationChooser($menu, column, $editorContainer);

                            if(getColumnSelectedFilterOperation(that, column) === 'between') {
                                that._renderFilterRangeContent($cell, column);
                            } else if($editorContainer.find('.' + FILTER_RANGE_CONTENT_CLASS).length) {
                                that._renderEditor($editorContainer, that._getEditorOptions($editorContainer, column));
                                that._hideFilterRange();
                            }
                        }
                    }
                }
                return;
            }

            that.callBase(e);
        },

        _renderCore: function() {
            this._filterRangeOverlayInstance = null;
            this.callBase.apply(this, arguments);
        },

        _resizeCore: function() {
            this.callBase.apply(this, arguments);
            this._filterRangeOverlayInstance && this._filterRangeOverlayInstance.repaint();
        },

        isFilterRowVisible: function() {
            return this._isElementVisible(this.option('filterRow'));
        },

        isVisible: function() {
            return this.callBase() || this.isFilterRowVisible();
        },

        init: function() {
            this.callBase();
            this._applyFilterViewController = this.getController('applyFilter');
        },

        _initFilterRangeOverlay: function($cell, column) {
            const that = this;
            const sharedData = {};
            const $editorContainer = $cell.find('.dx-editor-container');
            const $overlay = $('<div>').addClass(that.addWidgetPrefix(FILTER_RANGE_OVERLAY_CLASS)).appendTo($cell);

            return that._createComponent($overlay, Overlay, {
                height: 'auto',
                shading: false,
                showTitle: false,
                focusStateEnabled: false,
                closeOnTargetScroll: false,
                closeOnOutsideClick: true,
                animation: false,
                position: {
                    my: 'top',
                    at: 'top',
                    of: $editorContainer.length && $editorContainer || $cell,
                    offset: '0 -1'
                },
                contentTemplate: function(contentElement) {
                    let editorOptions;
                    let $editor = $('<div>').addClass(EDITOR_CONTAINER_CLASS + ' ' + that.addWidgetPrefix(FILTER_RANGE_START_CLASS)).appendTo(contentElement);

                    column = that._columnsController.columnOption(column.index);
                    editorOptions = that._getEditorOptions($editor, column);
                    editorOptions.sharedData = sharedData;
                    that._renderEditor($editor, editorOptions);
                    eventsEngine.on($editor.find(EDITORS_INPUT_SELECTOR), 'keydown', function(e) {
                        let $prevElement = $cell.find('[tabindex]').not(e.target).first();

                        if(normalizeKeyName(e) === 'tab' && e.shiftKey) {
                            e.preventDefault();
                            that._hideFilterRange();

                            if(!$prevElement.length) {
                                $prevElement = $cell.prev().find('[tabindex]').last();
                            }
                            eventsEngine.trigger($prevElement, 'focus');
                        }
                    });

                    $editor = $('<div>').addClass(EDITOR_CONTAINER_CLASS + ' ' + that.addWidgetPrefix(FILTER_RANGE_END_CLASS)).appendTo(contentElement);
                    editorOptions = that._getEditorOptions($editor, column);

                    editorOptions.sharedData = sharedData;
                    that._renderEditor($editor, editorOptions);
                    eventsEngine.on($editor.find(EDITORS_INPUT_SELECTOR), 'keydown', function(e) {
                        if(normalizeKeyName(e) === 'tab' && !e.shiftKey) {
                            e.preventDefault();
                            that._hideFilterRange();
                            eventsEngine.trigger($cell.next().find('[tabindex]').first(), 'focus');
                        }
                    });

                    return $(contentElement).addClass(that.getWidgetContainerClass());
                },
                onShown: function(e) {
                    const $editor = e.component.$content().find('.' + EDITOR_CONTAINER_CLASS).first();

                    eventsEngine.trigger($editor.find(EDITORS_INPUT_SELECTOR), 'focus');
                },
                onHidden: function() {
                    column = that._columnsController.columnOption(column.index);

                    $cell.find('.' + MENU_CLASS).parent().addClass(EDITOR_WITH_MENU_CLASS);
                    if(getColumnSelectedFilterOperation(that, column) === 'between') {
                        that._updateFilterRangeContent($cell, getRangeTextByFilterValue(that, column));
                        that.component.updateDimensions();
                    }
                }
            });
        },

        _updateFilterRangeOverlay: function(options) {
            const overlayInstance = this._filterRangeOverlayInstance;

            overlayInstance && overlayInstance.option(options);
        },

        _showFilterRange: function($cell, column) {
            const that = this;
            const $overlay = $cell.children('.' + that.addWidgetPrefix(FILTER_RANGE_OVERLAY_CLASS));
            let overlayInstance = $overlay.length && $overlay.data('dxOverlay');

            if(!overlayInstance && column) {
                overlayInstance = that._initFilterRangeOverlay($cell, column);
            }

            if(!overlayInstance.option('visible')) {
                that._filterRangeOverlayInstance && that._filterRangeOverlayInstance.hide();
                that._filterRangeOverlayInstance = overlayInstance;

                that._updateFilterRangeOverlay({ width: $cell.outerWidth(true) + CORRECT_FILTER_RANGE_OVERLAY_WIDTH });
                that._filterRangeOverlayInstance && that._filterRangeOverlayInstance.show();
            }
        },

        _hideFilterRange: function() {
            const overlayInstance = this._filterRangeOverlayInstance;

            overlayInstance && overlayInstance.hide();
        },

        getFilterRangeOverlayInstance: function() {
            return this._filterRangeOverlayInstance;
        },

        _createRow: function(row) {
            const $row = this.callBase(row);

            if(row.rowType === 'filter') {
                $row.addClass(this.addWidgetPrefix(FILTER_ROW_CLASS));

                if(!this.option('useLegacyKeyboardNavigation')) {
                    eventsEngine.on($row, 'keydown', event => selectView('filterRow', this, event));
                }
            }

            return $row;
        },

        _getRows: function() {
            const result = this.callBase();

            if(this.isFilterRowVisible()) {
                result.push({ rowType: 'filter' });
            }

            return result;
        },

        _renderFilterCell: function(cell, options) {
            const that = this;
            const column = options.column;
            const $cell = $(cell);

            if(that.component.option('showColumnHeaders')) {
                that.setAria('describedby', column.headerId, $cell);
            }
            that.setAria('label', messageLocalization.format('dxDataGrid-ariaFilterCell'), $cell);

            $cell.addClass(EDITOR_CELL_CLASS);
            const $container = $('<div>').appendTo($cell);
            const $editorContainer = $('<div>').addClass(EDITOR_CONTAINER_CLASS).appendTo($container);

            if(getColumnSelectedFilterOperation(that, column) === 'between') {
                that._renderFilterRangeContent($cell, column);
            } else {
                const editorOptions = that._getEditorOptions($editorContainer, column);
                that._renderEditor($editorContainer, editorOptions);
            }

            const alignment = column.alignment;
            if(alignment && alignment !== 'center') {
                $cell.find(EDITORS_INPUT_SELECTOR).first().css('textAlign', column.alignment);
            }

            if(column.filterOperations && column.filterOperations.length) {
                that._renderFilterOperationChooser($container, column, $editorContainer);
            }
        },

        _renderCellContent: function($cell, options) { // TODO _getCellTemplate
            const that = this;
            const column = options.column;

            if(options.rowType === 'filter') {
                if(column.command) {
                    $cell.html('&nbsp;');
                } else if(column.allowFiltering) {
                    that.renderTemplate($cell, that._renderFilterCell.bind(that), options).done(() => {
                        that._updateCell($cell, options);
                    });
                    return;
                }
            }

            that.callBase($cell, options);
        },

        _getEditorOptions: function($editorContainer, column) {
            const that = this;
            const accessibilityOptions = {
                editorOptions: {
                    inputAttr: that._getFilterInputAccessibilityAttributes(column)
                }
            };
            const result = extend(accessibilityOptions, column, {
                value: getFilterValue(that, column.index, $editorContainer),
                parentType: 'filterRow',
                showAllText: that.option('filterRow.showAllText'),
                updateValueTimeout: that.option('filterRow.applyFilter') === 'onClick' ? 0 : FILTERING_TIMEOUT,
                width: null,
                setValue: function(value, notFireEvent) {
                    updateFilterValue(that, {
                        column: column,
                        value: value,
                        container: $editorContainer,
                        notFireEvent: notFireEvent
                    });
                }
            });

            if(getColumnSelectedFilterOperation(that, column) === 'between') {
                if($editorContainer.hasClass(that.addWidgetPrefix(FILTER_RANGE_START_CLASS))) {
                    result.placeholder = that.option('filterRow.betweenStartText');
                } else {
                    result.placeholder = that.option('filterRow.betweenEndText');
                }
            }

            return result;
        },
        _getFilterInputAccessibilityAttributes: function(column) {
            const columnAriaLabel = messageLocalization.format('dxDataGrid-ariaFilterCell');
            if(this.component.option('showColumnHeaders')) {
                return {
                    'aria-label': columnAriaLabel,
                    'aria-describedby': column.headerId
                };
            }
            return { 'aria-label': columnAriaLabel };
        },


        _renderEditor: function($editorContainer, options) {
            $editorContainer.empty();
            return this.getController('editorFactory').createEditor($('<div>').appendTo($editorContainer), options);
        },

        _renderFilterRangeContent: function($cell, column) {
            const that = this;
            const $editorContainer = $cell.find('.' + EDITOR_CONTAINER_CLASS).first();

            $editorContainer.empty();
            const $filterRangeContent = $('<div>')
                .addClass(FILTER_RANGE_CONTENT_CLASS)
                .attr('tabindex', this.option('tabIndex'));

            eventsEngine.on($filterRangeContent, 'focusin', function() {
                that._showFilterRange($cell, column);
            });

            $filterRangeContent.appendTo($editorContainer);

            that._updateFilterRangeContent($cell, getRangeTextByFilterValue(that, column));
        },

        _updateFilterRangeContent: function($cell, value) {
            const $filterRangeContent = $cell.find('.' + FILTER_RANGE_CONTENT_CLASS);

            if($filterRangeContent.length) {
                if(value === '') {
                    $filterRangeContent.html('&nbsp;');
                } else {
                    $filterRangeContent.text(value);
                }
            }
        },

        _updateFilterOperationChooser: function($menu, column, $editorContainer) {
            const that = this;
            let isCellWasFocused;
            const restoreFocus = function() {
                const menu = Menu.getInstance($menu);
                menu && menu.option('focusedElement', null);
                isCellWasFocused && that._focusEditor($editorContainer);
            };

            that._createComponent($menu, Menu, {
                integrationOptions: {},
                activeStateEnabled: false,
                selectionMode: 'single',
                cssClass: that.getWidgetContainerClass() + ' ' + CELL_FOCUS_DISABLED_CLASS + ' ' + FILTER_MENU,
                showFirstSubmenuMode: 'onHover',
                hideSubmenuOnMouseLeave: true,
                items: [{
                    disabled: column.filterOperations && column.filterOperations.length ? false : true,
                    icon: OPERATION_ICONS[getColumnSelectedFilterOperation(that, column) || 'default'],
                    selectable: false,
                    items: that._getFilterOperationMenuItems(column)
                }],
                onItemClick: function(properties) {
                    const selectedFilterOperation = properties.itemData.name;
                    const columnSelectedFilterOperation = getColumnSelectedFilterOperation(that, column);
                    let notFocusEditor = false;
                    const isOnClickMode = isOnClickApplyFilterMode(that);
                    const options = {};

                    if(properties.itemData.items || (selectedFilterOperation && selectedFilterOperation === columnSelectedFilterOperation)) {
                        return;
                    }

                    if(selectedFilterOperation) {
                        options[isOnClickMode ? 'bufferedSelectedFilterOperation' : 'selectedFilterOperation'] = selectedFilterOperation;

                        if(selectedFilterOperation === 'between' || columnSelectedFilterOperation === 'between') {
                            notFocusEditor = selectedFilterOperation === 'between';
                            options[isOnClickMode ? 'bufferedFilterValue' : 'filterValue'] = null;
                        }
                    } else {
                        options[isOnClickMode ? 'bufferedFilterValue' : 'filterValue'] = null;
                        options[isOnClickMode ? 'bufferedSelectedFilterOperation' : 'selectedFilterOperation'] = column.defaultSelectedFilterOperation || null;
                    }

                    that._columnsController.columnOption(column.index, options);
                    that._applyFilterViewController.setHighLight($editorContainer, true);

                    if(!selectedFilterOperation) {
                        const editor = getEditorInstance($editorContainer);
                        if(editor && editor.NAME === 'dxDateBox' && !editor.option('isValid')) {
                            editor.reset();
                            editor.option('isValid', true);
                        }
                    }

                    if(!notFocusEditor) {
                        that._focusEditor($editorContainer);
                    } else {
                        that._showFilterRange($editorContainer.closest('.' + EDITOR_CELL_CLASS), column);
                    }
                },
                onSubmenuShown: function() {
                    isCellWasFocused = that._isEditorFocused($editorContainer);
                    that.getController('editorFactory').loseFocus();
                },
                onSubmenuHiding: function() {
                    eventsEngine.trigger($menu, 'blur');
                    restoreFocus();
                },
                onContentReady: function(e) {
                    eventsEngine.on($menu, 'blur', () => {
                        const menu = e.component;
                        menu._hideSubmenu(menu._visibleSubmenu);
                        restoreFocus();
                    });
                },
                rtlEnabled: that.option('rtlEnabled')
            });
        },

        _isEditorFocused: function($container) {
            return $container.hasClass(FOCUSED_CLASS) || $container.parents('.' + FOCUSED_CLASS).length;
        },

        _focusEditor: function($container) {
            this.getController('editorFactory').focus($container);
            eventsEngine.trigger($container.find(EDITORS_INPUT_SELECTOR), 'focus');
        },

        _renderFilterOperationChooser: function($container, column, $editorContainer) {
            const that = this;
            let $menu;

            if(that.option('filterRow.showOperationChooser')) {
                $container.addClass(EDITOR_WITH_MENU_CLASS);
                $menu = $('<div>').prependTo($container);
                that._updateFilterOperationChooser($menu, column, $editorContainer);
            }
        },

        _getFilterOperationMenuItems: function(column) {
            const that = this;
            let result = [{}];
            const filterRowOptions = that.option('filterRow');
            const operationDescriptions = filterRowOptions && filterRowOptions.operationDescriptions || {};

            if(column.filterOperations && column.filterOperations.length) {
                const availableFilterOperations = column.filterOperations.filter(function(value) {
                    return isDefined(OPERATION_DESCRIPTORS[value]);
                });
                result = map(availableFilterOperations, function(value) {
                    const descriptionName = OPERATION_DESCRIPTORS[value];

                    return {
                        name: value,
                        selected: (getColumnSelectedFilterOperation(that, column) || column.defaultFilterOperation) === value,
                        text: operationDescriptions[descriptionName],
                        icon: OPERATION_ICONS[value]
                    };
                });

                result.push({
                    name: null,
                    text: filterRowOptions && filterRowOptions.resetOperationText,
                    icon: OPERATION_ICONS['default']
                });
            }

            return result;
        },

        optionChanged: function(args) {
            const that = this;

            switch(args.name) {
                case 'filterRow':
                case 'showColumnLines':
                    this._invalidate(true, true);
                    args.handled = true;
                    break;
                default:
                    that.callBase(args);
                    break;
            }
        }
    };
})();

const DataControllerFilterRowExtender = {
    skipCalculateColumnFilters: function() {
        return false;
    },

    _calculateAdditionalFilter: function() {
        if(this.skipCalculateColumnFilters()) {
            return this.callBase();
        }

        const filters = [this.callBase()];
        const columns = this._columnsController.getVisibleColumns(null, true);

        each(columns, function() {

            if(this.allowFiltering && this.calculateFilterExpression && isDefined(this.filterValue)) {
                const filter = this.createFilterExpression(this.filterValue, this.selectedFilterOperation || this.defaultFilterOperation, 'filterRow');
                filters.push(filter);
            }
        });

        return gridCoreUtils.combineFilters(filters);
    }
};

const ApplyFilterViewController = modules.ViewController.inherit({
    _getHeaderPanel: function() {
        if(!this._headerPanel) {
            this._headerPanel = this.getView('headerPanel');
        }
        return this._headerPanel;
    },

    setHighLight: function($element, value) {
        if(isOnClickApplyFilterMode(this)) {
            $element &&
            $element.toggleClass(HIGHLIGHT_OUTLINE_CLASS, value) &&
            $element.closest('.' + EDITOR_CELL_CLASS).toggleClass(FILTER_MODIFIED_CLASS, value);
            this._getHeaderPanel().enableApplyButton(value);
        }
    },

    applyFilter: function() {
        const columnsController = this.getController('columns');
        const columns = columnsController.getColumns();

        columnsController.beginUpdate();
        for(let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if(column.bufferedFilterValue !== undefined) {
                columnsController.columnOption(i, 'filterValue', column.bufferedFilterValue);
                column.bufferedFilterValue = undefined;
            }
            if(column.bufferedSelectedFilterOperation !== undefined) {
                columnsController.columnOption(i, 'selectedFilterOperation', column.bufferedSelectedFilterOperation);
                column.bufferedSelectedFilterOperation = undefined;
            }
        }
        columnsController.endUpdate();
        this.removeHighLights();
    },

    removeHighLights: function() {
        if(isOnClickApplyFilterMode(this)) {
            const columnHeadersViewElement = this.getView('columnHeadersView').element();
            columnHeadersViewElement.find('.' + this.addWidgetPrefix(FILTER_ROW_CLASS) + ' .' + HIGHLIGHT_OUTLINE_CLASS).removeClass(HIGHLIGHT_OUTLINE_CLASS);
            columnHeadersViewElement.find('.' + this.addWidgetPrefix(FILTER_ROW_CLASS) + ' .' + FILTER_MODIFIED_CLASS).removeClass(FILTER_MODIFIED_CLASS);
            this._getHeaderPanel().enableApplyButton(false);
        }
    }
});

export default {
    defaultOptions: function() {
        return {
            filterRow: {
                /**
                 * @name GridBaseOptions.filterRow.visible
                 * @type boolean
                 * @default false
                 */
                visible: false,
                /**
                 * @name GridBaseOptions.filterRow.showOperationChooser
                 * @type boolean
                 * @default true
                 */
                showOperationChooser: true,
                /**
                * @name GridBaseOptions.filterRow.showAllText
                * @type string
                * @default "(All)"
                */
                showAllText: messageLocalization.format('dxDataGrid-filterRowShowAllText'),
                /**
                * @name GridBaseOptions.filterRow.resetOperationText
                * @type string
                * @default "Reset"
                */
                resetOperationText: messageLocalization.format('dxDataGrid-filterRowResetOperationText'),
                /**
                 * @name GridBaseOptions.filterRow.applyFilter
                 * @type Enums.GridApplyFilterMode
                 * @default "auto"
                 */
                applyFilter: 'auto',
                /**
                 * @name GridBaseOptions.filterRow.applyFilterText
                 * @type string
                 * @default "Apply filter"
                 */
                applyFilterText: messageLocalization.format('dxDataGrid-applyFilterText'),
                /**
                 * @name GridBaseOptions.filterRow.operationDescriptions
                 * @type object
                 */
                operationDescriptions: {
                    /**
                     * @name GridBaseOptions.filterRow.operationDescriptions.equal
                     * @type string
                     * @default "Equals"
                     */
                    equal: messageLocalization.format('dxDataGrid-filterRowOperationEquals'),
                    /**
                     * @name GridBaseOptions.filterRow.operationDescriptions.notEqual
                     * @type string
                     * @default "Does not equal"
                     */
                    notEqual: messageLocalization.format('dxDataGrid-filterRowOperationNotEquals'),
                    /**
                     * @name GridBaseOptions.filterRow.operationDescriptions.lessThan
                     * @type string
                     * @default "Less than"
                     */
                    lessThan: messageLocalization.format('dxDataGrid-filterRowOperationLess'),
                    /**
                     * @name GridBaseOptions.filterRow.operationDescriptions.lessThanOrEqual
                     * @type string
                     * @default "Less than or equal to"
                     */
                    lessThanOrEqual: messageLocalization.format('dxDataGrid-filterRowOperationLessOrEquals'),
                    /**
                     * @name GridBaseOptions.filterRow.operationDescriptions.greaterThan
                     * @type string
                     * @default "Greater than"
                     */
                    greaterThan: messageLocalization.format('dxDataGrid-filterRowOperationGreater'),
                    /**
                     * @name GridBaseOptions.filterRow.operationDescriptions.greaterThanOrEqual
                     * @type string
                     * @default "Greater than or equal to"
                     */
                    greaterThanOrEqual: messageLocalization.format('dxDataGrid-filterRowOperationGreaterOrEquals'),
                    /**
                     * @name GridBaseOptions.filterRow.operationDescriptions.startsWith
                     * @type string
                     * @default "Starts with"
                     */
                    startsWith: messageLocalization.format('dxDataGrid-filterRowOperationStartsWith'),
                    /**
                     * @name GridBaseOptions.filterRow.operationDescriptions.contains
                     * @type string
                     * @default "Contains"
                     */
                    contains: messageLocalization.format('dxDataGrid-filterRowOperationContains'),
                    /**
                     * @name GridBaseOptions.filterRow.operationDescriptions.notContains
                     * @type string
                     * @default "Does not contain"
                     */
                    notContains: messageLocalization.format('dxDataGrid-filterRowOperationNotContains'),

                    /**
                     * @name GridBaseOptions.filterRow.operationDescriptions.endsWith
                     * @type string
                     * @default "Ends with"
                     */
                    endsWith: messageLocalization.format('dxDataGrid-filterRowOperationEndsWith'),
                    /**
                     * @name GridBaseOptions.filterRow.operationDescriptions.between
                     * @type string
                     * @default "Between"
                     */
                    between: messageLocalization.format('dxDataGrid-filterRowOperationBetween'),
                    isBlank: messageLocalization.format('dxFilterBuilder-filterOperationIsBlank'),
                    isNotBlank: messageLocalization.format('dxFilterBuilder-filterOperationIsNotBlank')
                },
                /**
                 * @name GridBaseOptions.filterRow.betweenStartText
                 * @type string
                 * @default "Start"
                 */
                betweenStartText: messageLocalization.format('dxDataGrid-filterRowOperationBetweenStartText'),
                /**
                 * @name GridBaseOptions.filterRow.betweenEndText
                 * @type string
                 * @default "End"
                 */
                betweenEndText: messageLocalization.format('dxDataGrid-filterRowOperationBetweenEndText')
            }
        };
    },
    controllers: {
        applyFilter: ApplyFilterViewController
    },
    extenders: {
        controllers: {
            data: DataControllerFilterRowExtender,
            columnsResizer: {
                _startResizing: function() {
                    const that = this;

                    that.callBase.apply(that, arguments);

                    if(that.isResizing()) {
                        const overlayInstance = that._columnHeadersView.getFilterRangeOverlayInstance();

                        if(overlayInstance) {
                            const cellIndex = overlayInstance.$element().closest('td').index();

                            if(cellIndex === that._targetPoint.columnIndex || cellIndex === that._targetPoint.columnIndex + 1) {
                                overlayInstance.$content().hide();
                            }
                        }
                    }
                },

                _endResizing: function() {
                    const that = this;
                    let $cell;

                    if(that.isResizing()) {
                        const overlayInstance = that._columnHeadersView.getFilterRangeOverlayInstance();

                        if(overlayInstance) {
                            $cell = overlayInstance.$element().closest('td');
                            that._columnHeadersView._updateFilterRangeOverlay({ width: $cell.outerWidth(true) + CORRECT_FILTER_RANGE_OVERLAY_WIDTH });
                            overlayInstance.$content().show();
                        }
                    }

                    that.callBase.apply(that, arguments);
                }
            }
        },
        views: {
            columnHeadersView: ColumnHeadersViewFilterRowExtender,
            headerPanel: {
                _getToolbarItems: function() {
                    const items = this.callBase();
                    const filterItem = this._prepareFilterItem(items);

                    return filterItem.concat(items);
                },

                _prepareFilterItem: function() {
                    const that = this;
                    const filterItem = [];

                    if(that._isShowApplyFilterButton()) {
                        const hintText = that.option('filterRow.applyFilterText');
                        const columns = that._columnsController.getColumns();
                        const disabled = !columns.filter(function(column) {
                            return column.bufferedFilterValue !== undefined;
                        }).length;
                        const onInitialized = function(e) {
                            $(e.element).addClass(that._getToolbarButtonClass(APPLY_BUTTON_CLASS));
                        };
                        const onClickHandler = function() {
                            that._applyFilterViewController.applyFilter();
                        };
                        const toolbarItem = {
                            widget: 'dxButton',
                            options: {
                                icon: 'apply-filter',
                                disabled: disabled,
                                onClick: onClickHandler,
                                hint: hintText,
                                text: hintText,
                                onInitialized: onInitialized
                            },
                            showText: 'inMenu',
                            name: 'applyFilterButton',
                            location: 'after',
                            locateInMenu: 'auto',
                            sortIndex: 10
                        };

                        filterItem.push(toolbarItem);
                    }

                    return filterItem;
                },

                _isShowApplyFilterButton: function() {
                    const filterRowOptions = this.option('filterRow');
                    return filterRowOptions && filterRowOptions.visible && filterRowOptions.applyFilter === 'onClick';
                },

                init: function() {
                    this.callBase();
                    this._dataController = this.getController('data');
                    this._applyFilterViewController = this.getController('applyFilter');
                },

                enableApplyButton: function(value) {
                    this.setToolbarItemDisabled('applyFilterButton', !value);
                },

                isVisible: function() {
                    return this.callBase() || this._isShowApplyFilterButton();
                },

                optionChanged: function(args) {
                    if(args.name === 'filterRow') {
                        this._invalidate();
                        args.handled = true;
                    } else {
                        this.callBase(args);
                    }
                }
            }
        }
    }
};
