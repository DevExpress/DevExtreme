import { equalByValue, getKeyHash } from '@js/core/utils/common';
import { isDefined } from '@js/core/utils/type';
import { extend } from '@ts/core/utils/m_extend';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { InternalGridOptions } from '@ts/grids/grid_core/m_types';

import type { StateStoringDataControllerExtension } from './extenders/state_storing_data_controller';
import { StateStoringController } from './m_state_storing_controller';
import type { GridState } from './types';

const getDataState = (that): GridState => {
  // TODO getView
  const pagerView = that.getView('pagerView');
  // TODO getController
  const dataController = that.getController('data');
  const state = {
    allowedPageSizes: pagerView ? pagerView.getPageSizes() : undefined,
    filterPanel: { filterEnabled: that.option('filterPanel.filterEnabled') },
    filterValue: that.option('filterValue'),
    focusedRowKey: that.option('focusedRowEnabled') ? that.option('focusedRowKey') : undefined,
  };

  return extend(state, dataController.getUserState()) as GridState;
};

// TODO move processLoadState to target modules (data, columns, pagerView)
const processLoadState = (that): void => {
  // TODO getController
  const columnsController = that.getController('columns');
  const selectionController = that.getController('selection');
  const exportController = that.getController('export');
  const dataController = that.getController('data');

  if (columnsController) {
    columnsController.columnsChanged.add(() => {
      that.updateState({
        columns: columnsController.getUserState(),
      });
    });
  }

  if (selectionController) {
    selectionController.selectionChanged.add((e) => {
      that.updateState({
        selectedRowKeys: e.selectedRowKeys,
        selectionFilter: e.selectionFilter,
      });
    });
  }

  if (dataController) {
    that._initialPageSize = that.option('paging.pageSize');
    that._initialFilterValue = that.option('filterValue');

    dataController.changed.add(() => {
      const state = getDataState(that);

      that.updateState(state);
    });
  }

  if (exportController) {
    exportController.selectionOnlyChanged.add(() => {
      that.updateState({
        exportSelectionOnly: exportController.selectionOnly(),
      });
    });
  }
};

const getFilterValue = (that, state: GridState): InternalGridOptions['filterValue'] => {
  // TODO: getController
  const filterSyncController = that.getController('filterSync');
  if (!filterSyncController) {
    return null;
  }

  if (state.filterValue !== undefined) {
    return state.filterValue;
  }

  const filterValueFromColumns = filterSyncController.getFilterValueFromColumns?.(state.columns);
  if (filterValueFromColumns?.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return filterValueFromColumns;
  }

  const columns = that.getController('columns').getColumns();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return that._initialFilterValue ?? filterSyncController.getFilterValueFromColumns(columns);
};

export class GridStateStoringController extends StateStoringController<GridState> {
  private readonly _initialPageSize?: number;

  public init(): this {
    super.init();
    processLoadState(this);

    return this;
  }

  public isLoading(): boolean {
    const dataController = this.getController('data') as DataController & StateStoringDataControllerExtension;

    return super.isLoading() || dataController.isStateLoading();
  }

  protected state(): GridState;
  protected state(state: GridState | undefined): void;
  protected state(...args: [state?: GridState]): GridState | void {
    if (!args.length) {
      return super.state();
    }

    const [state] = args;
    super.state(state);

    if (state !== undefined) {
      this.applyState(extend(true, {}, state));
    }

    return undefined;
  }

  private updateState(state: GridState): void {
    if (this.isEnabled()) {
      const oldState = this.state();
      const newState = {
        ...oldState,
        ...state,
      };
      const oldStateHash = getKeyHash(oldState);
      const newStateHash = getKeyHash(newState);

      if (!equalByValue(oldStateHash, newStateHash)) {
        // eslint-disable-next-line no-param-reassign
        state = extend(true, {}, state);
        extend(this._state, state);

        this.save();
      }
    } else {
      extend(this._state, state);
    }
  }

  /**
   * @extended: TreeList's state_storing
   */
  protected applyState(state: GridState): void {
    const { scrolling, pager } = this.option();

    const isVirtualScrollingMode = scrolling?.mode === 'virtual' || scrolling?.mode === 'infinite';
    const showPageSizeSelector = pager?.visible === true && !!pager.showPageSizeSelector;
    // TODO getView
    const hasHeight = this.getView('rowsView')?.hasHeight();
    const allowsPageIndexRestore = !isVirtualScrollingMode || hasHeight;
    const allowsPageSizeRestore = !isVirtualScrollingMode || showPageSizeSelector;
    const canRestorePageIndex = allowsPageIndexRestore && isDefined(state.pageIndex);
    const canRestorePageSize = allowsPageSizeRestore && isDefined(state.pageSize);

    this.component.beginUpdate();

    this.getColumnsController()?.setUserState(state.columns);
    this.getExportController()?.selectionOnly(state.exportSelectionOnly);

    if (!this.option('selection.deferred')) {
      this.option('selectedRowKeys', state.selectedRowKeys ?? []);
    }

    this.option('selectionFilter', state.selectionFilter);

    if (state.allowedPageSizes && pager?.allowedPageSizes === 'auto') {
      pager.allowedPageSizes = state.allowedPageSizes;
    }

    if (this.option('focusedRowEnabled')) {
      this.option('focusedRowIndex', -1);
      this.option('focusedRowKey', state.focusedRowKey ?? null);
    }

    this.component.endUpdate();

    this.option('searchPanel.text', state.searchText ?? '');

    this.option('filterValue', getFilterValue(this, state));
    this.option('filterPanel.filterEnabled', state.filterPanel ? state.filterPanel.filterEnabled : true);

    this.option('paging.pageIndex', canRestorePageIndex ? state.pageIndex : 0);
    this.option('paging.pageSize', canRestorePageSize ? state.pageSize : this._initialPageSize);

    this.getDataController()?.reset();
  }
}
