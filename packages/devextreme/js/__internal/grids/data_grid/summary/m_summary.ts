/* eslint-disable max-classes-per-file */
import dataQuery from '@js/common/data/query';
import storeHelper from '@js/common/data/store_helper';
import { normalizeSortingInfo } from '@js/common/data/utils';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDefined, isFunction, isPlainObject } from '@js/core/utils/type';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/m_data_source_adapter';
import type { EditingControllerRequired, ModuleType } from '@ts/grids/grid_core/m_types';
import { ColumnsView } from '@ts/grids/grid_core/views/m_columns_view';

import type { EditingController } from '../../grid_core/editing/m_editing';
import type { RowsView } from '../../grid_core/views/m_rows_view';
import AggregateCalculator from '../m_aggregate_calculator';
import gridCore from '../m_core';
import {
  DATAGRID_CELL_DISABLED,
  DATAGRID_FOOTER_ROW_CLASS,
  DATAGRID_GROUP_FOOTER_CLASS,
  DATAGRID_GROUP_FOOTER_ROW_TYPE,
  DATAGRID_GROUP_TEXT_CONTENT_CLASS,
  DATAGRID_NOWRAP_CLASS,
  DATAGRID_SUMMARY_ITEM_CLASS,
  DATAGRID_TEXT_CONTENT_CLASS,
  DATAGRID_TOTAL_FOOTER_CLASS,
  DATAGRID_TOTAL_FOOTER_ROW_TYPE,
} from './const';

export const renderSummaryCell = function (cell, options, setAria) {
  const $cell = $(cell);
  const { column } = options;
  const { summaryItems } = options;
  const $summaryItems: any = [];

  if (!column.command && summaryItems) {
    for (const summaryItem of summaryItems) {
      const text = gridCore.getSummaryText(summaryItem, options.summaryTexts);
      const $summaryItemElement = $('<div>')
        .css('textAlign', summaryItem.alignment || column.alignment)
        .addClass(DATAGRID_SUMMARY_ITEM_CLASS)
        .addClass(DATAGRID_TEXT_CONTENT_CLASS)
        .addClass(summaryItem.cssClass)
        .toggleClass(DATAGRID_GROUP_TEXT_CONTENT_CLASS, options.rowType === 'group')
        .text(text);

      setAria('label', `${column.caption ?? ''} ${text ?? ''}`, $summaryItemElement);
      $summaryItems.push($summaryItemElement);
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

const forEachGroup = function (groups, groupCount, callback, path?) {
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
};

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

const sortGroupsBySummaryCore = function (items, groups, sortByGroups) {
  if (!items || !groups.length) return items;

  const group = groups[0];
  const sorts = sortByGroups[0];
  let query;

  if (group && sorts && sorts.length) {
    // @ts-expect-error
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

const calculateAggregates = function (that: EditingControllerRequired, summary, data, groupLevel) {
  let calculator;

  if ((that as any).option('summary.recalculateWhileEditing')) {
    const editingController = that._editingController;
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

export class FooterView extends ColumnsView {
  protected _getRows() {
    // @ts-expect-error
    return this._dataController.footerItems();
  }

  protected _getCellOptions(options) {
    return extend(super._getCellOptions(options), getSummaryCellOptions(this, options));
  }

  protected _renderCellContent($cell, options) {
    renderSummaryCell($cell, options, this.setAria.bind(this));
    // @ts-expect-error
    super._renderCellContent.apply(this, arguments);
  }

  protected _renderCore(change) {
    let needUpdateScrollLeft = false;
    // @ts-expect-error
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
      needUpdateScrollLeft && this.updateScrollLeftPosition();
    }

    return super._renderCore(change);
  }

  protected _updateContent($newTable, change) {
    if (change && change.changeType === 'update' && change.columnIndices) {
      return this.waitAsyncTemplates().done(() => {
        const $row = this.getTableElement()!.find('.dx-row');
        const $newRow = $newTable.find('.dx-row');

        this._updateCells($row, $newRow, change.columnIndices[0]);
      });
    }

    // @ts-expect-error
    return super._updateContent.apply(this, arguments);
  }

  protected _rowClick(e?) {
    // @ts-expect-error
    const item = this._dataController.footerItems()[e.rowIndex] || {};
    this.executeAction('onRowClick', extend({}, e, item));
  }

  protected _columnOptionChanged(e) {
    const { optionNames } = e;

    if (e.changeTypes.grouping) return;

    if (optionNames.width || optionNames.visibleWidth) {
      super._columnOptionChanged(e);
    }
  }

  protected _handleDataChanged(e) {
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
  }

  protected _createRow(row) {
    // @ts-expect-error
    const $row = super._createRow.apply(this, arguments);

    if (row.rowType === DATAGRID_TOTAL_FOOTER_ROW_TYPE) {
      $row.addClass(DATAGRID_FOOTER_ROW_CLASS);
      $row.addClass(DATAGRID_CELL_DISABLED);
      $row.attr('tabindex', 0);
    }

    return $row;
  }

  private getHeight() {
    return this.getElementHeight();
  }

  public isVisible() {
    // @ts-expect-error
    return !!this._dataController.footerItems().length;
  }
}

export const dataSourceAdapterExtender = (Base: ModuleType<DataSourceAdapter>) => class SummaryDataSourceAdapterExtender extends Base implements EditingControllerRequired {
  private _totalAggregates: any;

  private _summaryGetter: any;

  public _editingController!: EditingController;

  public init() {
    super.init.apply(this, arguments as any);

    this._editingController = this.getController('editing');
    this._totalAggregates = [];
    this._summaryGetter = noop;
  }

  private summaryGetter(summaryGetter?) {
    if (!arguments.length) {
      return this._summaryGetter;
    }

    if (isFunction(summaryGetter)) {
      this._summaryGetter = summaryGetter;
    }
  }

  private summary(summary?) {
    if (!arguments.length) {
      return this._summaryGetter();
    }

    this._summaryGetter = function () { return summary; };
  }

  private totalAggregates() {
    return this._totalAggregates;
  }

  private isLastLevelGroupItemsPagingLocal() {
    const summary = this.summary();
    const sortByGroupsInfo = summary?.sortByGroups();

    return sortByGroupsInfo?.length;
  }

  private sortLastLevelGroupItems(items, groups, paths) {
    // @ts-expect-error
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
  }

  protected _customizeRemoteOperations(options) {
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
    super._customizeRemoteOperations.apply(this, arguments as any);

    const cachedExtra = options.cachedData.extra;

    if (cachedExtra?.summary && !options.isCustomLoading) {
      options.storeLoadOptions.totalSummary = undefined;
    }
  }

  protected customizeLoadResultHandlerCore(options) {
    const groups = normalizeSortingInfo(options.storeLoadOptions.group || options.loadOptions.group || []);
    const remoteOperations = options.remoteOperations || {};
    const summary = this.summaryGetter()(remoteOperations);

    if (!options.isCustomLoading || options.storeLoadOptions.isLoadingAll) {
      if (remoteOperations.summary) {
        if (!remoteOperations.paging && groups.length && summary) {
          if (!remoteOperations.grouping) {
            calculateAggregates(this, { groupAggregates: summary.groupAggregates }, options.data, groups.length);
          }
          options.data = sortGroupsBySummary(options.data, groups, summary);
        }
      } else if (!remoteOperations.paging && summary) {
        const operationTypes = options.operationTypes || {};
        const hasOperations = Object.keys(operationTypes).some((type) => operationTypes[type]);
        if (!hasOperations || !options.cachedData?.extra?.summary || groups.length && summary.groupAggregates.length) {
          const totalAggregates = calculateAggregates(this, summary, options.data, groups.length);
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
      this._totalAggregates = options.extra && options.extra.summary || this._totalAggregates;
    }

    super.customizeLoadResultHandlerCore(options);
  }
};

export const summaryEditingControllerExtender = (
  Base: ModuleType<EditingController>,
): ModuleType<EditingController> => class SummaryEditingController extends Base {
  private _refreshSummary() {
    if (this.option('summary.recalculateWhileEditing') && !this.isSaving()) {
      this._dataController.refresh({
        load: true,
        changesOnly: true,
      });
    }
  }

  protected _addChange(params) {
    // @ts-expect-error
    const result = super._addChange.apply(this, arguments);

    if (params.type) {
      this._refreshSummary();
    }

    return result;
  }

  protected _removeChange() {
    // @ts-expect-error
    const result = super._removeChange.apply(this, arguments);

    this._refreshSummary();

    return result;
  }

  public cancelEditData() {
    // @ts-expect-error
    const result = super.cancelEditData.apply(this, arguments);

    this._refreshSummary();

    return result;
  }
};

export const summaryRowsViewExtender = (
  Base: ModuleType<RowsView>,
): ModuleType<RowsView> => class SummaryRowsViewExtender extends Base {
  protected _createRow(row) {
    // @ts-expect-error
    const $row = super._createRow.apply(this, arguments);

    row && $row.addClass(row.rowType === DATAGRID_GROUP_FOOTER_ROW_TYPE ? DATAGRID_GROUP_FOOTER_CLASS : '');
    return $row;
  }

  protected _renderCells($row, options) {
    // @ts-expect-error
    super._renderCells.apply(this, arguments);

    if (options.row.rowType === 'group' && options.row.summaryCells && options.row.summaryCells.length) {
      this._renderGroupSummaryCells($row, options);
    }
  }

  private _hasAlignByColumnSummaryItems(columnIndex, options): boolean {
    const column = options.columns[columnIndex];
    const isGrouped = isDefined(column.groupIndex);
    const isVirtual = column.command === 'virtual';
    const hasSummaryCells = !!options.row.summaryCells[columnIndex].length;
    return !isGrouped && (isVirtual || hasSummaryCells);
  }

  private _getAlignByColumnCellCount(groupCellColSpan, options) {
    let alignByColumnCellCount = 0;

    for (let i = 1; i < groupCellColSpan; i++) {
      const columnIndex = options.row.summaryCells.length - i;
      const hasAlignBySummary = this._hasAlignByColumnSummaryItems(columnIndex, options);
      if (hasAlignBySummary) {
        alignByColumnCellCount = i;
      }
    }

    return alignByColumnCellCount;
  }

  private _renderGroupSummaryCells($row, options) {
    const $groupCell = $row.children().last();
    const groupCellColSpan = Number($groupCell.attr('colSpan')) || 1;
    const alignByColumnCellCount = this._getAlignByColumnCellCount(groupCellColSpan, options);

    this._renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount);
  }

  private _renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount) {
    if (alignByColumnCellCount > 0) {
      $groupCell.attr('colSpan', groupCellColSpan - alignByColumnCellCount);

      for (let i = 0; i < alignByColumnCellCount; i++) {
        const columnIndex = options.columns.length - alignByColumnCellCount + i;

        this._renderCell($groupCell.parent(), extend({ column: options.columns[columnIndex], columnIndex: this._getSummaryCellIndex(columnIndex, options.columns) }, options));
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _getSummaryCellIndex(columnIndex, columns) {
    return columnIndex;
  }

  protected _getCellTemplate(options) {
    if (!options.column.command && !isDefined(options.column.groupIndex) && options.summaryItems && options.summaryItems.length) {
      return (cell, options) => renderSummaryCell(cell, options, this.setAria.bind(this));
    }
    return super._getCellTemplate(options);
  }

  protected _getCellOptions(options) {
    const that = this;
    const parameters = super._getCellOptions(options);

    if (options.row.summaryCells) {
      return extend(parameters, getSummaryCellOptions(that, options));
    }
    return parameters;
  }
};
