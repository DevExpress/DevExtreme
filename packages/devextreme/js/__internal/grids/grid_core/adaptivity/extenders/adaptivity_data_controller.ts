/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-rest-params */
import { isDefined } from '@js/core/utils/type';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { DataChange, ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { ModuleType } from '@ts/grids/grid_core/m_types';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

import {
  ADAPTIVE_ROW_TYPE,
  COLLAPSE_ARIA_NAME,
  EXPAND_ARIA_NAME,
  LEGACY_SCROLLING_MODE,
} from '../const';
import type { AdaptiveColumnsController } from '../m_adaptivity';

export const adaptivityDataControllerExtender = (
  Base: ModuleType<DataController>,
): ModuleType<DataController> => class AdaptivityDataControllerExtender extends Base {
  private _adaptiveExpandedKey: any;

  protected adaptiveColumnsController!: AdaptiveColumnsController;

  public init() {
    super.init();
    this._adaptiveExpandedKey = undefined;
    this.adaptiveColumnsController = this.getController('adaptiveColumns');
  }

  protected _processItems(items: RawItemData[], change: DataChange): ProcessedItem[] {
    const processedItems = super._processItems(items, change);
    const { changeType } = change;

    if ((changeType === 'loadingAll') || !isDefined(this._adaptiveExpandedKey)) {
      return processedItems;
    }

    const expandRowIndex = gridCoreUtils.getIndexByKey(this._adaptiveExpandedKey, processedItems);
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
      this._adaptiveExpandedKey = undefined;
    }

    return processedItems;
  }

  private _getRowIndicesForExpand(key) {
    // @ts-expect-error
    const rowIndices = super._getRowIndicesForExpand.apply(this, arguments);

    if (this.adaptiveColumnsController.isAdaptiveDetailRowExpanded(key)) {
      const lastRowIndex = rowIndices[rowIndices.length - 1];
      rowIndices.push(lastRowIndex + 1);
    }

    return rowIndices;
  }

  private adaptiveExpandedKey(value) {
    if (isDefined(value)) {
      this._adaptiveExpandedKey = value;
    } else {
      return this._adaptiveExpandedKey;
    }
  }

  private toggleExpandAdaptiveDetailRow(key, alwaysExpanded) {
    const that = this;

    let oldExpandLoadedRowIndex = gridCoreUtils.getIndexByKey(that._adaptiveExpandedKey, that._items);
    let newExpandLoadedRowIndex = gridCoreUtils.getIndexByKey(key, that._items);

    if (oldExpandLoadedRowIndex >= 0 && oldExpandLoadedRowIndex === newExpandLoadedRowIndex && !alwaysExpanded) {
      key = undefined;
      newExpandLoadedRowIndex = -1;
    }

    const oldKey = that._adaptiveExpandedKey;
    that._adaptiveExpandedKey = key;

    if (oldExpandLoadedRowIndex >= 0) {
      oldExpandLoadedRowIndex++;
    }
    if (newExpandLoadedRowIndex >= 0) {
      newExpandLoadedRowIndex++;
    }

    const rowIndexDelta = that.getRowIndexDelta();

    that.updateItems({
      allowInvisibleRowIndices: true,
      changeType: 'update',
      rowIndices: [oldExpandLoadedRowIndex - rowIndexDelta, newExpandLoadedRowIndex - rowIndexDelta],
    });

    this.adaptiveColumnsController.updateCommandAdaptiveAriaLabel(key, COLLAPSE_ARIA_NAME);
    this.adaptiveColumnsController.updateCommandAdaptiveAriaLabel(oldKey, EXPAND_ARIA_NAME);
  }
};
