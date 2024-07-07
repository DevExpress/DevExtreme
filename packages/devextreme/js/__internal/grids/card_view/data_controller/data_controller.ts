import type { DataSourceLike } from '@js/data/data_source';
import DataSource from '@js/data/data_source';
import { normalizeDataSourceOptions } from '@js/data/data_source/utils';
import type { Subscribable } from '@ts/core/reactive';
import {
  computed, effect, state,
} from '@ts/core/reactive';

import { OptionsController } from '../options_controller/options_controller';

export function normalizeDataSource(
  dataSourceLike: DataSourceLike<unknown, unknown> | null | undefined,
): DataSource<unknown, unknown> {
  if (dataSourceLike instanceof DataSource) {
    return dataSourceLike;
  }

  return new DataSource(normalizeDataSourceOptions(dataSourceLike));
}

export class DataController {
  private readonly dataSourceConfiguration = this.options.oneWay('dataSource');

  private readonly dataSource = computed(
    normalizeDataSource,
    [this.dataSourceConfiguration],
  );

  private readonly paging = computed(
    (paging) => paging ?? {},
    [this.options.oneWay('paging')],
  );

  // @ts-expect-error
  public readonly pageIndex = this.options.twoWay('paging.pageIndex');

  // @ts-expect-error
  public readonly pageSize = this.options.twoWay('paging.pageSize');

  private readonly _items = state<unknown[]>([]);

  public readonly items: Subscribable<unknown[]> = this._items;

  private readonly _totalCount = state<number>(0);

  public readonly totalCount: Subscribable<number> = this._totalCount;

  public readonly pageCount = computed(
    (totalCount, pageSize) => Math.ceil(totalCount / pageSize),
    [this.totalCount, this.pageSize],
  );

  static dependencies = [OptionsController] as const;

  constructor(
    private readonly options: OptionsController,
  ) {
    effect(
      (dataSource) => {
        const changedCallback = (): void => {
          this._items.update(dataSource.items());
          this._totalCount.update(dataSource.totalCount());
        };
        changedCallback();
        dataSource.on('changed', changedCallback);
        return () => dataSource.off('changed', changedCallback);
      },
      [this.dataSource],
    );

    effect(
      (pageIndex, pageSize, dataSource) => {
        dataSource.pageIndex(pageIndex);
        dataSource.requireTotalCount(true);
        dataSource.pageSize(pageSize);
        dataSource.load();
      },
      [this.pageIndex, this.pageSize, this.dataSource],
    );
  }
}
