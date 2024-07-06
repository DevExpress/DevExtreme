import type { DataSourceLike } from '@js/data/data_source';
import type DataSource from '@js/data/data_source';
import type { Subscribable } from '@ts/core/reactive';
import {
  computed, effect, state,
} from '@ts/core/reactive';

import { OptionsController } from '../options_controller/options_controller';

export function normalizeDataSource(dataSourceLike: DataSourceLike<unknown, unknown> | null | undefined): DataSource<unknown, unknown> {
  throw new Error('not implemented');
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
  private readonly pageIndex = this.options.oneWay('paging.pageIndex');

  // @ts-expect-error
  private readonly pageSize = this.options.oneWay('paging.pageSize');

  private readonly _items = state<unknown[]>([]);

  public readonly items: Subscribable<unknown[]> = this._items;

  static dependencies = [OptionsController] as const;

  constructor(
    private readonly options: OptionsController,
  ) {
    effect(
      (dataSource) => {
        const changedCallback = (): void => {
          this._items.update(dataSource.items());
        };
        changedCallback();
        // @ts-expect-error
        dataSource.changed.add(changedCallback);
        // @ts-expect-error
        return (): void => dataSource.changed.remove(changedCallback);
      },
      [this.dataSource],
    );

    effect(
      (pageIndex, pageSize, dataSource) => {
        dataSource.pageIndex(pageIndex);
        dataSource.pageSize(pageSize);
        dataSource.load();
      },
      [this.pageIndex, this.pageSize, this.dataSource],
    );
  }
}
