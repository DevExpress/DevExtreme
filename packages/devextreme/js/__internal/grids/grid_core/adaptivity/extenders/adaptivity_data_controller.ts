import { isDefined } from '@js/core/utils/type';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { DataChange, ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { ModuleType, RowKey } from '@ts/grids/grid_core/m_types';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

import {
  ADAPTIVE_ROW_TYPE,
  COLLAPSE_ARIA_NAME,
  EXPAND_ARIA_NAME,
  LEGACY_SCROLLING_MODE,
} from '../const';
import type { AdaptiveColumnsController } from '../m_adaptivity';
import { getAdaptiveDetailRowIndex, resolveAdaptiveDetailRowTarget } from '../utils';

export const adaptivityDataControllerExtender = (
  Base: ModuleType<DataController>,
): ModuleType<DataController> => class AdaptivityDataControllerExtender extends Base {
  private adaptiveExpandedKey: RowKey | undefined;

  protected adaptiveColumnsController!: AdaptiveColumnsController;

  public init(): void {
    super.init();
    this.adaptiveExpandedKey = undefined;
    this.adaptiveColumnsController = this.getController('adaptiveColumns');
  }

  protected _processItems(items: RawItemData[], change: DataChange): ProcessedItem[] {
    const processedItems = super._processItems(items, change);
    const { changeType } = change;

    if ((changeType === 'loadingAll') || !isDefined(this.adaptiveExpandedKey)) {
      return processedItems;
    }

    const expandRowIndex = gridCoreUtils.getIndexByKey(this.adaptiveExpandedKey, processedItems);
    const newMode = this.option(LEGACY_SCROLLING_MODE) === false;

    if (expandRowIndex >= 0) {
      const item = processedItems[expandRowIndex];
      processedItems.splice(expandRowIndex + 1, 0, {
        visible: true,
        rowType: ADAPTIVE_ROW_TYPE,
        key: item.key,
        data: item.data,
        // @ts-expect-error treelist specific field
        node: item.node,
        modifiedValues: item.modifiedValues,
        isNewRow: item.isNewRow,
        values: item.values,
      });
    } else if (changeType === 'refresh' && !(newMode && change.repaintChangesOnly)) {
      this.adaptiveExpandedKey = undefined;
    }

    return processedItems;
  }

  protected getRowIndicesForExpand(key: RowKey): number[] {
    const rowIndices = super.getRowIndicesForExpand(key);

    if (this.adaptiveColumnsController.isAdaptiveDetailRowExpanded(key)) {
      const lastRowIndex = rowIndices[rowIndices.length - 1];

      rowIndices.push(lastRowIndex + 1);
    }

    return rowIndices;
  }

  public toggleExpandAdaptiveDetailRow(key?: RowKey, alwaysExpanded = false): void {
    const oldKey = this.adaptiveExpandedKey;
    const oldRowIndex = gridCoreUtils.getIndexByKey(oldKey, this._items);

    const target = resolveAdaptiveDetailRowTarget(
      key,
      gridCoreUtils.getIndexByKey(key, this._items),
      oldRowIndex,
      alwaysExpanded,
    );

    this.adaptiveExpandedKey = target.key;

    this.updateAdaptiveDetailRows(oldRowIndex, target.rowIndex);
    this.updateAdaptiveAriaLabels(target.key, oldKey);
  }

  private updateAdaptiveDetailRows(oldRowIndex: number, newRowIndex: number): void {
    const rowIndexDelta = this.getRowIndexDelta();

    this.updateItems({
      allowInvisibleRowIndices: true,
      changeType: 'update',
      rowIndices: [oldRowIndex, newRowIndex]
        .map((rowIndex) => getAdaptiveDetailRowIndex(rowIndex, rowIndexDelta)),
    });
  }

  private updateAdaptiveAriaLabels(
    expandedKey: RowKey | undefined,
    collapsedKey: RowKey | undefined,
  ): void {
    this.adaptiveColumnsController.updateCommandAdaptiveAriaLabel(expandedKey, COLLAPSE_ARIA_NAME);
    this.adaptiveColumnsController.updateCommandAdaptiveAriaLabel(collapsedKey, EXPAND_ARIA_NAME);
  }

  public getAdaptiveExpandedKey(): RowKey | undefined {
    return this.adaptiveExpandedKey;
  }

  public setAdaptiveExpandedKey(key: RowKey): void {
    this.adaptiveExpandedKey = key;
  }
};
