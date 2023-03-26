import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import {
  isDefined, isPlainObject, isEmptyObject, isString, isFunction,
} from '@js/core/utils/type';
import { each, map } from '@js/core/utils/iterator';
import { extend } from '@js/core/utils/extend';
import { compileGetter } from '@js/core/utils/data';
import messageLocalization from '@js/localization/message';
import { ColumnsView } from '@js/ui/grid_core/ui.grid_core.columns_view';
import dataQuery from '@js/data/query';
import storeHelper from '@js/data/store_helper';
// @ts-expect-error
import { normalizeSortingInfo } from '@js/data/utils';
import errors from '@js/ui/widget/ui.errors';
import AggregateCalculator from '../module_aggregate_calculator';
import dataSourceAdapter from '../module_data_source_adapter';
import gridCore from '../module_core';

const DATAGRID_TOTAL_FOOTER_CLASS = 'dx-datagrid-total-footer';
const DATAGRID_SUMMARY_ITEM_CLASS = 'dx-datagrid-summary-item';
const DATAGRID_TEXT_CONTENT_CLASS = 'dx-datagrid-text-content';
const DATAGRID_GROUP_FOOTER_CLASS = 'dx-datagrid-group-footer';
const DATAGRID_GROUP_TEXT_CONTENT_CLASS = 'dx-datagrid-group-text-content';
const DATAGRID_NOWRAP_CLASS = 'dx-datagrid-nowrap';
const DATAGRID_FOOTER_ROW_CLASS = 'dx-footer-row';

const DATAGRID_GROUP_FOOTER_ROW_TYPE = 'groupFooter';
const DATAGRID_TOTAL_FOOTER_ROW_TYPE = 'totalFooter';

export const renderSummaryCell = function (cell, options) {
  const $cell = $(cell);
  const { column } = options;
  const { summaryItems } = options;
  const $summaryItems: any = [];

  if (!column.command && summaryItems) {
    for (let i = 0; i < summaryItems.length; i++) {
      const summaryItem = summaryItems[i];
      $summaryItems.push($('<div>')
        .css('textAlign', summaryItem.alignment || column.alignment)
        .addClass(DATAGRID_SUMMARY_ITEM_CLASS)
        .addClass(DATAGRID_TEXT_CONTENT_CLASS)
        .addClass(summaryItem.cssClass)
        .toggleClass(DATAGRID_GROUP_TEXT_CONTENT_CLASS, options.rowType === 'group')
        .text(gridCore.getSummaryText(summaryItem, options.summaryTexts)));
    }
    $cell.append($summaryItems);
  }
};
const getSummaryCellOptions = function (that, options) {
  const summaryTexts = that.option('summary.texts') || {};

  return {
    totalItem: options.row,
    summaryItems: options.row.summaryCells[options.columnIndex],
    summaryTexts,
  };
};

const getGroupAggregates = function (data) {
  return data.summary || data.aggregates || [];
};

const recalculateWhileEditing = function (that) {
  return that.option('summary.recalculateWhileEditing');
};

export const FooterView = ColumnsView.inherit((function () {
  return {
    _getRows() {
      return this._dataController.footerItems();
    },

    _getCellOptions(options) {
      return extend(this.callBase(options), getSummaryCellOptions(this, options));
    },

    _renderCellContent($cell, options) {
      renderSummaryCell($cell, options);
      this.callBase.apply(this, arguments);
    },

    _renderCore(change) {
      let needUpdateScrollLeft = false;
      const totalItem = this._dataController.footerItems()[0];

      if (!change || !change.columnIndices) {
        this.element()
          .empty()
          .addClass(DATAGRID_TOTAL_FOOTER_CLASS)
          .toggleClass(DATAGRID_NOWRAP_CLASS, !this.option('wordWrapEnabled'));

        needUpdateScrollLeft = true;
      }

      if (totalItem && totalItem.summaryCells && totalItem.summaryCells.length) {
        this._updateContent(this._renderTable({ change }), change);
        needUpdateScrollLeft && this._updateScrollLeftPosition();
      }
    },

    _updateContent($newTable, change) {
      if (change && change.changeType === 'update' && change.columnIndices) {
        return this.waitAsyncTemplates().done(() => {
          const $row = this.getTableElement().find('.dx-row');
          const $newRow = $newTable.find('.dx-row');

          this._updateCells($row, $newRow, change.columnIndices[0]);
        });
      }
      return this.callBase.apply(this, arguments);
    },

    _rowClick(e) {
      const item = this._dataController.footerItems()[e.rowIndex] || {};
      this.executeAction('onRowClick', extend({}, e, item));
    },

    _columnOptionChanged(e) {
      const { optionNames } = e;

      if (e.changeTypes.grouping) return;

      if (optionNames.width || optionNames.visibleWidth) {
        this.callBase(e);
      }
    },

    _handleDataChanged(e) {
      const { changeType } = e;

      if (e.changeType === 'update' && e.repaintChangesOnly) {
        if (!e.totalColumnIndices) {
          this.render();
        } else if (e.totalColumnIndices.length) {
          this.render(null, { changeType: 'update', columnIndices: [e.totalColumnIndices] });
        }
      } else if (changeType === 'refresh' || changeType === 'append' || changeType === 'prepend') {
        this.render();
      }
    },

    _createRow(row) {
      const $row = this.callBase.apply(this, arguments);

      if (row.rowType === DATAGRID_TOTAL_FOOTER_ROW_TYPE) {
        $row.addClass(DATAGRID_FOOTER_ROW_CLASS);
      }

      return $row;
    },

    getHeight() {
      return this.getElementHeight();
    },

    isVisible() {
      return !!this._dataController.footerItems().length;
    },
  };
})());

const SummaryDataSourceAdapterExtender = (function () {
  function forEachGroup(groups, groupCount, callback, path?) {
    path = path || [];
    for (let i = 0; i < groups.length; i++) {
      path.push(groups[i].key);
      if (groupCount === 1) {
        callback(path, groups[i].items);
      } else {
        forEachGroup(groups[i].items, groupCount - 1, callback, path);
      }
      path.pop();
    }
  }

  return {
    init() {
      this.callBase.apply(this, arguments);
      this._totalAggregates = [];
      this._summaryGetter = noop;
    },
    summaryGetter(summaryGetter) {
      if (!arguments.length) {
        return this._summaryGetter;
      }

      if (isFunction(summaryGetter)) {
        this._summaryGetter = summaryGetter;
      }
    },
    summary(summary) {
      if (!arguments.length) {
        return this._summaryGetter();
      }

      this._summaryGetter = function () { return summary; };
    },
    totalAggregates() {
      return this._totalAggregates;
    },
    isLastLevelGroupItemsPagingLocal() {
      const summary = this.summary();
      const sortByGroupsInfo = summary && summary.sortByGroups();

      return sortByGroupsInfo && sortByGroupsInfo.length;
    },
    sortLastLevelGroupItems(items, groups, paths) {
      const groupedItems = storeHelper.multiLevelGroup(dataQuery(items), groups).toArray();
      let result = [];

      paths.forEach((path) => {
        forEachGroup(groupedItems, groups.length, (itemsPath, items) => {
          if (path.toString() === itemsPath.toString()) {
            result = result.concat(items);
          }
        });
      });

      return result;
    },
  };
}());

const SummaryDataSourceAdapterClientExtender = (function () {
  const applyAddedData = function (data, insertedData, groupLevel?) {
    if (groupLevel) {
      return applyAddedData(data, insertedData.map((item) => ({ items: [item] }), groupLevel - 1));
    }

    return data.concat(insertedData);
  };

  const applyRemovedData = function (data, removedData, groupLevel) {
    if (groupLevel) {
      return data.map((data) => {
        const updatedData = {};
        const updatedItems = applyRemovedData(data.items || [], removedData, groupLevel - 1);

        Object.defineProperty(updatedData, 'aggregates', {
          get: () => data.aggregates,
          set: (value) => {
            data.aggregates = value;
          },
        });

        return extend(updatedData, data, { items: updatedItems });
      });
    }

    return data.filter((data) => removedData.indexOf(data) < 0);
  };

  const calculateAggregates = function (that, summary, data, groupLevel) {
    let calculator;

    if (recalculateWhileEditing(that)) {
      const editingController = that.getController('editing');
      if (editingController) {
        const insertedData = editingController.getInsertedData();
        if (insertedData.length) {
          data = applyAddedData(data, insertedData, groupLevel);
        }

        const removedData = editingController.getRemovedData();
        if (removedData.length) {
          data = applyRemovedData(data, removedData, groupLevel);
        }
      }
    }

    if (summary) {
      calculator = new AggregateCalculator({
        totalAggregates: summary.totalAggregates,
        groupAggregates: summary.groupAggregates,
        data,
        groupLevel,
      });

      calculator.calculate();
    }
    return calculator ? calculator.totalAggregates() : [];
  };

  const sortGroupsBySummaryCore = function (items, groups, sortByGroups) {
    if (!items || !groups.length) return items;

    const group = groups[0];
    const sorts = sortByGroups[0];
    let query;

    if (group && sorts && sorts.length) {
      query = dataQuery(items);
      each(sorts, function (index) {
        if (index === 0) {
          query = query.sortBy(this.selector, this.desc);
        } else {
          query = query.thenBy(this.selector, this.desc);
        }
      });
      query.enumerate().done((sortedItems) => {
        items = sortedItems;
      });
    }

    groups = groups.slice(1);
    sortByGroups = sortByGroups.slice(1);
    if (groups.length && sortByGroups.length) {
      each(items, function () {
        this.items = sortGroupsBySummaryCore(this.items, groups, sortByGroups);
      });
    }

    return items;
  };

  const sortGroupsBySummary = function (data, group, summary) {
    const sortByGroups = summary && summary.sortByGroups && summary.sortByGroups();

    if (sortByGroups && sortByGroups.length) {
      return sortGroupsBySummaryCore(data, group, sortByGroups);
    }
    return data;
  };

  return {
    _customizeRemoteOperations(options) {
      const summary = this.summary();

      if (summary) {
        if (options.remoteOperations.summary) {
          if (!options.isCustomLoading || options.storeLoadOptions.isLoadingAll) {
            if (options.storeLoadOptions.group) {
              if (options.remoteOperations.grouping) {
                options.storeLoadOptions.groupSummary = summary.groupAggregates;
              } else if (summary.groupAggregates.length) {
                options.remoteOperations.paging = false;
              }
            }
            options.storeLoadOptions.totalSummary = summary.totalAggregates;
          }
        } else if (summary.totalAggregates.length || (summary.groupAggregates.length && options.storeLoadOptions.group)) {
          options.remoteOperations.paging = false;
        }
      }
      this.callBase.apply(this, arguments);

      const cachedExtra = options.cachedData.extra;

      if (cachedExtra && cachedExtra.summary && !options.isCustomLoading) {
        options.storeLoadOptions.totalSummary = undefined;
      }
    },
    _handleDataLoadedCore(options) {
      const that = this;
      const groups = normalizeSortingInfo(options.storeLoadOptions.group || options.loadOptions.group || []);
      const remoteOperations = options.remoteOperations || {};
      const summary = that.summaryGetter()(remoteOperations);

      if (!options.isCustomLoading || options.storeLoadOptions.isLoadingAll) {
        if (remoteOperations.summary) {
          if (!remoteOperations.paging && groups.length && summary) {
            if (!remoteOperations.grouping) {
              calculateAggregates(that, { groupAggregates: summary.groupAggregates }, options.data, groups.length);
            }
            options.data = sortGroupsBySummary(options.data, groups, summary);
          }
        } else if (!remoteOperations.paging && summary) {
          const operationTypes = options.operationTypes || {};
          const hasOperations = Object.keys(operationTypes).some((type) => operationTypes[type]);
          if (!hasOperations || !options.cachedData?.extra?.summary || groups.length && summary.groupAggregates.length) {
            const totalAggregates = calculateAggregates(that, summary, options.data, groups.length);
            options.extra = isPlainObject(options.extra) ? options.extra : {};
            options.extra.summary = totalAggregates;
            if (options.cachedData) {
              options.cachedData.extra = options.extra;
            }
          }
          options.data = sortGroupsBySummary(options.data, groups, summary);
        }
      }

      if (!options.isCustomLoading) {
        that._totalAggregates = options.extra && options.extra.summary || that._totalAggregates;
      }

      that.callBase(options);
    },
  };
}());

dataSourceAdapter.extend(SummaryDataSourceAdapterExtender);
dataSourceAdapter.extend(SummaryDataSourceAdapterClientExtender);

gridCore.registerModule('summary', {
  defaultOptions() {
    return {
      summary: {
        groupItems: undefined,
        totalItems: undefined,
        calculateCustomSummary: undefined,
        skipEmptyValues: true,
        recalculateWhileEditing: false,
        texts: {
          sum: messageLocalization.format('dxDataGrid-summarySum'),
          sumOtherColumn: messageLocalization.format('dxDataGrid-summarySumOtherColumn'),
          min: messageLocalization.format('dxDataGrid-summaryMin'),
          minOtherColumn: messageLocalization.format('dxDataGrid-summaryMinOtherColumn'),
          max: messageLocalization.format('dxDataGrid-summaryMax'),
          maxOtherColumn: messageLocalization.format('dxDataGrid-summaryMaxOtherColumn'),
          avg: messageLocalization.format('dxDataGrid-summaryAvg'),
          avgOtherColumn: messageLocalization.format('dxDataGrid-summaryAvgOtherColumn'),
          count: messageLocalization.format('dxDataGrid-summaryCount'),
        },
      },
      sortByGroupSummaryInfo: undefined,
    };
  },
  views: {
    footerView: FooterView,
  },
  extenders: {
    controllers: {
      data: (function () {
        return {
          _isDataColumn(column) {
            return column && (!isDefined(column.groupIndex) || column.showWhenGrouped);
          },

          _isGroupFooterVisible() {
            const groupItems = this.option('summary.groupItems') || [];

            for (let i = 0; i < groupItems.length; i++) {
              const groupItem = groupItems[i];
              const column = this._columnsController.columnOption(groupItem.showInColumn || groupItem.column);
              if (groupItem.showInGroupFooter && this._isDataColumn(column)) {
                return true;
              }
            }

            return false;
          },

          _processGroupItems(items, groupCount, options) {
            const data = options && options.data;
            const result = this.callBase.apply(this, arguments);

            if (options) {
              if (options.isGroupFooterVisible === undefined) {
                options.isGroupFooterVisible = this._isGroupFooterVisible();
              }

              if (data && data.items && options.isGroupFooterVisible && (options.collectContinuationItems || !data.isContinuationOnNextPage)) {
                result.push({
                  rowType: DATAGRID_GROUP_FOOTER_ROW_TYPE,
                  key: options.path.slice(),
                  data,
                  groupIndex: options.path.length - 1,
                  values: [],
                });
              }
            }
            return result;
          },

          _processGroupItem(groupItem, options) {
            const that = this;

            if (!options.summaryGroupItems) {
              options.summaryGroupItems = that.option('summary.groupItems') || [];
            }
            if (groupItem.rowType === 'group') {
              let groupColumnIndex = -1;
              let afterGroupColumnIndex = -1;

              each(options.visibleColumns, function (visibleIndex: any) {
                const prevColumn = options.visibleColumns[visibleIndex - 1];

                if (groupItem.groupIndex === this.groupIndex) {
                  groupColumnIndex = this.index;
                }

                if (visibleIndex > 0 && prevColumn.command === 'expand' && this.command !== 'expand') {
                  afterGroupColumnIndex = this.index;
                }
              });

              groupItem.summaryCells = this._calculateSummaryCells(options.summaryGroupItems, getGroupAggregates(groupItem.data), options.visibleColumns, (summaryItem, column) => {
                if (summaryItem.showInGroupFooter) {
                  return -1;
                }

                if (summaryItem.alignByColumn && column && !isDefined(column.groupIndex) && (column.index !== afterGroupColumnIndex)) {
                  return column.index;
                }
                return groupColumnIndex;
              }, true);
            }
            if (groupItem.rowType === DATAGRID_GROUP_FOOTER_ROW_TYPE) {
              groupItem.summaryCells = this._calculateSummaryCells(options.summaryGroupItems, getGroupAggregates(groupItem.data), options.visibleColumns, (summaryItem, column) => (summaryItem.showInGroupFooter && that._isDataColumn(column) ? column.index : -1));
            }

            return groupItem;
          },

          _calculateSummaryCells(summaryItems, aggregates, visibleColumns, calculateTargetColumnIndex, isGroupRow) {
            const that = this;
            const summaryCells: any = [];
            const summaryCellsByColumns = {};

            each(summaryItems, (summaryIndex, summaryItem) => {
              const column = that._columnsController.columnOption(summaryItem.column);
              const showInColumn = summaryItem.showInColumn && that._columnsController.columnOption(summaryItem.showInColumn) || column;
              const columnIndex = calculateTargetColumnIndex(summaryItem, showInColumn);

              if (columnIndex >= 0) {
                if (!summaryCellsByColumns[columnIndex]) {
                  summaryCellsByColumns[columnIndex] = [];
                }

                const aggregate = aggregates[summaryIndex];
                if (aggregate === aggregate) {
                  let valueFormat;
                  if (isDefined(summaryItem.valueFormat)) {
                    valueFormat = summaryItem.valueFormat;
                  } else if (summaryItem.summaryType !== 'count') {
                    valueFormat = gridCore.getFormatByDataType(column && column.dataType);
                  }
                  summaryCellsByColumns[columnIndex].push(extend({}, summaryItem, {
                    value: isString(aggregate) && column && column.deserializeValue ? column.deserializeValue(aggregate) : aggregate,
                    valueFormat,
                    columnCaption: column && column.index !== columnIndex ? column.caption : undefined,
                  }));
                }
              }
            });
            if (!isEmptyObject(summaryCellsByColumns)) {
              visibleColumns.forEach((column, visibleIndex) => {
                const prevColumn = visibleColumns[visibleIndex - 1];
                const columnIndex = isGroupRow && (prevColumn?.command === 'expand' || column.command === 'expand') ? prevColumn?.index : column.index;
                summaryCells.push(summaryCellsByColumns[columnIndex] || []);
              });
            }

            return summaryCells;
          },

          _getSummaryCells(summaryTotalItems, totalAggregates) {
            const that = this;
            const columnsController = that._columnsController;

            return that._calculateSummaryCells(summaryTotalItems, totalAggregates, columnsController.getVisibleColumns(), (summaryItem, column) => (that._isDataColumn(column) ? column.index : -1));
          },

          _updateItemsCore(change) {
            const that = this;
            let summaryCells;
            const dataSource = that._dataSource;
            const footerItems = that._footerItems;
            const oldSummaryCells = footerItems && footerItems[0] && footerItems[0].summaryCells;
            const summaryTotalItems = that.option('summary.totalItems');

            that._footerItems = [];
            if (dataSource && summaryTotalItems && summaryTotalItems.length) {
              const totalAggregates = dataSource.totalAggregates();
              summaryCells = that._getSummaryCells(summaryTotalItems, totalAggregates);

              if (change && change.repaintChangesOnly && oldSummaryCells) {
                change.totalColumnIndices = summaryCells.map((summaryCell, index) => {
                  if (JSON.stringify(summaryCell) !== JSON.stringify(oldSummaryCells[index])) {
                    return index;
                  }
                  return -1;
                }).filter((index) => index >= 0);
              }

              if (summaryCells.length) {
                that._footerItems.push({
                  rowType: DATAGRID_TOTAL_FOOTER_ROW_TYPE,
                  summaryCells,
                });
              }
            }
            that.callBase(change);
          },

          _prepareUnsavedDataSelector(selector) {
            const that = this;

            if (recalculateWhileEditing(that)) {
              const editingController = that.getController('editing');
              if (editingController) {
                return function (data) {
                  data = editingController.getUpdatedData(data);
                  return selector(data);
                };
              }
            }

            return selector;
          },

          _prepareAggregateSelector(selector, aggregator) {
            selector = this._prepareUnsavedDataSelector(selector);

            if (aggregator === 'avg' || aggregator === 'sum') {
              return function (data) {
                const value = selector(data);
                return isDefined(value) ? Number(value) : value;
              };
            }

            return selector;
          },

          _getAggregates(summaryItems, remoteOperations) {
            const that = this;
            const columnsController = that.getController('columns');
            let calculateCustomSummary = that.option('summary.calculateCustomSummary');
            const commonSkipEmptyValues = that.option('summary.skipEmptyValues');

            return map(summaryItems || [], (summaryItem) => {
              const column = columnsController.columnOption(summaryItem.column);
              const calculateCellValue = column && column.calculateCellValue ? column.calculateCellValue.bind(column) : compileGetter(column ? column.dataField : summaryItem.column);
              let aggregator = summaryItem.summaryType || 'count';
              const skipEmptyValues = isDefined(summaryItem.skipEmptyValues) ? summaryItem.skipEmptyValues : commonSkipEmptyValues;

              if (remoteOperations) {
                return {
                  selector: summaryItem.column,
                  summaryType: aggregator,
                };
              }
              const selector = that._prepareAggregateSelector(calculateCellValue, aggregator);

              if (aggregator === 'custom') {
                if (!calculateCustomSummary) {
                  errors.log('E1026');
                  calculateCustomSummary = function () { };
                }
                const options: any = {
                  component: that.component,
                  name: summaryItem.name,
                };
                calculateCustomSummary(options);
                options.summaryProcess = 'calculate';
                aggregator = {
                  seed(groupIndex) {
                    options.summaryProcess = 'start';
                    options.totalValue = undefined;
                    options.groupIndex = groupIndex;
                    delete options.value;
                    calculateCustomSummary(options);
                    return options.totalValue;
                  },
                  step(totalValue, value) {
                    options.summaryProcess = 'calculate';
                    options.totalValue = totalValue;
                    options.value = value;
                    calculateCustomSummary(options);
                    return options.totalValue;
                  },
                  finalize(totalValue) {
                    options.summaryProcess = 'finalize';
                    options.totalValue = totalValue;
                    delete options.value;
                    calculateCustomSummary(options);
                    return options.totalValue;
                  },
                };
              }
              return {
                selector,
                aggregator,
                skipEmptyValues,
              };
            });
          },

          _addSortInfo(sortByGroups, groupColumn, selector, sortOrder) {
            if (groupColumn) {
              const { groupIndex } = groupColumn;
              sortOrder = sortOrder || groupColumn.sortOrder;
              if (isDefined(groupIndex)) {
                sortByGroups[groupIndex] = sortByGroups[groupIndex] || [];
                sortByGroups[groupIndex].push({
                  selector,
                  desc: sortOrder === 'desc',
                });
              }
            }
          },

          _findSummaryItem(summaryItems, name) {
            let summaryItemIndex: any = -1;

            const getFullName = function (summaryItem) {
              const { summaryType } = summaryItem;
              const { column } = summaryItem;

              return summaryType && column && `${summaryType}_${column}`;
            };

            if (isDefined(name)) {
              // @ts-expect-error
              each(summaryItems || [], function (index) {
                if (this.name === name || index === name || this.summaryType === name || this.column === name || getFullName(this) === name) {
                  summaryItemIndex = index;
                  return false;
                }
              });
            }
            return summaryItemIndex;
          },

          _getSummarySortByGroups(sortByGroupSummaryInfo, groupSummaryItems) {
            const that = this;
            const columnsController = that._columnsController;
            const groupColumns = columnsController.getGroupColumns();
            const sortByGroups = [];

            if (!groupSummaryItems || !groupSummaryItems.length) return;

            each(sortByGroupSummaryInfo || [], function () {
              const { sortOrder } = this;
              let { groupColumn } = this;
              const summaryItemIndex = that._findSummaryItem(groupSummaryItems, this.summaryItem);

              if (summaryItemIndex < 0) return;

              const selector = function (data) {
                return getGroupAggregates(data)[summaryItemIndex];
              };

              if (isDefined(groupColumn)) {
                groupColumn = columnsController.columnOption(groupColumn);
                that._addSortInfo(sortByGroups, groupColumn, selector, sortOrder);
              } else {
                each(groupColumns, (groupIndex, groupColumn) => {
                  that._addSortInfo(sortByGroups, groupColumn, selector, sortOrder);
                });
              }
            });
            return sortByGroups;
          },

          _createDataSourceAdapterCore(dataSource, remoteOperations) {
            const that = this;
            const dataSourceAdapter = this.callBase(dataSource, remoteOperations);

            dataSourceAdapter.summaryGetter((currentRemoteOperations) => that._getSummaryOptions(currentRemoteOperations || remoteOperations));

            return dataSourceAdapter;
          },

          _getSummaryOptions(remoteOperations) {
            const that = this;
            const groupSummaryItems = that.option('summary.groupItems');
            const totalSummaryItems = that.option('summary.totalItems');
            const sortByGroupSummaryInfo = that.option('sortByGroupSummaryInfo');
            const groupAggregates = that._getAggregates(groupSummaryItems, remoteOperations && remoteOperations.grouping && remoteOperations.summary);
            const totalAggregates = that._getAggregates(totalSummaryItems, remoteOperations && remoteOperations.summary);
            const sortByGroups = function () {
              return that._getSummarySortByGroups(sortByGroupSummaryInfo, groupSummaryItems);
            };

            if (groupAggregates.length || totalAggregates.length) {
              return {
                groupAggregates,
                totalAggregates,
                sortByGroups,
              };
            }
          },

          publicMethods() {
            const methods = this.callBase();
            methods.push('getTotalSummaryValue');
            return methods;
          },

          getTotalSummaryValue(summaryItemName) {
            const summaryItemIndex = this._findSummaryItem(this.option('summary.totalItems'), summaryItemName);
            const aggregates = this._dataSource.totalAggregates();

            if (aggregates.length && summaryItemIndex > -1) {
              return aggregates[summaryItemIndex];
            }
          },

          optionChanged(args) {
            if (args.name === 'summary' || args.name === 'sortByGroupSummaryInfo') {
              args.name = 'dataSource';
            }
            this.callBase(args);
          },

          init() {
            this._footerItems = [];
            this.callBase();
          },

          footerItems() {
            return this._footerItems;
          },
        };
      }()),
      editing: (function () {
        return {
          _refreshSummary() {
            if (recalculateWhileEditing(this) && !this.isSaving()) {
              this._dataController.refresh({
                load: true,
                changesOnly: true,
              });
            }
          },
          _addChange(params) {
            const result = this.callBase.apply(this, arguments);

            if (params.type) {
              this._refreshSummary();
            }

            return result;
          },
          _removeChange() {
            const result = this.callBase.apply(this, arguments);

            this._refreshSummary();

            return result;
          },
          cancelEditData() {
            const result = this.callBase.apply(this, arguments);

            this._refreshSummary();

            return result;
          },
        };
      }()),
    },
    views: {
      rowsView: (function () {
        return {
          _createRow(row) {
            const $row = this.callBase.apply(this, arguments);

            row && $row.addClass(row.rowType === DATAGRID_GROUP_FOOTER_ROW_TYPE ? DATAGRID_GROUP_FOOTER_CLASS : '');
            return $row;
          },

          _renderCells($row, options) {
            this.callBase.apply(this, arguments);

            if (options.row.rowType === 'group' && options.row.summaryCells && options.row.summaryCells.length) {
              this._renderGroupSummaryCells($row, options);
            }
          },

          _hasAlignByColumnSummaryItems(columnIndex, options) {
            return !isDefined(options.columns[columnIndex].groupIndex) && options.row.summaryCells[columnIndex].length;
          },

          _getAlignByColumnCellCount(groupCellColSpan, options) {
            let alignByColumnCellCount = 0;

            for (let i = 1; i < groupCellColSpan; i++) {
              const columnIndex = options.row.summaryCells.length - i;
              alignByColumnCellCount = this._hasAlignByColumnSummaryItems(columnIndex, options) ? i : alignByColumnCellCount;
            }

            return alignByColumnCellCount;
          },

          _renderGroupSummaryCells($row, options) {
            const $groupCell = $row.children().last();
            const groupCellColSpan = Number($groupCell.attr('colSpan')) || 1;
            const alignByColumnCellCount = this._getAlignByColumnCellCount(groupCellColSpan, options);

            this._renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount);
          },

          _renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount) {
            if (alignByColumnCellCount > 0) {
              $groupCell.attr('colSpan', groupCellColSpan - alignByColumnCellCount);

              for (let i = 0; i < alignByColumnCellCount; i++) {
                const columnIndex = options.columns.length - alignByColumnCellCount + i;

                this._renderCell($groupCell.parent(), extend({ column: options.columns[columnIndex], columnIndex: this._getSummaryCellIndex(columnIndex, options.columns) }, options));
              }
            }
          },

          _getSummaryCellIndex(columnIndex) {
            return columnIndex;
          },

          _getCellTemplate(options) {
            if (!options.column.command && !isDefined(options.column.groupIndex) && options.summaryItems && options.summaryItems.length) {
              return renderSummaryCell;
            }
            return this.callBase(options);
          },

          _getCellOptions(options) {
            const that = this;
            const parameters = that.callBase(options);

            if (options.row.summaryCells) {
              return extend(parameters, getSummaryCellOptions(that, options));
            }
            return parameters;
          },
        };
      }()),
    },
  },
});
