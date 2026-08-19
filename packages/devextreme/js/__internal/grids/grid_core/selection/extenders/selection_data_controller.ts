import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { isObject } from '@js/core/utils/type';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type {
  DataChange, GeneratedItem, ItemProcessingOptions, ProcessedItem, RefreshOptions,
} from '@ts/grids/grid_core/data_controller/types';
import type { ChangedEvent } from '@ts/grids/grid_core/data_source_adapter/types';
import type { ModuleType } from '@ts/grids/grid_core/m_types';
import type { SelectionController } from '@ts/grids/grid_core/selection/m_selection';
import type { SelectionFilter } from '@ts/ui/selection/types';

export const selectionDataControllerExtender = (
  Base: ModuleType<DataController>,
): ModuleType<DataController> => class SelectionDataControllerExtender extends Base {
  private _selectionController!: SelectionController;

  public init(): void {
    this._selectionController = this.getController('selection');

    super.init();

    const isDeferredMode = this.option('selection.deferred');
    if (isDeferredMode) {
      this._selectionController._updateCheckboxesState({
        selectionFilter: this.option('selectionFilter') as SelectionFilter | undefined,
      });
    }
  }

  protected _loadDataSource(): DeferredObj<unknown> {
    return super._loadDataSource().always(() => {
      this._selectionController.refresh();
    });
  }

  protected _processDataItem(
    generatedItem: GeneratedItem,
    options: ItemProcessingOptions,
  ): ProcessedItem {
    const processedItem = super._processDataItem(generatedItem, options);
    const hasSelectColumn = this._selectionController.isSelectColumnVisible();
    options.isDeferredSelection ??= this.option('selection.deferred');

    processedItem.isSelected = this._selectionController.isRowSelected(
      options.isDeferredSelection ? processedItem.data : processedItem.key,
    );

    if (hasSelectColumn && processedItem.values) {
      for (let i = 0; i < options.visibleColumns.length; i += 1) {
        if (options.visibleColumns[i].command === 'select') {
          processedItem.values[i] = processedItem.isSelected;
          break;
        }
      }
    }

    return processedItem;
  }

  public refresh(options?: boolean | RefreshOptions): DeferredObj<unknown> {
    const skipSelectionRefresh = isObject(options) && !options.selection;

    if (skipSelectionRefresh) {
      return super.refresh(options);
    }

    const d = Deferred();

    super.refresh(options).done(() => {
      this._selectionController.refresh().done(d.resolve as (...args: unknown[]) => void)
        .fail(d.reject as (...args: unknown[]) => void);
    }).fail(d.reject as (...args: unknown[]) => void);

    // @ts-expect-error
    return d.promise();
  }

  protected dataChangedHandler(e?: ChangedEvent): void {
    const hasLoadOperation = this.hasLoadOperation();
    super.dataChangedHandler(e);

    if (hasLoadOperation && !this._repaintChangesOnly) {
      this._selectionController.focusedItemIndex(-1);
    }
  }

  protected _applyChange(change: DataChange): void {
    if (change?.changeType === 'updateSelection') {
      change.items?.forEach((item, index) => {
        const currentItem = this._items[index];
        if (currentItem) {
          currentItem.isSelected = item.isSelected;
          currentItem.values = item.values;
        }
      });
      return;
    }

    super._applyChange(change);
  }

  protected _endUpdateCore(): void {
    const changes = this._changes;
    const isUpdateSelection = changes.length > 1 && changes.every((change) => change.changeType === 'updateSelection');

    if (isUpdateSelection) {
      const itemIndexes = changes
        .map((change): number[] => ('itemIndexes' in change ? change.itemIndexes : []))
        .reduce((a, b) => a.concat(b));
      this._changes = [{ changeType: 'updateSelection', itemIndexes }];
    }

    super._endUpdateCore();
  }
};
