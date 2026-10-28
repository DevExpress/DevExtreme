/* eslint-disable max-classes-per-file */
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { DataChange } from '@ts/grids/grid_core/data_controller/types';
import type { DataSourceController } from '@ts/grids/grid_core/data_source/data_source_controller';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/data_source_adapter';
import type { ModuleType, RowKey } from '@ts/grids/grid_core/types';
import gridCoreUtils from '@ts/grids/grid_core/utils';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';
import {
  dataSourceAdapterExtender as virtualScrollingDataSourceAdapterExtender,
  rowsView as virtualScrollingRowsViewExtender,
  virtualScrollingDataControllerExtender,
  type VirtualScrollingDataControllerExtension,
  type VirtualScrollingDataSourceAdapter,
  virtualScrollingModule,
  type VirtualScrollingRowsView,
} from '@ts/grids/grid_core/virtual_scrolling/index';

import gridCore from './core';
import dataSourceAdapterProvider from './data_source_adapter/data_source_adapter';

const oldDefaultOptions = virtualScrollingModule.defaultOptions;

virtualScrollingModule.extenders.views.rowsView = (
  Base: ModuleType<RowsView>,
): ModuleType<VirtualScrollingRowsView> => class TreeListVirtualScrollingRowsViewExtender
  extends virtualScrollingRowsViewExtender(Base) {
  protected _handleDataChanged(e: DataChange): void {
    const { operationTypes } = e;

    if (e?.isDataChanged && gridCoreUtils.isVirtualRowRendering(this) && operationTypes) {
      const { fullReload, pageIndex } = operationTypes;

      if (!fullReload && pageIndex) {
        this._updateContentPosition();
      }
    }

    super._handleDataChanged(e);
  }
};

virtualScrollingModule.extenders.controllers.data = (
  Base: ModuleType<DataController>,
): ModuleType<
  DataController & VirtualScrollingDataControllerExtension
> => class TreeListVirtualScrollingDataControllerExtender
  extends virtualScrollingDataControllerExtender(Base) {
  protected declare dataSourceController: DataSourceController<VirtualScrollingDataSourceAdapter>;

  protected _loadOnOptionChange(): void {
    const virtualScrollController = this.dataSourceController
      .getAdapter()?._virtualScrollController;

    virtualScrollController?.reset();
    // @ts-expect-error _loadOnOptionChange() is added by the TreeList data controller
    super._loadOnOptionChange();
  }
};

const dataSourceAdapterExtender = (
  Base: ModuleType<DataSourceAdapter>,
): ModuleType<VirtualScrollingDataSourceAdapter> => class VirtualScrollingDataSourceAdapterExtender
  extends virtualScrollingDataSourceAdapterExtender(Base) {
  public changeRowExpand(path: RowKey): DeferredObj<unknown> | undefined {
    return super.changeRowExpand(path)?.done(() => {
      const viewportItemIndex = this.getViewportItemIndex();

      if (viewportItemIndex >= 0) {
        this.setViewportItemIndex(viewportItemIndex);
      }
    });
  }
};

gridCore.registerModule('virtualScrolling', {
  ...virtualScrollingModule,
  defaultOptions() {
    return extend(true, oldDefaultOptions(), {
      scrolling: {
        mode: 'virtual',
      },
    });
  },
});

dataSourceAdapterProvider.extend(dataSourceAdapterExtender);
