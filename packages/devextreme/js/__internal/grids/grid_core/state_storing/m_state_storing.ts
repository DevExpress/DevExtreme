/* eslint-disable max-classes-per-file */
// @ts-expect-error
import { equalByValue, getKeyHash } from '@js/core/utils/common';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';

import { ColumnsController } from '../columns_controller/m_columns_controller';
import { DataController } from '../data_controller/m_data_controller';
import { ModuleType } from '../m_types';
import { SelectionController } from '../selection/m_selection';
import { RowsView } from '../views/m_rows_view';
import { StateStoringController } from './m_state_storing_core';

const getDataState = (that) => {
  const pagerView = that.getView('pagerView');
  const dataController = that.getController('data');
  const state = {
    allowedPageSizes: pagerView ? pagerView.getPageSizes() : undefined,
    filterPanel: { filterEnabled: that.option('filterPanel.filterEnabled') },
    filterValue: that.option('filterValue'),
    focusedRowKey: that.option('focusedRowEnabled') ? that.option('focusedRowKey') : undefined,
  };

  return extend(state, dataController.getUserState());
};

// TODO move processLoadState to target modules (data, columns, pagerView)
const processLoadState = (that) => {
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

const DEFAULT_FILTER_VALUE = null;

const getFilterValue = (that, state) => {
  const filterSyncController = that.getController('filterSync');
  const columnsController = that.getController('columns');
  const hasFilterState = state.columns || state.filterValue !== undefined;

  if (filterSyncController) {
    if (hasFilterState) {
      return state.filterValue || filterSyncController.getFilterValueFromColumns(state.columns);
    }
    return that._initialFilterValue || filterSyncController.getFilterValueFromColumns(columnsController.getColumns());
  }

  return DEFAULT_FILTER_VALUE;
};

const rowsView = (Base: ModuleType<RowsView>) => class StateStoringRowsViewExtender extends Base {
  init() {
    const that = this;
    const dataController = that.getController('data');

    super.init();

    // @ts-expect-error
    dataController.stateLoaded.add(() => {
      if (dataController.isLoaded() && !dataController.getDataSource()) {
        that.setLoading(false);
        that.renderNoDataText();
        // @ts-expect-error
        const columnHeadersView = that.component.getView('columnHeadersView');
        columnHeadersView && columnHeadersView.render();
        that.component._fireContentReadyAction();
      }
    });
  }
};

const stateStoring = (Base: ModuleType<StateStoringController>) => class StateStoringExtender extends Base {
  private readonly _initialPageSize: any;

  init() {
    // @ts-expect-error
    super.init.apply(this, arguments);
    processLoadState(this);
  }

  isLoading() {
    // @ts-expect-error
    return this.callBase() || this.getController('data').isStateLoading();
  }

  state(state?) {
    // @ts-expect-error
    const result = super.state.apply(this, arguments);

    if (state !== undefined) {
      this.applyState(extend(true, {}, state));
    }

    return result;
  }

  updateState(state) {
    if (this.isEnabled()) {
      const oldState = this.state();
      const newState = extend({}, oldState, state);
      const oldStateHash = getKeyHash(oldState);
      const newStateHash = getKeyHash(newState);

      if (!equalByValue(oldStateHash, newStateHash)) {
        state = extend(true, {}, state);
        extend(this._state, state);

        this.save();
      }
    } else {
      extend(this._state, state);
    }
  }

  applyState(state) {
    const { allowedPageSizes } = state;
    const { searchText } = state;
    const { selectedRowKeys } = state;
    const { selectionFilter } = state;
    const exportController = this.getController('export');
    const columnsController = this.getController('columns');
    const dataController = this.getController('data');
    const scrollingMode = this.option('scrolling.mode');
    const isVirtualScrollingMode = scrollingMode === 'virtual' || scrollingMode === 'infinite';
    const showPageSizeSelector = this.option('pager.visible') === true && this.option('pager.showPageSizeSelector');
    const hasHeight = this.getView('rowsView')?.hasHeight();

    this.component.beginUpdate();

    if (columnsController) {
      columnsController.setUserState(state.columns);
    }

    if (exportController) {
      exportController.selectionOnly(state.exportSelectionOnly);
    }

    if (!this.option('selection.deferred')) {
      this.option('selectedRowKeys', selectedRowKeys || []);
    }

    // @ts-expect-error
    this.option('selectionFilter', selectionFilter);

    if (allowedPageSizes && this.option('pager.allowedPageSizes') === 'auto') {
      this.option('pager')!.allowedPageSizes = allowedPageSizes;
    }

    if (this.option('focusedRowEnabled')) {
      this.option('focusedRowIndex', -1);
      this.option('focusedRowKey', state.focusedRowKey || null);
    }

    this.component.endUpdate();

    this.option('searchPanel.text', searchText || '');

    this.option('filterValue', getFilterValue(this, state));

    this.option('filterPanel.filterEnabled', state.filterPanel ? state.filterPanel.filterEnabled : true);

    this.option('paging.pageIndex', (!isVirtualScrollingMode || hasHeight) && state.pageIndex || 0);
    this.option('paging.pageSize', (!isVirtualScrollingMode || showPageSizeSelector) && isDefined(state.pageSize) ? state.pageSize : this._initialPageSize);

    dataController && dataController.reset();
  }
};

const columns = (Base: ModuleType<ColumnsController>) => class StateStoringColumnsExtender extends Base {
  _shouldReturnVisibleColumns() {
    // @ts-expect-error
    const result = super._shouldReturnVisibleColumns.apply(this, arguments);
    // @ts-expect-error
    const stateStoringController = this.getController('stateStoring');

    return result && (!stateStoringController.isEnabled() || stateStoringController.isLoaded());
  }
};

const data = (Base: ModuleType<DataController>) => class StateStoringDataExtender extends Base {
  private _restoreStateTimeoutID: any;

  callbackNames() {
    return super.callbackNames().concat(['stateLoaded']);
  }

  _refreshDataSource() {
    // @ts-expect-error
    const stateStoringController = this.getController('stateStoring');

    if (stateStoringController.isEnabled() && !stateStoringController.isLoaded()) {
      clearTimeout(this._restoreStateTimeoutID);

      // @ts-expect-error
      const deferred = new Deferred();
      this._restoreStateTimeoutID = setTimeout(() => {
        stateStoringController.load().always(() => {
          this._restoreStateTimeoutID = null;
        }).done(() => {
          super._refreshDataSource();
          // @ts-expect-error
          this.stateLoaded.fire();
          deferred.resolve();
        }).fail((error) => {
          // @ts-expect-error
          this.stateLoaded.fire();
          this._handleLoadError(error || 'Unknown error');
          deferred.reject();
        });
      });
      return deferred.promise();
    } if (!this.isStateLoading()) {
      super._refreshDataSource();
    }
  }

  isLoading() {
    const that = this;
    // @ts-expect-error
    const stateStoringController = that.getController('stateStoring');

    return super.isLoading() || stateStoringController.isLoading();
  }

  isStateLoading() {
    return isDefined(this._restoreStateTimeoutID);
  }

  isLoaded() {
    return super.isLoaded() && !this.isStateLoading();
  }

  dispose() {
    clearTimeout(this._restoreStateTimeoutID);
    super.dispose();
  }
};

const selection = (Base: ModuleType<SelectionController>) => class StateStoringSelectionExtender extends Base {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _fireSelectionChanged(options) {
    // @ts-expect-error
    const stateStoringController = this.getController('stateStoring');
    const isDeferredSelection = this.option('selection.deferred');
    if (stateStoringController.isLoading() && isDeferredSelection) {
      return;
    }
    // @ts-expect-error
    super._fireSelectionChanged(this, arguments);
  }
};

export const stateStoringModule = {
  defaultOptions() {
    return {
      stateStoring: {
        enabled: false,
        storageKey: null,
        type: 'localStorage',
        customLoad: null,
        customSave: null,
        savingTimeout: 2000,
      },
    };
  },
  controllers: {
    stateStoring: StateStoringController,
  },
  extenders: {
    views: {
      rowsView,
    },
    controllers: {
      stateStoring,
      columns,
      data,
      selection,
    },
  },
};
