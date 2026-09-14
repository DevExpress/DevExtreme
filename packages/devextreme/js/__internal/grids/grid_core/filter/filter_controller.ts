import type { LangParams } from '@js/common/data';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { DataFilter } from '@ts/grids/grid_core/data_controller/types';
import modules from '@ts/grids/grid_core/m_modules';
import type { Controllers } from '@ts/grids/grid_core/m_types';

export class FilterController extends modules.Controller {
  protected columnsController!: Controllers['columns'];

  protected dataSourceController!: Controllers['dataSource'];

  public init(): void {
    this.columnsController = this.getController('columns');
    this.dataSourceController = this.getController('dataSource');
  }

  public isFilterSyncActive(): boolean | undefined {
    const filterSyncEnabled = this.option('filterSyncEnabled');

    return filterSyncEnabled === 'auto' ? this.option('filterPanel.visible') : filterSyncEnabled;
  }

  protected getLangParams(): LangParams | undefined {
    return this.dataSourceController.getDataSource()?.loadOptions?.()?.langParams;
  }

  /**
   * @extended: filter_row, filter_sync, header_filter, search
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getAdditionalFilter(excludedColumn?: Column | null): DataFilter {
    return null;
  }
}
