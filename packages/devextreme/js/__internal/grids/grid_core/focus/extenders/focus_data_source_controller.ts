import { isDefined } from '@js/core/utils/type';
import type { StoreChange } from '@js/data/store';
import type { DataSourceController } from '@ts/grids/grid_core/data_source/data_source_controller';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

export interface FocusDataSourceControllerExtension {
  consumeDataPushed: () => boolean;
}

export const focusDataSourceControllerExtender = (
  Base: ModuleType<DataSourceController>,
): ModuleType<
  DataSourceController & FocusDataSourceControllerExtension
> => class FocusDataSourceControllerExtender extends Base {
  private isDataPushed = false;

  public consumeDataPushed(): boolean {
    const wasDataPushed = this.isDataPushed;

    this.isDataPushed = false;

    return wasDataPushed;
  }

  protected dataPushedHandler(changes: StoreChange[]): void {
    super.dataPushedHandler(changes);

    const focusedRowKey = this.option('focusedRowKey');

    this.isDataPushed = isDefined(focusedRowKey) && !!changes.length;
  }
};
