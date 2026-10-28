/* eslint-disable max-classes-per-file */
import dataQuery from '@js/common/data/query';
import storeHelper from '@js/common/data/store_helper';
import { normalizeSortingInfo } from '@js/common/data/utils';
import type { DxElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDefined, isPlainObject } from '@js/core/utils/type';
import type { GroupData, SummaryTexts } from '@js/ui/data_grid';
import type { DataSource } from '@ts/data/data_source/data_source';
import type { SortingInfo } from '@ts/data/utils';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/columns_controller';
import type { Column, ColumnsChanges, ColumnTemplateSource } from '@ts/grids/grid_core/columns_controller/types';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { DataChange, ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/data_source_adapter';
import type {
  LoadOperation,
  OperationTypes, RawItemData, RemoteOperationsOptions,
} from '@ts/grids/grid_core/data_source_adapter/types';
import type { EditingChange, EditingChangeParams } from '@ts/grids/grid_core/editing/types';
import type { ModuleType, SummaryTextItem } from '@ts/grids/grid_core/types';
import { ColumnsView } from '@ts/grids/grid_core/views/columns_view';
import { CLASSES as VIEW_CLASSES } from '@ts/grids/grid_core/views/const';
import type {
  CellRenderOptions,
  RowRenderOptions,
  SummaryRowsViewExtension,
  ViewCellOptions,
  ViewDataChange,
  ViewRow,
  ViewRowEvent,
} from '@ts/grids/grid_core/views/types';

import type { EditingController } from '../../grid_core/editing/editing';
import type { RowsView } from '../../grid_core/views/rows_view';
import AggregateCalculator from '../aggregate_calculator';
import gridCore from '../core';
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
import type {
  Aggregate,
  EditingControllerRequired,
  FooterItem,
  GroupSummaryRenderOptions,
  SortByGroups,
  SummaryCellItem,
  SummaryCellOptions,
  SummaryDataControllerExtension,
  SummaryDataSourceAdapterExtension,
  SummaryOptions,
} from './types';
import { getSummaryOptions } from './utils/get_summary_options';

export type SummaryDataSourceAdapter = InstanceType<
  ReturnType<typeof summaryDataSourceAdapterExtender>
>;

export const renderSummaryCell = (
  $cell: dxElementWrapper,
  options: ViewCellOptions,
  summaryTexts: SummaryTexts,
  setAria: ColumnsView['setAria'],
): void => {
  const { column, summaryItems } = options;
  const $summaryItems: dxElementWrapper[] = [];

  if (!column.command && summaryItems) {
    // @ts-expect-error summaryItems is typed as unknown[] in ViewCellOptions
    const summaryCellItems: (SummaryCellItem & SummaryTextItem)[] = summaryItems;

    for (const summaryItem of summaryCellItems) {
      const text = gridCore.getSummaryText(summaryItem, summaryTexts);
      const $summaryItemElement = $('<div>')
        // @ts-expect-error css() is typed without undefined
        .css('textAlign', summaryItem.alignment || column.alignment)
        .addClass(DATAGRID_SUMMARY_ITEM_CLASS)
        .addClass(DATAGRID_TEXT_CONTENT_CLASS)
        .addClass(summaryItem.cssClass ?? '')
        .toggleClass(DATAGRID_GROUP_TEXT_CONTENT_CLASS, options.rowType === 'group')
        .text(text);

      setAria('label', `${column.caption ?? ''} ${text ?? ''}`, $summaryItemElement);
      $summaryItems.push($summaryItemElement);
    }
    $cell.append($summaryItems);
  }
};

const getSummaryCellOptions = (
  options: CellRenderOptions,
): SummaryCellOptions => ({
  totalItem: options.row,
  // @ts-expect-error summaryCells is set for rows that render summary cells
  summaryItems: options.row.summaryCells[options.columnIndex],
});

const forEachGroup = (
  groups: GroupData<RawItemData>[],
  groupCount: number,
  callback: (path: unknown[], items: GroupData<RawItemData>['items']) => void,
  path: unknown[] = [],
): void => {
  for (const group of groups) {
    path.push(group.key);
    if (groupCount === 1) {
      callback(path, group.items);
    } else {
      // @ts-expect-error groups above the last group level hold groups
      forEachGroup(group.items, groupCount - 1, callback, path);
    }
    path.pop();
  }
};

const applyAddedData = (
  data: RawItemData[],
  insertedData: RawItemData[],
  groupLevel?: number,
): RawItemData[] => {
  if (groupLevel) {
    const mappedInsertedData = insertedData.map((item) => ({ items: [item] }));
    return applyAddedData(data, mappedInsertedData, groupLevel - 1);
  }

  return data.concat(insertedData);
};

const applyRemovedData = (
  data: RawItemData[],
  removedData: (RawItemData | undefined)[],
  groupLevel: number,
): RawItemData[] => {
  if (groupLevel) {
    return data.map((group) => {
      const updatedData = {};
      // @ts-expect-error groups above the last group level hold groups
      const updatedItems = applyRemovedData(group.items ?? [], removedData, groupLevel - 1);

      Object.defineProperty(updatedData, 'aggregates', {
        get: () => group.aggregates,
        set: (value) => {
          group.aggregates = value;
        },
      });

      return extend(updatedData, group, { items: updatedItems });
    });
  }

  return data.filter((item) => !removedData.includes(item));
};

const sortGroupsBySummaryCore = (
  items: RawItemData[] | null | undefined,
  groups: SortingInfo[],
  sortByGroups: SortByGroups,
): RawItemData[] | null | undefined => {
  if (!items || !groups.length) return items;

  const group = groups[0];
  const sorts = sortByGroups[0];
  let sortedItems = items;

  if (group && sorts?.length) {
    let query = dataQuery(items);
    sorts.forEach((sortInfo, index) => {
      if (index === 0) {
        query = query.sortBy(sortInfo.selector, sortInfo.desc);
      } else {
        query = query.thenBy(sortInfo.selector, sortInfo.desc);
      }
    });
    query.enumerate().done((result) => {
      // @ts-expect-error enumerate() is typed as resolving with unknown
      sortedItems = result;
    });
  }

  const nextGroups = groups.slice(1);
  const nextSortByGroups = sortByGroups.slice(1);
  if (nextGroups.length && nextSortByGroups.length) {
    each(sortedItems, function sortGroupItems(this: RawItemData) {
      // @ts-expect-error groups above the last group level hold groups
      this.items = sortGroupsBySummaryCore(this.items, nextGroups, nextSortByGroups);
    });
  }

  return sortedItems;
};

const sortGroupsBySummary = (
  data: RawItemData[] | null | undefined,
  group: SortingInfo[],
  summary: SummaryOptions | undefined,
): RawItemData[] | null | undefined => {
  const sortByGroups = summary?.sortByGroups?.();

  if (sortByGroups?.length) {
    return sortGroupsBySummaryCore(data, group, sortByGroups);
  }
  return data;
};

export class FooterView extends ColumnsView {
  protected declare _dataController: DataController & SummaryDataControllerExtension;

  public _getRows(): FooterItem[] {
    return this._dataController.footerItems();
  }

  protected _getCellOptions(options: CellRenderOptions): ViewCellOptions {
    return extend(super._getCellOptions(options), getSummaryCellOptions(options));
  }

  protected _renderCellContent(
    $cell: dxElementWrapper,
    options: ViewCellOptions,
    renderOptions: CellRenderOptions,
  ): void {
    renderSummaryCell($cell, options, this.option('summary.texts') ?? {}, this.setAria.bind(this));
    super._renderCellContent($cell, options, renderOptions);
  }

  protected _renderCore(change?: ViewDataChange): DeferredObj<unknown> {
    let needUpdateScrollLeft = false;
    const totalItem = this._dataController.footerItems()[0];

    if (!change?.columnIndices) {
      // @ts-expect-error the view is rendered here
      this.element()
        .empty()
        .addClass(DATAGRID_TOTAL_FOOTER_CLASS)
        .toggleClass(DATAGRID_NOWRAP_CLASS, !this.option('wordWrapEnabled'));

      needUpdateScrollLeft = true;
    }

    if (totalItem?.summaryCells?.length) {
      this._updateContent(this._renderTable({ change }), change);
      if (needUpdateScrollLeft) {
        this.updateScrollLeftPosition();
      }
    }

    return super._renderCore(change);
  }

  protected _updateContent(
    $newTable: dxElementWrapper,
    change?: ViewDataChange,
    isFixedTableRendering?: boolean,
  ): DeferredObj<unknown> {
    if (change?.changeType === 'update' && change.columnIndices) {
      return this.waitAsyncTemplates().done(() => {
        // @ts-expect-error the view is rendered here
        const $row = this.getTableElement().find(`.${VIEW_CLASSES.row}`);
        const $newRow = $newTable.find(`.${VIEW_CLASSES.row}`);

        // @ts-expect-error the footer has one row, so columnIndices[0] is set
        this._updateCells($row, $newRow, change.columnIndices[0]);
      });
    }

    return super._updateContent($newTable, change, isFixedTableRendering);
  }

  protected _rowClick(e: ViewRowEvent): void {
    const item = this._dataController.footerItems()[e.rowIndex] ?? {};
    this.executeAction('onRowClick', extend({}, e, item));
  }

  protected _columnOptionChanged(e: ColumnsChanges): void {
    const { optionNames } = e;

    if (e.changeTypes.grouping) return;

    if (optionNames.width || optionNames.visibleWidth) {
      super._columnOptionChanged(e);
    }
  }

  protected _handleDataChanged(e: DataChange): void {
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

  protected _createRow(row: ViewRow, tagName?: string): dxElementWrapper {
    const $row = super._createRow(row, tagName);

    if (row.rowType === DATAGRID_TOTAL_FOOTER_ROW_TYPE) {
      $row.addClass(DATAGRID_FOOTER_ROW_CLASS);
      $row.addClass(DATAGRID_CELL_DISABLED);
      $row.attr('tabindex', 0);
    }

    return $row;
  }

  private getHeight(): number {
    return this.getElementHeight();
  }

  public isVisible(): boolean {
    return !!this._dataController.footerItems().length;
  }
}

export const summaryDataSourceAdapterExtender = (
  Base: ModuleType<DataSourceAdapter>,
): ModuleType<
  DataSourceAdapter & SummaryDataSourceAdapterExtension
> => class SummaryDataSourceAdapterExtender
  extends Base
  implements EditingControllerRequired {
  private _totalAggregates!: unknown[];

  private columnsController!: ColumnsController;

  public editingController!: EditingController;

  public init(dataSource?: DataSource): void {
    super.init(dataSource);

    this.columnsController = this.getController('columns');
    this.editingController = this.getController('editing');
    this._totalAggregates = [];
  }

  private getSummary(remoteOperations?: RemoteOperationsOptions): SummaryOptions | undefined {
    const summary = this.option('summary');

    if (!summary) {
      return undefined;
    }

    const result = getSummaryOptions({
      summary,
      sortByGroupSummaryInfo: this.option('sortByGroupSummaryInfo'),
      remoteOperations: remoteOperations ?? this.remoteOperations(),
      getUpdatedItemData: (data) => this.editingController.getUpdatedData(data),
      columnOption: (id) => this.columnsController.columnOption(id),
      groupColumns: this.columnsController.getGroupColumns(),
      // @ts-expect-error InternalGrid is not typed as dxDataGrid
      component: this.component,
    });

    return result;
  }

  public totalAggregates(): unknown[] {
    return this._totalAggregates;
  }

  public isLastLevelGroupItemsPagingLocal(): number | undefined {
    const summary = this.getSummary();
    const sortByGroupsInfo = summary?.sortByGroups();

    return sortByGroupsInfo?.length;
  }

  public sortLastLevelGroupItems(
    items: RawItemData[],
    groups: SortingInfo[],
    paths: unknown[][],
  ): unknown[] {
    const groupedItems = storeHelper.multiLevelGroup(dataQuery(items), groups).toArray();
    let result: unknown[] = [];

    paths.forEach((path) => {
      // @ts-expect-error multiLevelGroup is typed as returning unknown[]
      forEachGroup(groupedItems, groups.length, (itemsPath, groupItems) => {
        if (path.toString() === itemsPath.toString()) {
          result = result.concat(groupItems);
        }
      });
    });

    return result;
  }

  protected _customizeRemoteOperations(
    options: LoadOperation,
    operationTypes: OperationTypes,
  ): void {
    const summary = this.getSummary();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- set before load
    const remoteOperations = options.remoteOperations!;

    if (summary && remoteOperations.summary) {
      if (!options.isCustomLoading || options.storeLoadOptions.isLoadingAll) {
        if (options.storeLoadOptions.group && remoteOperations.grouping) {
          options.storeLoadOptions.groupSummary = summary.groupAggregates;
        } else if (options.storeLoadOptions.group && summary.groupAggregates.length) {
          remoteOperations.paging = false;
        }
        options.storeLoadOptions.totalSummary = summary.totalAggregates;
      }
    } else if (
      summary
      && (
        summary.totalAggregates.length
        || (summary.groupAggregates.length && options.storeLoadOptions.group)
      )
    ) {
      remoteOperations.paging = false;
    }
    super._customizeRemoteOperations(options, operationTypes);

    // eslint-disable-next-line @stylistic/max-len
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- cachedData is set by the base method
    const cachedExtra = options.cachedData!.extra;

    if (cachedExtra?.summary && !options.isCustomLoading) {
      options.storeLoadOptions.totalSummary = undefined;
    }
  }

  private calculateTotalAggregates(
    data: RawItemData[] | GroupData<RawItemData>[],
    totalAggregates: Aggregate[],
    groupAggregates: Aggregate[],
    groupLevel: number,
  ): unknown[] {
    let dataWithEditingChanges = data;

    if (this.option('summary.recalculateWhileEditing')) {
      const insertedData = this.editingController.getInsertedData();
      if (insertedData.length) {
        dataWithEditingChanges = applyAddedData(dataWithEditingChanges, insertedData, groupLevel);
      }

      const removedData = this.editingController.getRemovedData();
      if (removedData.length) {
        dataWithEditingChanges = applyRemovedData(dataWithEditingChanges, removedData, groupLevel);
      }
    }

    const calculator = new AggregateCalculator({
      data: dataWithEditingChanges,
      totalAggregates,
      groupAggregates,
      groupLevel,
    });

    calculator.calculate();

    return calculator.totalAggregates();
  }

  protected customizeLoadResultHandlerCore(options): void {
    if (options.isCustomLoading && !options.storeLoadOptions.isLoadingAll) {
      super.customizeLoadResultHandlerCore(options);
      return;
    }

    const groups = normalizeSortingInfo(
      options.storeLoadOptions.group ?? options.loadOptions.group ?? [],
    );
    const remoteOperations = options.remoteOperations ?? {};
    const summary = this.getSummary(remoteOperations);

    if (remoteOperations.summary) {
      if (!remoteOperations.paging && groups.length && summary) {
        if (!remoteOperations.grouping) {
          this.calculateTotalAggregates(
            options.data,
            [],
            summary.groupAggregates,
            groups.length,
          );
        }

        options.data = sortGroupsBySummary(options.data, groups, summary);
      }
    } else if (!remoteOperations.paging && summary) {
      const operationTypes = options.operationTypes ?? {};
      const hasOperations = Object.keys(operationTypes).some((type) => operationTypes[type]);

      if (
        !hasOperations
        || !options.cachedData?.extra?.summary
        || (groups.length && summary.groupAggregates.length)
      ) {
        const totalAggregates = this.calculateTotalAggregates(
          options.data,
          summary.totalAggregates,
          summary.groupAggregates,
          groups.length,
        );
        options.extra = isPlainObject(options.extra) ? options.extra : {};
        options.extra.summary = totalAggregates;

        if (options.cachedData) {
          options.cachedData.extra = options.extra;
        }
      }
      options.data = sortGroupsBySummary(options.data, groups, summary);
    }

    if (!options.isCustomLoading) {
      this._totalAggregates = options.extra?.summary ?? this._totalAggregates;
    }

    super.customizeLoadResultHandlerCore(options);
  }
};

export const summaryEditingControllerExtender = (
  Base: ModuleType<EditingController>,
): ModuleType<EditingController> => class SummaryEditingController extends Base {
  private _refreshSummary(): void {
    if (this.option('summary.recalculateWhileEditing') && !this.isSaving()) {
      this._dataController.refresh({
        load: true,
        changesOnly: true,
      });
    }
  }

  protected _addChange(
    params: EditingChangeParams,
    options?: { row?: ProcessedItem; forceUpdateRow?: boolean },
  ): EditingChange {
    const result = super._addChange(params, options);

    if (params.type) {
      this._refreshSummary();
    }

    return result;
  }

  protected _removeChange(index: number): void {
    super._removeChange(index);

    this._refreshSummary();
  }

  public cancelEditData(): void {
    super.cancelEditData();

    this._refreshSummary();
  }
};

export const summaryRowsViewExtender = (
  Base: ModuleType<RowsView>,
): ModuleType<RowsView & SummaryRowsViewExtension> => class SummaryRowsViewExtender extends Base {
  protected _createRow(row?: ViewRow, tag?: string): dxElementWrapper {
    const $row = super._createRow(row, tag);

    if (row) {
      $row.addClass(row.rowType === DATAGRID_GROUP_FOOTER_ROW_TYPE ? DATAGRID_GROUP_FOOTER_CLASS : '');
    }
    return $row;
  }

  protected _renderCells($row: dxElementWrapper, options: RowRenderOptions): void {
    super._renderCells($row, options);

    if (options.row.rowType === 'group' && options.row.summaryCells?.length) {
      // @ts-expect-error summaryCells is set for rows that render summary cells
      this._renderGroupSummaryCells($row, options);
    }
  }

  private _hasAlignByColumnSummaryItems(
    columnIndex: number,
    options: GroupSummaryRenderOptions,
  ): boolean {
    const column = options.columns[columnIndex];
    const isGrouped = isDefined(column.groupIndex);
    const isVirtual = column.command === 'virtual';
    const hasSummaryCells = !!options.row.summaryCells[columnIndex].length;
    return !isGrouped && (isVirtual || hasSummaryCells);
  }

  private _getAlignByColumnCellCount(
    groupCellColSpan,
    options: GroupSummaryRenderOptions,
  ): number {
    let alignByColumnCellCount = 0;

    for (let i = 1; i < groupCellColSpan; i += 1) {
      const columnIndex = options.row.summaryCells.length - i;
      const hasAlignBySummary = this._hasAlignByColumnSummaryItems(columnIndex, options);
      if (hasAlignBySummary) {
        alignByColumnCellCount = i;
      }
    }

    return alignByColumnCellCount;
  }

  private _renderGroupSummaryCells(
    $row: dxElementWrapper,
    options: GroupSummaryRenderOptions,
  ): void {
    const $groupCell = $row.children().last();
    const groupCellColSpan = Number($groupCell.attr('colSpan')) || 1;
    const alignByColumnCellCount = this._getAlignByColumnCellCount(groupCellColSpan, options);

    this.renderGroupSummaryCellsCore(
      $groupCell,
      options,
      groupCellColSpan,
      alignByColumnCellCount,
    );
  }

  private renderGroupSummaryCellsCore(
    $groupCell: dxElementWrapper,
    options: GroupSummaryRenderOptions,
    groupCellColSpan: number,
    alignByColumnCellCount: number,
  ): void {
    if (alignByColumnCellCount > 0) {
      $groupCell.attr('colSpan', groupCellColSpan - alignByColumnCellCount);

      for (let i = 0; i < alignByColumnCellCount; i += 1) {
        const columnIndex = options.columns.length - alignByColumnCellCount + i;

        this._renderCell($groupCell.parent(), extend({
          column: options.columns[columnIndex],
          columnIndex: this._getSummaryCellIndex(columnIndex, options.columns),
        }, options));
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _getSummaryCellIndex(columnIndex: number, columns: Column[]): number {
    return columnIndex;
  }

  protected _getCellTemplate(
    options: ViewCellOptions,
  ): ColumnTemplateSource<ViewCellOptions> | undefined {
    if (
      !options.column.command
      && !isDefined(options.column.groupIndex)
      && options.summaryItems?.length
    ) {
      return (cell: DxElement, cellOptions: ViewCellOptions) => renderSummaryCell(
        $(cell),
        cellOptions,
        this.option('summary.texts') ?? {},
        this.setAria.bind(this),
      );
    }
    return super._getCellTemplate(options);
  }

  protected _getCellOptions(options: CellRenderOptions): ViewCellOptions {
    const parameters = super._getCellOptions(options);

    if (options.row.summaryCells) {
      return extend(parameters, getSummaryCellOptions(options));
    }
    return parameters;
  }
};
