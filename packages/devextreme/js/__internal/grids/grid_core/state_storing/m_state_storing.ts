/* eslint-disable max-classes-per-file */
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { ModuleType } from '@ts/grids/grid_core/m_types';
import type { SelectionController } from '@ts/grids/grid_core/selection/m_selection';
import type { RowsView } from '@ts/grids/grid_core/views/m_rows_view';

import type { StateStoringDataControllerExtension } from './extenders/state_storing_data_controller';

export const rowsView = (Base: ModuleType<RowsView>) => class StateStoringRowsViewExtender extends Base {
  protected _dataController!: DataController & StateStoringDataControllerExtension;

  public init() {
    super.init();

    this._dataController.stateLoaded.add(() => {
      if (this._dataController.isLoaded() && !this._dataController.getDataSource()) {
        this.setLoading(false);
        this.renderNoDataText();
        // TODO getView
        const columnHeadersView = this.component.getView('columnHeadersView');
        columnHeadersView && columnHeadersView.render();
        this.component._fireContentReadyAction();
      }
    });
  }
};

export const selection = (Base: ModuleType<SelectionController>) => class StateStoringSelectionExtender extends Base {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _fireSelectionChanged(options) {
    const isDeferredSelection = this.option('selection.deferred');
    if (this._stateStoringController.isLoading() && isDeferredSelection) {
      return;
    }
    // @ts-expect-error
    super._fireSelectionChanged.apply(this, arguments);
  }
};
