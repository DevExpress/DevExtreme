import $ from '../../core/renderer';
import messageLocalization from '../../localization/message';
import { extend } from '../../core/utils/extend';
import { DataSource } from '../../data/data_source/data_source';
import { Deferred } from '../../core/utils/deferred';
import { isGroup, isCondition, getFilterExpression, renderValueText } from '../filter_builder/utils';
import errors from '../widget/ui.errors';

function baseOperation(grid) {
    const calculateFilterExpression = function(filterValue, field, fields) {
        let result = [];
        const lastIndex = filterValue.length - 1;
        filterValue && filterValue.forEach(function(value, index) {
            if(isCondition(value) || isGroup(value)) {
                const filterExpression = getFilterExpression(value, fields, [], 'headerFilter');
                result.push(filterExpression);
            } else {
                result.push(getFilterExpression([field.dataField, '=', value], fields, [], 'headerFilter'));
            }
            index !== lastIndex && result.push('or');
        });
        if(result.length === 1) {
            result = result[0];
        }
        return result;
    };

    const getFullText = function(itemText, parentText) {
        return parentText ? parentText + '/' + itemText : itemText;
    };

    const getSelectedItemsTexts = function(items, parentText) {
        let result = [];
        items.forEach(function(item) {
            if(item.items) {
                const selectedItemsTexts = getSelectedItemsTexts(item.items, getFullText(item.text, parentText));
                result = result.concat(selectedItemsTexts);
            }
            item.selected && result.push(getFullText(item.text, parentText));
        });
        return result;
    };

    const headerFilterController = grid && grid.getController('headerFilter');
    const customizeText = function(fieldInfo) {
        const value = fieldInfo.value;
        let column = grid.columnOption(fieldInfo.field.dataField);
        const headerFilter = column && column.headerFilter;
        const lookup = column && column.lookup;

        if((headerFilter && headerFilter.dataSource) || (lookup && lookup.dataSource)) {
            column = extend({}, column, { filterType: 'include', filterValues: [value] });
            const dataSourceOptions = headerFilterController.getDataSource(column);
            dataSourceOptions.paginate = false;
            const dataSource = new DataSource(dataSourceOptions);
            const result = new Deferred();

            const key = dataSource.store().key();

            if(key) {
                dataSource.filter([key, '=', fieldInfo.value]);
            } else if(fieldInfo.field.calculateDisplayValue) {
                errors.log('W1017');
            }

            dataSource.load().done(items => {
                result.resolve(getSelectedItemsTexts(items)[0]);
            });
            return result;
        } else {
            const text = headerFilterController.getHeaderItemText(value, column, 0, grid.option('headerFilter'));
            return text;
        }
    };
    return {
        dataTypes: ['string', 'date', 'datetime', 'number', 'boolean', 'object'],
        calculateFilterExpression: calculateFilterExpression,
        editorTemplate: function(conditionInfo, container) {
            const div = $('<div>')
                .addClass('dx-filterbuilder-item-value-text')
                .appendTo(container);
            const column = extend(true, {}, grid.columnOption(conditionInfo.field.dataField));

            renderValueText(div, conditionInfo.text && conditionInfo.text.split('|'));

            const setValue = function(value) {
                conditionInfo.setValue(value);
            };

            column.filterType = 'include';
            column.filterValues = conditionInfo.value ? conditionInfo.value.slice() : [];

            headerFilterController.showHeaderFilterMenuBase({
                columnElement: div,
                column: column,
                apply: function() {
                    setValue(this.filterValues);
                    headerFilterController.hideHeaderFilterMenu();
                    conditionInfo.closeEditor();
                },
                onHidden: function() {
                    conditionInfo.closeEditor();
                },
                isFilterBuilder: true
            });
            return container;
        },
        customizeText: customizeText
    };
}

export function anyOf(grid) {
    return extend(baseOperation(grid), {
        name: 'anyof',
        icon: 'selectall',
        caption: messageLocalization.format('dxFilterBuilder-filterOperationAnyOf')
    });
}

export function noneOf(grid) {
    const baseOp = baseOperation(grid);
    return extend({}, baseOp, {
        calculateFilterExpression: function(filterValue, field, fields) {
            const baseFilter = baseOp.calculateFilterExpression(filterValue, field, fields);
            if(!baseFilter || baseFilter.length === 0) return null;

            return baseFilter[0] === '!' ? baseFilter : ['!', baseFilter];
        },
        name: 'noneof',
        icon: 'unselectall',
        caption: messageLocalization.format('dxFilterBuilder-filterOperationNoneOf')
    });
}
