import { computed, state } from "@js/__internal/core/reactive"
import { OptionsController } from "../options_controller/options_controller"
import DataSource, { DataSourceLike } from "@js/data/data_source";


export function normalizeDataSource(dataSourceLike: DataSourceLike<unknown, unknown> | null | undefined): DataSource<unknown, unknown> {
  throw 'not implemented';
}

export class DataController {
  private dataSource = this.options.oneWay('dataSource');

  private dataSourceNormalized = computed(
    normalizeDataSource,
    [this.dataSource]
  )

  private paging = this.options.oneWay('paging')

  private pageIndex = computed(
    (paging) => {
      return paging?.pageIndex ?? 0
    },
    [this.paging]
  )

  private pageSize = computed(
    (paging) => {
      return paging?.pageSize ?? 0
    },
    [this.paging]
  )

  private dataSourceOptions = computed(
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
  ) {}
}