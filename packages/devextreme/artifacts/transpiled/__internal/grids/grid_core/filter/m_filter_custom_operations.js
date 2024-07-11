"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.anyOf = anyOf;
exports.noneOf = noneOf;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _deferred = require("../../../../core/utils/deferred");
var _extend = require("../../../../core/utils/extend");
var _data_source = require("../../../../data/data_source/data_source");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _ui = _interopRequireDefault(require("../../../../ui/widget/ui.errors"));
var _m_utils = require("../../../filter_builder/m_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function baseOperation(grid) {
  const calculateFilterExpression = function (filterValue, field, fields) {
    const result = [];
    const lastIndex = filterValue.length - 1;
    filterValue && filterValue.forEach((value, index) => {
      if ((0, _m_utils.isCondition)(value) || (0, _m_utils.isGroup)(value)) {
        const filterExpression = (0, _m_utils.getFilterExpression)(value, fields, [], 'headerFilter');
        result.push(filterExpression);
      } else {
        const filterExpression = (0, _m_utils.getFilterExpression)([field.dataField, '=', value], fields, [], 'headerFilter');
        result.push(filterExpression);
      }
      index !== lastIndex && result.push('or');
    });
    if (result.length === 1) {
      return result[0];
    }
    return result;
  };
  const getFullText = function (itemText, parentText) {
    return parentText ? `${parentText}/${itemText}` : itemText;
  };
  const getSelectedItemsTexts = function (items, parentText) {
    let result = [];
    items.forEach(item => {
      if (item.items) {
        const selectedItemsTexts = getSelectedItemsTexts(item.items, getFullText(item.text, parentText));
        result = result.concat(selectedItemsTexts);
      }
      item.selected && result.push(getFullText(item.text, parentText));
    });
    return result;
  };
  const headerFilterController = grid && grid.getController('headerFilter');
  // Override in the private API WA [T1232532]
  const customizeText = function (fieldInfo, options) {
    options = options || {};
    const {
      value
    } = fieldInfo;
    let column = grid.columnOption(fieldInfo.field.dataField);
    const headerFilter = column && column.headerFilter;
    const lookup = column && column.lookup;
    const values = options.values || [value];
    if (headerFilter && headerFilter.dataSource || lookup && lookup.dataSource) {
      // @ts-expect-error
      const result = new _deferred.Deferred();
      // @ts-expect-error
      const itemsDeferred = options.items || new _deferred.Deferred();
      if (!options.items) {
        column = (0, _extend.extend)({}, column, {
          filterType: 'include',
          filterValues: values
        });
        const dataSourceOptions = headerFilterController.getDataSource(column);
        dataSourceOptions.paginate = false;
        const dataSource = new _data_source.DataSource(dataSourceOptions);
        const key = dataSource.store().key();
        if (key) {
          const {
            values
          } = options;
          if (values && values.length > 1) {
            const filter = values.reduce((result, value) => {
              if (result.length) {
                result.push('or');
              }
              result.push([key, '=', value]);
              return result;
            }, []);
            dataSource.filter(filter);
          } else {
            dataSource.filter([key, '=', fieldInfo.value]);
          }
        } else if (fieldInfo.field.calculateDisplayValue) {
          _ui.default.log('W1017');
        }
        options.items = itemsDeferred;
        dataSource.load().done(itemsDeferred.resolve);
      }
      itemsDeferred.done(items => {
        const index = values.indexOf(fieldInfo.value);
        result.resolve(getSelectedItemsTexts(items, null)[index]);
      });
      return result;
    }
    const text = headerFilterController.getHeaderItemText(value, column, 0, grid.option('headerFilter'));
    return text;
  };
  return {
    dataTypes: ['string', 'date', 'datetime', 'number', 'boolean', 'object'],
    calculateFilterExpression,
    editorTemplate(conditionInfo, container) {
      const div = (0, _renderer.default)('<div>').addClass('dx-filterbuilder-item-value-text').appendTo(container);
      const column = (0, _extend.extend)(true, {}, grid.columnOption(conditionInfo.field.dataField));
      (0, _m_utils.renderValueText)(div, conditionInfo.text && conditionInfo.text.split('|'));
      const setValue = function (value) {
        conditionInfo.setValue(value);
      };
      column.filterType = 'include';
      column.filterValues = conditionInfo.value ? conditionInfo.value.slice() : [];
      headerFilterController.showHeaderFilterMenuBase({
        columnElement: div,
        column,
        apply() {
          setValue(this.filterValues);
          headerFilterController.hideHeaderFilterMenu();
          conditionInfo.closeEditor();
        },
        onHidden() {
          conditionInfo.closeEditor();
        },
        isFilterBuilder: true
      });
      return container;
    },
    customizeText
  };
}
function anyOf(grid) {
  return (0, _extend.extend)(baseOperation(grid), {
    name: 'anyof',
    icon: 'selectall',
    caption: _message.default.format('dxFilterBuilder-filterOperationAnyOf')
  });
}
function noneOf(grid) {
  const baseOp = baseOperation(grid);
  return (0, _extend.extend)({}, baseOp, {
    calculateFilterExpression(filterValue, field, fields) {
      const baseFilter = baseOp.calculateFilterExpression(filterValue, field, fields);
      if (!baseFilter || baseFilter.length === 0) return null;
      return baseFilter[0] === '!' ? baseFilter : ['!', baseFilter];
    },
    name: 'noneof',
    icon: 'unselectall',
    caption: _message.default.format('dxFilterBuilder-filterOperationNoneOf')
  });
}