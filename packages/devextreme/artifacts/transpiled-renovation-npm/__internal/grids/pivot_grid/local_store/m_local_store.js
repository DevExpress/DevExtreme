"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.LocalStore = void 0;
var _class = _interopRequireDefault(require("../../../../core/class"));
var _common = require("../../../../core/utils/common");
var _data = require("../../../../core/utils/data");
var _date_serialization = _interopRequireDefault(require("../../../../core/utils/date_serialization"));
var _deferred = require("../../../../core/utils/deferred");
var _iterator = require("../../../../core/utils/iterator");
var _type = require("../../../../core/utils/type");
var _array_store = _interopRequireDefault(require("../../../../data/array_store"));
var _custom_store = _interopRequireDefault(require("../../../../data/custom_store"));
var _data_source = require("../../../../data/data_source/data_source");
var _query = _interopRequireDefault(require("../../../../data/query"));
var _utils = require("../../../../data/utils");
var _m_widget_utils = require("../m_widget_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// @ts-expect-error

// eslint-disable-next-line import/extensions
// @ts-expect-error

const PATH_DELIMETER = '/./';
const LocalStore = exports.LocalStore = _class.default.inherit(function () {
  const DATE_INTERVAL_SELECTORS = {
    year(date) {
      return date && date.getFullYear();
    },
    quarter(date) {
      return date && Math.floor(date.getMonth() / 3) + 1;
    },
    month(date) {
      return date && date.getMonth() + 1;
    },
    day(date) {
      return date && date.getDate();
    },
    dayOfWeek(date) {
      return date && date.getDay();
    }
  };
  function getDataSelector(dataField) {
    return dataField.indexOf('.') !== -1 ? (0, _data.compileGetter)(dataField) : function (data) {
      return data[dataField];
    };
  }
  function getDateValue(dataSelector) {
    return function (data) {
      let value = dataSelector(data);
      if (value && !(value instanceof Date)) {
        value = _date_serialization.default.deserializeDate(value);
      }
      return value;
    };
  }
  function prepareFields(fields) {
    (0, _iterator.each)(fields || [], (_, field) => {
      let fieldSelector;
      let intervalSelector;
      const {
        dataField
      } = field;
      let groupInterval;
      const {
        levels
      } = field;
      let dataSelector;
      if (!field.selector) {
        if (!dataField) {
          dataSelector = function (data) {
            return data;
          };
        } else {
          dataSelector = getDataSelector(dataField);
        }
        if (levels) {
          prepareFields(levels);
        }
        if (field.dataType === 'date') {
          intervalSelector = DATE_INTERVAL_SELECTORS[field.groupInterval];
          const valueSelector = getDateValue(dataSelector);
          fieldSelector = function (data) {
            const value = valueSelector(data);
            return intervalSelector ? intervalSelector(value) : value;
          };
        } else if (field.dataType === 'number') {
          groupInterval = (0, _type.isNumeric)(field.groupInterval) && field.groupInterval > 0 && field.groupInterval;
          fieldSelector = function (data) {
            let value = dataSelector(data);
            if ((0, _type.isString)(value)) {
              value = Number(value);
            }
            return groupInterval ? Math.floor(value / groupInterval) * groupInterval : value;
          };
        } else {
          fieldSelector = dataSelector;
        }
        (0, _m_widget_utils.setDefaultFieldValueFormatting)(field);
        (0, _m_widget_utils.setFieldProperty)(field, 'selector', fieldSelector);
      }
    });
  }
  const addHierarchyItem = function (value, hierarchyItems, pathHash, childrenHash) {
    let hierarchyItem = childrenHash[pathHash];
    if (!hierarchyItem) {
      hierarchyItem = {
        value,
        // eslint-disable-next-line no-plusplus
        index: childrenHash.length++
      };
      childrenHash[pathHash] = hierarchyItem;
      hierarchyItems.push(hierarchyItem);
    }
    return hierarchyItem;
  };
  function fillHierarchyItemIndexesCore(indexes, options, children, expandIndex, pathHash) {
    const dimension = options.dimensions[expandIndex];
    const {
      expandedPathsHash
    } = options;
    let dimensionValue;
    let hierarchyItem;
    if (dimension) {
      dimensionValue = dimension.selector(options.data);
      pathHash = pathHash !== undefined ? pathHash + PATH_DELIMETER + dimensionValue : `${dimensionValue}`;
      hierarchyItem = addHierarchyItem(dimensionValue, children, pathHash, options.childrenHash);
      indexes.push(hierarchyItem.index);
      if (expandedPathsHash && expandedPathsHash[pathHash] || dimension.expanded) {
        if (!hierarchyItem.children) {
          hierarchyItem.children = [];
        }
        fillHierarchyItemIndexesCore(indexes, options, hierarchyItem.children, expandIndex + 1, pathHash);
      }
    }
  }
  function generateHierarchyItems(data, loadOptions, headers, headerName) {
    const result = [0];
    const expandIndex = loadOptions.headerName === headerName ? loadOptions.path.length : 0;
    const expandedPaths = headerName === 'rows' ? loadOptions.rowExpandedPaths : loadOptions.columnExpandedPaths;
    const options = {
      data,
      childrenHash: headers[`${headerName}Hash`],
      dimensions: loadOptions[headerName],
      expandedPathsHash: loadOptions.headerName !== headerName && expandedPaths && expandedPaths.hash
    };
    fillHierarchyItemIndexesCore(result, options, headers[headerName], expandIndex);
    return result;
  }
  function generateAggregationCells(data, cells, headers, options) {
    const cellSet = [];
    let x;
    let y;
    let rowIndex;
    let columnIndex;
    const rowIndexes = generateHierarchyItems(data, options, headers, 'rows');
    const columnIndexes = generateHierarchyItems(data, options, headers, 'columns');
    for (y = 0; y < rowIndexes.length; y += 1) {
      rowIndex = rowIndexes[y];
      cells[rowIndex] = cells[rowIndex] || [];
      for (x = 0; x < columnIndexes.length; x += 1) {
        columnIndex = columnIndexes[x];
        cellSet.push(cells[rowIndex][columnIndex] = cells[rowIndex][columnIndex] || []);
      }
    }
    return cellSet;
  }
  function fillHashExpandedPath(expandedPaths) {
    if (expandedPaths) {
      const hash = expandedPaths.hash = {};
      expandedPaths.forEach(path => {
        const pathValue = path.map(value => `${value}`).join(PATH_DELIMETER);
        hash[pathValue] = true;
      });
    }
  }
  function prepareLoadOption(options) {
    options.rows = options.rows || [];
    options.columns = options.columns || [];
    options.filters = options.filters || [];
    fillHashExpandedPath(options.columnExpandedPaths);
    fillHashExpandedPath(options.rowExpandedPaths);
    prepareFields(options.columns);
    prepareFields(options.rows);
    prepareFields(options.values);
    prepareFields(options.filters);
  }
  function getAggregator(field) {
    if (field.summaryType === 'custom') {
      field.calculateCustomSummary = field.calculateCustomSummary || _common.noop;
      return {
        seed() {
          const options = {
            summaryProcess: 'start',
            totalValue: undefined
          };
          field.calculateCustomSummary(options);
          return options;
        },
        step(options, value) {
          options.summaryProcess = 'calculate';
          options.value = value;
          field.calculateCustomSummary(options);
          return options;
        },
        finalize(options) {
          options.summaryProcess = 'finalize';
          delete options.value;
          field.calculateCustomSummary(options);
          return options.totalValue;
        }
      };
    }
    return _utils.aggregators[field.summaryType] || _utils.aggregators.count;
  }
  function aggregationStep(measures, aggregationCells, data) {
    for (let aggregatorIndex = 0; aggregatorIndex < measures.length; aggregatorIndex += 1) {
      const cellField = measures[aggregatorIndex];
      const cellValue = cellField.selector(data);
      const aggregator = getAggregator(cellField);
      const isAggregatorSeedFunction = typeof aggregator.seed === 'function';
      for (let cellSetIndex = 0; cellSetIndex < aggregationCells.length; cellSetIndex += 1) {
        const cell = aggregationCells[cellSetIndex];
        if (cell.length <= aggregatorIndex) {
          cell[aggregatorIndex] = isAggregatorSeedFunction ? aggregator.seed() : aggregator.seed;
        }
        if (cell[aggregatorIndex] === undefined) {
          cell[aggregatorIndex] = cellValue;
        } else if ((0, _type.isDefined)(cellValue)) {
          cell[aggregatorIndex] = aggregator.step(cell[aggregatorIndex], cellValue);
        }
      }
    }
  }
  function aggregationFinalize(measures, cells) {
    (0, _iterator.each)(measures, (aggregatorIndex, cellField) => {
      const aggregator = getAggregator(cellField);
      if (aggregator.finalize) {
        (0, _iterator.each)(cells, (_, row) => {
          (0, _iterator.each)(row, (_, cell) => {
            if (cell && cell[aggregatorIndex] !== undefined) {
              cell[aggregatorIndex] = aggregator.finalize(cell[aggregatorIndex]);
            }
          });
        });
      }
    });
  }
  function areValuesEqual(filterValue, fieldValue) {
    let valueOfFilter = filterValue && filterValue.valueOf();
    let valueOfField = fieldValue && fieldValue.valueOf();
    if (Array.isArray(filterValue)) {
      fieldValue = fieldValue || [];
      for (let i = 0; i < filterValue.length; i += 1) {
        valueOfFilter = filterValue[i] && filterValue[i].valueOf();
        valueOfField = fieldValue[i] && fieldValue[i].valueOf();
        if (valueOfFilter !== valueOfField) {
          return false;
        }
      }
      return true;
    }
    return valueOfFilter === valueOfField;
  }
  function getGroupValue(levels, data) {
    const value = [];
    (0, _iterator.each)(levels, (_, field) => {
      value.push(field.selector(data));
    });
    return value;
  }
  function createDimensionFilters(dimension) {
    const filters = [];
    (0, _iterator.each)(dimension, (_, field) => {
      const filterValues = field.filterValues || [];
      const {
        groupName
      } = field;
      if (groupName && (0, _type.isNumeric)(field.groupIndex)) {
        return;
      }
      const filter = function (dataItem) {
        const value = field.levels ? getGroupValue(field.levels, dataItem) : field.selector(dataItem);
        let result = false;
        for (let i = 0; i < filterValues.length; i += 1) {
          if (areValuesEqual(filterValues[i], value)) {
            result = true;
            break;
          }
        }
        return field.filterType === 'exclude' ? !result : result;
      };
      filterValues.length && filters.push(filter);
    });
    return filters;
  }
  function createFilter(options) {
    const filters = createDimensionFilters(options.rows).concat(createDimensionFilters(options.columns)).concat(createDimensionFilters(options.filters));
    const expandedDimensions = options[options.headerName];
    const {
      path
    } = options;
    if (expandedDimensions) {
      filters.push(dataItem => {
        let expandValue;
        for (let i = 0; i < path.length; i += 1) {
          expandValue = expandedDimensions[i].selector(dataItem);
          if ((0, _data.toComparable)(expandValue, true) !== (0, _data.toComparable)(path[i], true)) {
            return false;
          }
        }
        return true;
      });
    }
    return function (dataItem) {
      for (let i = 0; i < filters.length; i += 1) {
        if (!filters[i](dataItem)) {
          return false;
        }
      }
      return true;
    };
  }
  function loadCore(items, options, notifyProgress) {
    const headers = {
      columns: [],
      rows: [],
      columnsHash: {
        length: 1
      },
      rowsHash: {
        length: 1
      }
    };
    const values = [];
    let aggregationCells;
    let data;
    // @ts-expect-error
    const d = new _deferred.Deferred();
    let i = 0;
    const filter = createFilter(options);
    function processData() {
      const t = new Date();
      const startIndex = i;
      for (; i < items.length; i += 1) {
        if (i > startIndex && i % 10000 === 0) {
          if (new Date() - t >= 300) {
            notifyProgress(i / items.length);
            setTimeout(processData, 0);
            return;
          }
        }
        data = items[i];
        if (filter(data)) {
          aggregationCells = generateAggregationCells(data, values, headers, options);
          aggregationStep(options.values, aggregationCells, data);
        }
      }
      aggregationFinalize(options.values, values);
      notifyProgress(1);
      d.resolve({
        rows: headers.rows,
        columns: headers.columns,
        values,
        grandTotalRowIndex: 0,
        grandTotalColumnIndex: 0
      });
    }
    processData();
    return d;
  }
  function filterDataSource(dataSource, fieldSelectors) {
    let filter = dataSource.filter();
    if (dataSource.store() instanceof _custom_store.default && filter) {
      filter = processFilter(filter, fieldSelectors);
      return (0, _query.default)(dataSource.items()).filter(filter).toArray();
    }
    return dataSource.items();
  }
  function loadDataSource(dataSource, fieldSelectors, reload) {
    // @ts-expect-error
    const d = new _deferred.Deferred();
    const customizeStoreLoadOptionsHandler = function (options) {
      if (dataSource.store() instanceof _array_store.default) {
        options.storeLoadOptions.filter = processFilter(options.storeLoadOptions.filter, fieldSelectors);
      }
    };
    dataSource.on('customizeStoreLoadOptions', customizeStoreLoadOptionsHandler);
    if (!dataSource.isLoaded() || reload) {
      const loadDeferred = reload ? dataSource.load() : dataSource.reload();
      (0, _deferred.when)(loadDeferred).done(() => {
        loadDataSource(dataSource, fieldSelectors).done(() => {
          d.resolve(filterDataSource(dataSource, fieldSelectors));
        }).fail(d.reject);
      }).fail(d.reject);
    } else {
      d.resolve(filterDataSource(dataSource, fieldSelectors));
    }
    return d.always(() => {
      dataSource.off('customizeStoreLoadOptions', customizeStoreLoadOptionsHandler);
    });
  }
  function fillSelectorsByFields(selectors, fields) {
    fields.forEach(field => {
      if (field.dataField && field.dataType === 'date') {
        const valueSelector = getDateValue(getDataSelector(field.dataField));
        selectors[field.dataField] = function (data) {
          return valueSelector(data);
        };
      }
    });
  }
  function getFieldSelectors(options) {
    const selectors = {};
    if (Array.isArray(options)) {
      fillSelectorsByFields(selectors, options);
    } else if (options) {
      ['rows', 'columns', 'filters'].forEach(area => {
        options[area] && fillSelectorsByFields(selectors, options[area]);
      });
    }
    return selectors;
  }
  function processFilter(filter, fieldSelectors) {
    if (!Array.isArray(filter)) {
      return filter;
    }
    filter = filter.slice(0);
    if ((0, _type.isString)(filter[0]) && (filter[1] instanceof Date || filter[2] instanceof Date)) {
      filter[0] = fieldSelectors[filter[0]];
    }
    for (let i = 0; i < filter.length; i += 1) {
      filter[i] = processFilter(filter[i], fieldSelectors);
    }
    return filter;
  }
  return {
    ctor(options) {
      this._progressChanged = options.onProgressChanged || _common.noop;
      this._dataSource = new _data_source.DataSource(options);
      this._dataSource.paginate(false);
    },
    getFields(fields) {
      const that = this;
      const dataSource = that._dataSource;
      // @ts-expect-error
      const d = new _deferred.Deferred();
      loadDataSource(dataSource, getFieldSelectors(fields)).done(data => {
        d.resolve((0, _m_widget_utils.discoverObjectFields)(data, fields));
      }).fail(d.reject);
      return d;
    },
    key() {
      return this._dataSource.key();
    },
    load(options) {
      const that = this;
      const dataSource = that._dataSource;
      // @ts-expect-error
      const d = new _deferred.Deferred();
      prepareLoadOption(options);
      loadDataSource(dataSource, getFieldSelectors(options), options.reload).done(data => {
        (0, _deferred.when)(loadCore(data, options, that._progressChanged)).done(d.resolve);
      }).fail(d.reject);
      return d;
    },
    filter() {
      const dataSource = this._dataSource;
      return dataSource.filter.apply(dataSource, arguments);
    },
    supportPaging() {
      return false;
    },
    getDrillDownItems(loadOptions, params) {
      loadOptions = loadOptions || {};
      params = params || {};
      prepareLoadOption(loadOptions);
      const drillDownItems = [];
      const items = this._dataSource.items();
      let item;
      const {
        maxRowCount
      } = params;
      const {
        customColumns
      } = params;
      const filter = createFilter(loadOptions);
      const pathFilter = createFilter({
        rows: (0, _m_widget_utils.getFiltersByPath)(loadOptions.rows, params.rowPath),
        columns: (0, _m_widget_utils.getFiltersByPath)(loadOptions.columns, params.columnPath),
        filters: []
      });
      for (let i = 0; i < items.length; i += 1) {
        if (pathFilter(items[i]) && filter(items[i])) {
          if (customColumns) {
            item = {};
            for (let j = 0; j < customColumns.length; j += 1) {
              item[customColumns[j]] = items[i][customColumns[j]];
            }
          } else {
            item = items[i];
          }
          drillDownItems.push(item);
        }
        if (maxRowCount > 0 && drillDownItems.length === maxRowCount) {
          break;
        }
      }
      return drillDownItems;
    }
  };
}()).include(_m_widget_utils.storeDrillDownMixin);
var _default = exports.default = {
  LocalStore
};