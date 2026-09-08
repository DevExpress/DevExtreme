import type { LangParams } from '@js/common/data';
import type { DataFilter } from '@ts/grids/grid_core/data_controller/types';
import modules from '@ts/grids/grid_core/m_modules';
import type { Controllers } from '@ts/grids/grid_core/m_types';

import type { FilterSourceContext } from './types';

export class FilterController extends modules.Controller {
  protected columnsController!: Controllers['columns'];

  protected dataSourceController!: Controllers['dataSource'];

  public init(): void {
    this.columnsController = this.getController('columns');
    this.dataSourceController = this.getController('dataSource');
  }

  protected getLangParams(): LangParams | undefined {
    return this.dataSourceController.getDataSource()?.loadOptions?.()?.langParams;
  }

  /**
   * @extended: filter_row, filter_sync, header_filter, search
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getAdditionalFilter(context: FilterSourceContext): DataFilter {
    return null;
  }
}
