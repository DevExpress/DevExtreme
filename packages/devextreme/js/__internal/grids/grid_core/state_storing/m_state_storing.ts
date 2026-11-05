/* eslint-disable max-classes-per-file */
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { SelectionController } from '@ts/grids/grid_core/selection/m_selection';
import type { SelectionChangedOptions } from '@ts/grids/grid_core/selection/types';
import type { ModuleType } from '@ts/grids/grid_core/types';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';

import type { StateStoringDataControllerExtension } from './extenders/state_storing_data_controller';

export const rowsView = (
  Base: ModuleType<RowsView>,
): ModuleType<RowsView> => class StateStoringRowsViewExtender extends Base {
  protected _dataController!: DataController & StateStoringDataControllerExtension;

  public init(): void {
    super.init();

    this._dataController.stateLoaded.add(() => {
      if (this._dataController.isLoaded() && !this.dataSourceController.getDataSource()) {
        this.setLoading(false);
        this.renderNoDataText();
        // TODO getView
        const columnHeadersView = this.component.getView('columnHeadersView');

        columnHeadersView?.render();
        // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
        this.component._fireContentReadyAction();
      }
    });
  }
};

export const selection = (
  Base: ModuleType<SelectionController>,
): ModuleType<SelectionController> => class StateStoringSelectionExtender extends Base {
  protected _fireSelectionChanged(options?: SelectionChangedOptions): void {
    const isDeferredSelection = this.option('selection.deferred');
    if (this._stateStoringController.isLoading() && isDeferredSelection) {
      return;
    }
    super._fireSelectionChanged(options);
  }
};
