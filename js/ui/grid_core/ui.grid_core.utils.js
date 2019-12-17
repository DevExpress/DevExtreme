import $ from '../../core/renderer';
import { isDefined, isFunction } from '../../core/utils/type';
import { when } from '../../core/utils/deferred';
import { getGroupInterval } from '../shared/filtering';
import { format } from '../../core/utils/string';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import { extendFromObject } from '../../core/utils/extend';
import { toComparable } from '../../core/utils/data';
import { equalByValue } from '../../core/utils/common';
import LoadPanel from '../load_panel';
import { normalizeSortingInfo } from '../../data/utils';
import formatHelper from '../../format_helper';
import { deepExtendArraySafe } from '../../core/utils/object';
import { getWindow } from '../../core/utils/window';
import eventsEngine from '../../events/core/events_engine';

const DATAGRID_SELECTION_DISABLED_CLASS = 'dx-selection-disabled';
const DATAGRID_GROUP_OPENED_CLASS = 'dx-datagrid-group-opened';
const DATAGRID_GROUP_CLOSED_CLASS = 'dx-datagrid-group-closed';
const DATAGRID_EXPAND_CLASS = 'dx-datagrid-expand';
const NO_DATA_CLASS = 'nodata';
const DATE_INTERVAL_SELECTORS = {
    'year': function(value) {
        return value && value.getFullYear();
    },
    'month': function(value) {
        return value && (value.getMonth() + 1);
    },
    'day': function(value) {
        return value && value.getDate();
    },
    'quarter': function(value) {
        return value && (Math.floor(value.getMonth() / 3) + 1);
    },
    'hour': function(value) {
        return value && value.getHours();
    },
    'minute': function(value) {
        return value && value.getMinutes();
    },
    'second': function(value) {
        return value && value.getSeconds();
    }
};

module.exports = (function() {
    const getIntervalSelector = function() {
        let groupInterval;
        const data = arguments[1];
        let nameIntervalSelector;
        const value = this.calculateCellValue(data);

        if(!isDefined(value)) {
            return null;
        } else if(isDateType(this.dataType)) {
            nameIntervalSelector = arguments[0];
            return DATE_INTERVAL_SELECTORS[nameIntervalSelector](value);
        } else if(this.dataType === 'number') {
            groupInterval = arguments[0];
            return Math.floor(Number(value) / groupInterval) * groupInterval;
        }
    };

    const equalSelectors = function(selector1, selector2) {
        if(isFunction(selector1) && isFunction(selector2)) {
            if(selector1.originalCallback && selector2.originalCallback) {
                return selector1.originalCallback === selector2.originalCallback;
            }
        }

        return selector1 === selector2;
    };

    function isDateType(dataType) {
        return dataType === 'date' || dataType === 'datetime';
    }

    const setEmptyText = function($container) {
        $container.get(0).textContent = '\u00A0';
    };

    const getWidgetInstance = function($element) {
        const editorData = $element.data && $element.data();
        const dxComponents = editorData && editorData.dxComponents;
        const widgetName = dxComponents && dxComponents[0];

        return widgetName && editorData[widgetName];
    };

    return {
        renderNoDataText: function($element) {
            const that = this;
            $element = $element || this.element();

            if(!$element) {
                return;
            }

            const noDataClass = that.addWidgetPrefix(NO_DATA_CLASS);
            let noDataElement = $element.find('.' + noDataClass).last();
            const isVisible = this._dataController.isEmpty();
            const isLoading = this._dataController.isLoading();

            if(!noDataElement.length) {
                noDataElement = $('<span>')
                    .addClass(noDataClass)
                    .appendTo($element);
            }

            if(isVisible && !isLoading) {
                noDataElement
                    .removeClass('dx-hidden')
                    .text(that._getNoDataText());
            } else {
                noDataElement
                    .addClass('dx-hidden');
            }
        },

        renderLoadPanel: function($element, $container, isLocalStore) {
            const that = this;
            let loadPanelOptions;

            that._loadPanel && that._loadPanel.$element().remove();
            loadPanelOptions = that.option('loadPanel');

            if(loadPanelOptions && (loadPanelOptions.enabled === 'auto' ? !isLocalStore : loadPanelOptions.enabled)) {
                loadPanelOptions = extend({
                    shading: false,
                    message: loadPanelOptions.text,
                    position: function() {
                        const $window = $(getWindow());
                        if($element.height() > $window.height()) {
                            return {
                                of: $window,
                                boundary: $element,
                                collision: 'fit'
                            };
                        }
                        return { of: $element };
                    },
                    container: $container
                }, loadPanelOptions);

                that._loadPanel = that._createComponent($('<div>').appendTo($container), LoadPanel, loadPanelOptions);
            } else {
                that._loadPanel = null;
            }
        },

        getIndexByKey: function(key, items, keyName) {
            let index = -1;
            let item;

            if(key !== undefined && Array.isArray(items)) {
                keyName = arguments.length <= 2 ? 'key' : keyName;
                for(let i = 0; i < items.length; i++) {
                    item = isDefined(keyName) ? items[i][keyName] : items[i];

                    if(equalByValue(key, item)) {
                        index = i;
                        break;
                    }
                }
            }

            return index;
        },

        combineFilters: function(filters, operation) {
            let resultFilter = [];
            let i;

            operation = operation || 'and';

            for(i = 0; i < filters.length; i++) {
                if(!filters[i]) continue;
                if(resultFilter.length) {
                    resultFilter.push(operation);
                }
                resultFilter.push(filters[i]);
            }
            if(resultFilter.length === 1) {
                resultFilter = resultFilter[0];
            }
            if(resultFilter.length) {
                return resultFilter;
            }
        },

        checkChanges: function(changes, changeNames) {
            let changesWithChangeNamesCount = 0;
            let i;

            for(i = 0; i < changeNames.length; i++) {
                if(changes[changeNames[i]]) {
                    changesWithChangeNamesCount++;
                }
            }

            return changes.length && changes.length === changesWithChangeNamesCount;
        },

        equalFilterParameters: function(filter1, filter2) {
            let i;

            if(Array.isArray(filter1) && Array.isArray(filter2)) {
                if(filter1.length !== filter2.length) {
                    return false;
                } else {
                    for(i = 0; i < filter1.length; i++) {
                        if(!module.exports.equalFilterParameters(filter1[i], filter2[i])) {
                            return false;
                        }
                    }
                }
                return true;
            } else if(isFunction(filter1) && filter1.columnIndex >= 0 && isFunction(filter2) && filter2.columnIndex >= 0) {
                return filter1.columnIndex === filter2.columnIndex && toComparable(filter1.filterValue) === toComparable(filter2.filterValue);
            } else {
                return toComparable(filter1) == toComparable(filter2); // eslint-disable-line eqeqeq
            }
        },

        proxyMethod: function(instance, methodName, defaultResult) {
            if(!instance[methodName]) {
                instance[methodName] = function() {
                    const dataSource = this._dataSource;
                    return dataSource ? dataSource[methodName].apply(dataSource, arguments) : defaultResult;
                };
            }
        },

        formatValue: function(value, options) {
            const valueText = formatHelper.format(value, options.format) || (value && value.toString()) || '';
            const formatObject = {
                value: value,
                valueText: options.getDisplayFormat ? options.getDisplayFormat(valueText) : valueText,
                target: options.target || 'row',
                groupInterval: options.groupInterval
            };

            return options.customizeText ? options.customizeText.call(options, formatObject) : formatObject.valueText;
        },

        getFormatOptionsByColumn: function(column, target) {
            return {
                format: column.format,
                getDisplayFormat: column.getDisplayFormat,
                customizeText: column.customizeText,
                target: target,
                trueText: column.trueText,
                falseText: column.falseText
            };
        },

        getDisplayValue: function(column, value, data, rowType) {
            if(column.displayValueMap && column.displayValueMap[value] !== undefined) {
                return column.displayValueMap[value];
            } else if(column.calculateDisplayValue && data && rowType !== 'group') {
                return column.calculateDisplayValue(data);
            } else if(column.lookup && !(rowType === 'group' && (column.calculateGroupValue || column.calculateDisplayValue))) {
                return column.lookup.calculateCellValue(value);
            }
            return value;
        },

        getGroupRowSummaryText: function(summaryItems, summaryTexts) {
            let result = '(';
            let i;
            let summaryItem;

            for(i = 0; i < summaryItems.length; i++) {
                summaryItem = summaryItems[i];
                result += (i > 0 ? ', ' : '') + module.exports.getSummaryText(summaryItem, summaryTexts);
            }
            return result += ')';
        },

        getSummaryText: function(summaryItem, summaryTexts) {
            const displayFormat = summaryItem.displayFormat || (summaryItem.columnCaption && summaryTexts[summaryItem.summaryType + 'OtherColumn']) || summaryTexts[summaryItem.summaryType];

            return this.formatValue(summaryItem.value, {
                format: summaryItem.valueFormat,
                getDisplayFormat: function(valueText) {
                    return displayFormat ? format(displayFormat, valueText, summaryItem.columnCaption) : valueText;
                },
                customizeText: summaryItem.customizeText
            });
        },

        normalizeSortingInfo: function(sort) {
            sort = sort || [];
            let i;
            const result = normalizeSortingInfo(sort);

            for(i = 0; i < sort.length; i++) {
                if(sort && sort[i] && sort[i].isExpanded !== undefined) {
                    result[i].isExpanded = sort[i].isExpanded;
                }
                if(sort && sort[i] && sort[i].groupInterval !== undefined) {
                    result[i].groupInterval = sort[i].groupInterval;
                }
            }
            return result;
        },

        getFormatByDataType: function(dataType) {
            switch(dataType) {
                case 'date':
                    return 'shortDate';
                case 'datetime':
                    return 'shortDateShortTime';
            }
        },

        getHeaderFilterGroupParameters: function(column, remoteGrouping) {
            let result = [];
            const dataField = column.dataField || column.name;
            const groupInterval = getGroupInterval(column);

            if(groupInterval) {
                each(groupInterval, function(index, interval) {
                    result.push(remoteGrouping ? { selector: dataField, groupInterval: interval, isExpanded: index < groupInterval.length - 1 } : getIntervalSelector.bind(column, interval));
                });

                return result;
            }

            if(remoteGrouping) {
                result = [{ selector: dataField, isExpanded: false }];
            } else {
                result = function(data) {
                    let result = column.calculateCellValue(data);
                    if(result === undefined || result === '') {
                        result = null;
                    }
                    return result;
                };

                if(column.sortingMethod) {
                    result = [{ selector: result, compare: column.sortingMethod.bind(column) }];
                }
            }

            return result;
        },

        equalSortParameters: function(sortParameters1, sortParameters2, ignoreIsExpanded) {
            let i;

            sortParameters1 = module.exports.normalizeSortingInfo(sortParameters1);
            sortParameters2 = module.exports.normalizeSortingInfo(sortParameters2);

            if(Array.isArray(sortParameters1) && Array.isArray(sortParameters2)) {
                if(sortParameters1.length !== sortParameters2.length) {
                    return false;
                } else {
                    for(i = 0; i < sortParameters1.length; i++) {
                        if(!equalSelectors(sortParameters1[i].selector, sortParameters2[i].selector) || sortParameters1[i].desc !== sortParameters2[i].desc || sortParameters1[i].groupInterval !== sortParameters2[i].groupInterval || (!ignoreIsExpanded && Boolean(sortParameters1[i].isExpanded) !== Boolean(sortParameters2[i].isExpanded))) {
                            return false;
                        }
                    }
                }
                return true;
            } else {
                return (!sortParameters1 || !sortParameters1.length) === (!sortParameters2 || !sortParameters2.length);
            }
        },

        getPointsByColumns: function(items, pointCreated, isVertical, startColumnIndex) {
            const cellsLength = items.length;
            let notCreatePoint = false;
            let point;
            let i;
            let item;
            let offset;
            let columnIndex = startColumnIndex || 0;
            let prevItemOffset;
            const result = [];
            let rtlEnabled;

            for(i = 0; i <= cellsLength; i++) {
                if(i < cellsLength) {
                    item = items.eq(i);
                    offset = item.offset();
                    rtlEnabled = item.css('direction') === 'rtl';
                }

                point = {
                    index: columnIndex,
                    x: offset ? offset.left + ((!isVertical && (rtlEnabled ^ (i === cellsLength))) ? item[0].getBoundingClientRect().width : 0) : 0,
                    y: offset ? offset.top + ((isVertical && i === cellsLength) ? item[0].getBoundingClientRect().height : 0) : 0,
                    columnIndex: columnIndex
                };

                if(!isVertical && i > 0) {
                    prevItemOffset = items.eq(i - 1).offset();

                    if(prevItemOffset.top < point.y) {
                        point.y = prevItemOffset.top;
                    }
                }

                if(pointCreated) {
                    notCreatePoint = pointCreated(point);
                }

                if(!notCreatePoint) {
                    result.push(point);
                }
                columnIndex++;
            }
            return result;
        },

        createObjectWithChanges: function(target, changes) {
            const result = target ? Object.create(Object.getPrototypeOf(target)) : {};
            const targetWithoutPrototype = extendFromObject({}, target);

            deepExtendArraySafe(result, targetWithoutPrototype, true, true);
            return deepExtendArraySafe(result, changes, true, true);
        },

        getExpandCellTemplate: function() {
            return {
                allowRenderToDetachedContainer: true,
                render: function(container, options) {
                    let rowsView;
                    const $container = $(container);

                    if(isDefined(options.value) && !(options.data && options.data.isContinuation) && !options.row.isNewRow) {
                        rowsView = options.component.getView('rowsView');
                        $container
                            .addClass(DATAGRID_EXPAND_CLASS)
                            .addClass(DATAGRID_SELECTION_DISABLED_CLASS);

                        $('<div>')
                            .addClass(options.value ? DATAGRID_GROUP_OPENED_CLASS : DATAGRID_GROUP_CLOSED_CLASS)
                            .appendTo($container);

                        rowsView.setAria('label', options.value ? rowsView.localize('dxDataGrid-ariaCollapse') : rowsView.localize('dxDataGrid-ariaExpand'), $container);
                    } else {
                        setEmptyText($container);
                    }
                }
            };
        },

        setEmptyText: setEmptyText,

        isDateType: isDateType,

        getSelectionRange: function(focusedElement) {
            try {
                if(focusedElement) {
                    return {
                        selectionStart: focusedElement.selectionStart,
                        selectionEnd: focusedElement.selectionEnd
                    };
                }
            } catch(e) {}

            return {};
        },

        setSelectionRange: function(focusedElement, selectionRange) {
            try {
                if(focusedElement && focusedElement.setSelectionRange) {
                    focusedElement.setSelectionRange(selectionRange.selectionStart, selectionRange.selectionEnd);
                }
            } catch(e) {}
        },

        focusAndSelectElement: function(component, $element) {
            eventsEngine.trigger($element, 'focus');

            const isSelectTextOnEditingStart = component.option('editing.selectTextOnEditStart');
            const keyboardController = component.getController('keyboardNavigation');
            const isEditingNavigationMode = keyboardController && keyboardController._isFastEditingStarted();

            if(isSelectTextOnEditingStart && !isEditingNavigationMode && $element.is('.dx-texteditor-input')) {
                const editor = getWidgetInstance($element.closest('.dx-texteditor'));

                when(editor && editor._loadItemDeferred).done(function() {
                    $element.get(0).select();
                });
            }
        },

        getWidgetInstance: getWidgetInstance,

        getLastResizableColumnIndex: function(columns, resultWidths) {
            const hasResizableColumns = columns.some(column => column && !column.command && !column.fixed && column.allowResizing !== false);
            let lastColumnIndex;

            for(lastColumnIndex = columns.length - 1; columns[lastColumnIndex]; lastColumnIndex--) {
                const column = columns[lastColumnIndex];
                const width = resultWidths && resultWidths[lastColumnIndex];
                const allowResizing = !hasResizableColumns || column.allowResizing !== false;

                if(!column.command && !column.fixed && width !== 'adaptiveHidden' && allowResizing) {
                    break;
                }
            }

            return lastColumnIndex;
        },

        isElementInCurrentGrid: function(controller, $element) {
            if($element && $element.length) {
                const $grid = $element.closest('.' + controller.getWidgetContainerClass()).parent();
                return $grid.is(controller.component.$element());
            }
            return false;
        }
    };
})();
