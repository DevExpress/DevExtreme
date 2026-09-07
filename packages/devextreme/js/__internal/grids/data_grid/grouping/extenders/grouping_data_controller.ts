import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import type { Properties } from '@js/ui/data_grid';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { ItemProcessingOptions, ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type {
  ModuleType,
  OptionChanged,
  OptionChangedFor,
  RowKey,
} from '@ts/grids/grid_core/m_types';

import type { GroupingDataSourceAdapter } from '../m_grouping';
import type {
  ChangeRowExpandArgs, GroupItem, ProcessGroupItemsOptions,
} from '../types';
import {
  isGroupNode, isGroupRow, isSameContinuationState, isSameExpandedState,
} from '../utils';

export const groupingDataControllerExtender = (
  Base: ModuleType<DataController>,
): ModuleType<DataController> => class GroupingDataControllerExtender extends Base {
  public declare _dataSource?: GroupingDataSourceAdapter | null;

  public init(): void {
    super.init();

    this.createAction('onRowExpanding');
    this.createAction('onRowExpanded');
    this.createAction('onRowCollapsing');
    this.createAction('onRowCollapsed');
  }

  protected _beforeProcessItems(items: RawItemData[]): (RawItemData | GroupItem)[] {
    const baseItems = super._beforeProcessItems(items);

    const groupColumns = this._columnsController.getGroupColumns();

    if (!baseItems.length || !groupColumns.length) {
      return baseItems;
    }

    return this.processGroupItems(baseItems, groupColumns.length);
  }

  protected _processItem(
    dataItem: RawItemData | GroupItem,
    options: ItemProcessingOptions,
  ): ProcessedItem {
    if (isGroupRow(dataItem)) {
      const processedGroupItem = this.processGroupItem(dataItem, options);
      options.dataIndex = 0;
      return processedGroupItem;
    }

    return super._processItem(dataItem, options);
  }

  protected processGroupItem(
    groupItem: GroupItem,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options: ItemProcessingOptions,
  ): ProcessedItem {
    return groupItem;
  }

  private getDefaultProcessGroupItemsOptions(): ProcessGroupItemsOptions {
    const scrollingMode = this.option('scrolling.mode');

    return {
      collectContinuationItems: scrollingMode !== 'virtual' && scrollingMode !== 'infinite',
      resultItems: [],
      path: [],
      values: [],
    };
  }

  protected processGroupItems(
    items: RawItemData[] | null | undefined,
    groupsCount: number,
    parentOptions?: ProcessGroupItemsOptions,
  ): (RawItemData | GroupItem)[] {
    const groupedColumns = this._columnsController.getGroupColumns();
    const column = groupedColumns[groupedColumns.length - groupsCount];

    const options = parentOptions ?? this.getDefaultProcessGroupItemsOptions();
    const { resultItems } = options;

    if (options.data) {
      if (options.collectContinuationItems || !options.data.isContinuation) {
        resultItems.push({
          rowType: 'group',
          data: options.data,
          groupIndex: options.path.length - 1,
          isExpanded: !!options.data.items,
          key: options.path.slice(),
          values: options.values.slice(),
        });
      }
    }

    if (!items) {
      return resultItems;
    }

    if (groupsCount === 0) {
      resultItems.push(...items);

      return resultItems;
    }

    for (const item of items) {
      if (item && isGroupNode(item)) {
        options.data = item;
        options.path.push(item.key);
        options.values.push(
          column?.deserializeValue && !column.calculateDisplayValue
            ? column.deserializeValue(item.key)
            : item.key,
        );

        this.processGroupItems(item.items, groupsCount - 1, options);

        options.data = undefined;
        options.path.pop();
        options.values.pop();
      } else {
        resultItems.push(item);
      }
    }

    return resultItems;
  }

  protected isSameRowState(item1: ProcessedItem, item2: ProcessedItem): boolean {
    if (item1.rowType === 'group'
      && (!isSameExpandedState(item1, item2) || !isSameContinuationState(item1, item2))) {
      return false;
    }

    return super.isSameRowState(item1, item2);
  }

  public publicMethods(): string[] {
    const groupingPublicMethods = ['collapseAll', 'expandAll', 'isRowExpanded', 'expandRow', 'collapseRow'];

    return [...super.publicMethods(), ...groupingPublicMethods];
  }

  private collapseAll(groupIndex: number): void {
    const dataSource = this._dataSource;
    if (dataSource?.collapseAll(groupIndex)) {
      dataSource?.pageIndex(0);
      dataSource?.reload();
    }
  }

  private expandAll(groupIndex: number): void {
    const dataSource = this._dataSource;
    if (dataSource?.expandAll(groupIndex)) {
      dataSource?.pageIndex(0);
      dataSource?.reload();
    }
  }

  private changeRowExpand(key: RowKey): DeferredObj<unknown> {
    const expanded = this.isRowExpanded(key);
    const args: ChangeRowExpandArgs = {
      key,
      expanded,
    };

    this.executeAction(expanded ? 'onRowCollapsing' : 'onRowExpanding', args);

    if (!args.cancel) {
      return when(this.changeRowExpandCore(key)).done(() => {
        args.expanded = !expanded;
        this.executeAction(expanded ? 'onRowCollapsed' : 'onRowExpanded', args);
      });
    }

    return Deferred().resolve();
  }

  protected changeRowExpandCore(key: RowKey): DeferredObj<unknown> {
    const dataSource = this._dataSource;

    const d = Deferred();
    if (!dataSource) {
      d.resolve();
    } else {
      when(dataSource.changeRowExpand(key)).done(() => {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.load().done(d.resolve).fail(d.reject);
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
      }).fail(d.reject);
    }

    return d;
  }

  private isRowExpanded(key: RowKey): boolean {
    return !!this._dataSource?.isRowExpanded(key);
  }

  private expandRow(key: RowKey): DeferredObj<unknown> {
    if (!this.isRowExpanded(key)) {
      return this.changeRowExpand(key);
    }

    return Deferred().resolve();
  }

  private collapseRow(key: RowKey): DeferredObj<unknown> {
    if (this.isRowExpanded(key)) {
      return this.changeRowExpand(key);
    }

    return Deferred().resolve();
  }

  public optionChanged(e: OptionChanged | OptionChangedFor<Pick<Properties, 'grouping'>>): void {
    if (e.name === 'grouping') {
      e.handled = true;
      this.reset();
      return;
    }

    super.optionChanged(e);
  }
};
