import { Subscribable, computed, state } from "@js/__internal/core/reactive"
import { OptionsController } from "../options_controller/options_controller"
import DataSource, { DataSourceLike } from "@js/data/data_source";


export function normalizeDataSource(dataSourceLike: DataSourceLike<unknown, unknown> | null | undefined): DataSource<unknown, unknown> {
  throw 'not implemented';
}

export class DataController {
  private dataSourceConfiguration = this.options.oneWay('dataSource');

  private dataSource = computed(
    normalizeDataSource,
    [this.dataSourceConfiguration]
  )

  private paging = computed(
    (paging) => paging ?? {},
    [this.options.oneWay('paging')]
  )

  private pageIndex = this.options.oneWay('paging.pageIndex')

  private pageSize = this.options.oneWay('paging.pageSize')

  private loadOptions = computed(
    (pageIndex, pageSize) => ({
      pageIndex,
      pageSize
    }),
    [this.pageIndex, this.pageSize]
  )

  public items = state([])
  
  static dependencies = [OptionsController] as const

  constructor(
    private options: OptionsController,
  ) {
    computed(
      (loadOptions, dataSource) => {
        dataSource
      },
      [this.loadOptions, this.dataSource]
    );
  }
}