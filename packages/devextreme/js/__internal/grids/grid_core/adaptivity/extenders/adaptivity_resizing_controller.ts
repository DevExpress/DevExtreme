/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable prefer-rest-params */
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { ModuleType } from '@ts/grids/grid_core/m_types';
import type { ResizingController } from '@ts/grids/grid_core/views/m_grid_view';

import { COLUMN_VIEWS } from '../const';

export const adaptivityResizingControllerExtender = (
  Base: ModuleType<ResizingController>,
): ModuleType<ResizingController> => class AdaptivityResizingControllerExtender extends Base {
  public dispose() {
    super.dispose.apply(this, arguments as any);
    clearTimeout(this._updateScrollableTimeoutID);
  }

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

  protected _needBestFit() {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return super._needBestFit() || !!this.adaptiveColumnsController.getHidingColumnsQueue().length;
  }

  protected _correctColumnWidths(resultWidths: (number | string | undefined)[], visibleColumns: Column[]): boolean {
    const adaptiveController = this.adaptiveColumnsController;
    const oldHiddenColumns = adaptiveController.getHiddenColumns();
    const hidingColumnsQueue = adaptiveController.updateHidingQueue(this._columnsController.getColumns());

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

    return super._correctColumnWidths.apply(this, arguments as any);
  }

  protected _toggleBestFitMode(isBestFit) {
    this.adaptiveColumnsController._toggleGroupAdaptiveRowVisibility(isBestFit);
    isBestFit && this.adaptiveColumnsController._showHiddenColumns();
    super._toggleBestFitMode(isBestFit);
  }

  protected _needStretch() {
    const { adaptiveColumnsController } = this;
    return super._needStretch.apply(this, arguments as any) || adaptiveColumnsController.getHidingColumnsQueue().length || adaptiveColumnsController.hasHiddenColumns();
  }
};
