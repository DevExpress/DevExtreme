import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { ResizingController } from '@ts/grids/grid_core/grid_view/grid_view';
import type { ModuleType } from '@ts/grids/grid_core/types';
import type { ColumnWidth } from '@ts/grids/grid_core/views/types';

import { COLUMN_VIEWS } from '../const';

export const adaptivityResizingViewControllerExtender = (
  Base: ModuleType<ResizingController>,
): ModuleType<ResizingController> => class AdaptivityResizingViewControllerExtender extends Base {
  private isHiddenColumnsChanged(
    oldHiddenColumns: Column[],
    hiddenColumns: Column[],
  ): boolean {
    if (oldHiddenColumns.length !== hiddenColumns.length) {
      return true;
    }

    const oldIndices = new Set(oldHiddenColumns.map((col) => col.index));

    return hiddenColumns.some((col) => !oldIndices.has(col.index));
  }

  private updateColumnViewsFirstCellClasses(): void {
    COLUMN_VIEWS.forEach((viewName) => {
      const view = this.getView(viewName);

      if (view?.isVisible()) {
        view.updateFirstCellClasses();
      }
    });
  }

  protected _needBestFit(): boolean {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return super._needBestFit() || !!this.adaptiveColumnsController.getHidingColumnsQueue().length;
  }

  protected _correctColumnWidths(resultWidths: ColumnWidth[], visibleColumns: Column[]): boolean {
    const adaptiveController = this.adaptiveColumnsController;
    const oldHiddenColumns = adaptiveController.getHiddenColumns();
    const hidingColumnsQueue = adaptiveController.updateHidingQueue(
      this._columnsController.getColumns(),
    );

    adaptiveController.hideRedundantColumns(resultWidths, visibleColumns, hidingColumnsQueue);
    const hiddenColumns = adaptiveController.getHiddenColumns();
    const isHiddenColumnsChanged = this.isHiddenColumnsChanged(oldHiddenColumns, hiddenColumns);

    if (isHiddenColumnsChanged && adaptiveController.hasAdaptiveDetailRowExpanded()) {
      adaptiveController.updateForm(hiddenColumns);
    }

    if (isHiddenColumnsChanged) {
      this.updateColumnViewsFirstCellClasses();
    }

    if (!hiddenColumns.length) {
      adaptiveController.collapseAdaptiveDetailRow();
    }

    return super._correctColumnWidths(resultWidths, visibleColumns);
  }

  protected _toggleBestFitMode(isBestFit: boolean): void {
    this.adaptiveColumnsController._toggleGroupAdaptiveRowVisibility(isBestFit);
    if (isBestFit) {
      this.adaptiveColumnsController._showHiddenColumns();
    }
    super._toggleBestFitMode(isBestFit);
  }

  protected _needStretch(): boolean {
    return super._needStretch()
      || this.adaptiveColumnsController.getHidingColumnsQueue().length > 0
      || this.adaptiveColumnsController.hasHiddenColumns();
  }
};
