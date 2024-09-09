/* eslint-disable no-param-reassign */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { DataSourceLike } from '@js/data/data_source';
import DataSource from '@js/data/data_source';
import { normalizeDataSourceOptions } from '@js/data/data_source/utils';
import type { Subscribable } from '@ts/core/reactive';
import {
  computed, effect, state,
} from '@ts/core/reactive';

import { EditingController } from '../editing/controller';
import type { Change } from '../editing/types';
import { OptionsController } from '../options_controller/options_controller';

export function normalizeDataSource(
  dataSourceLike: DataSourceLike<unknown, unknown> | null | undefined,
  keyExpr: string | string[] | undefined,
): DataSource<unknown, unknown> {
  if (dataSourceLike instanceof DataSource) {
    return dataSourceLike;
  }

  if (Array.isArray(dataSourceLike)) {
    dataSourceLike = {
      store: {
        type: 'array',
        data: dataSourceLike,
        key: keyExpr,
      },
    };
  }

  // TODO: research making second param not required
  return new DataSource(normalizeDataSourceOptions(dataSourceLike, undefined));
}

export class DataController {
  private readonly dataSourceConfiguration = this.options.oneWay('dataSource');

  private readonly keyExpr = this.options.oneWay('keyExpr');

  private readonly dataSource = computed(
    (dataSourceLike, keyExpr) => normalizeDataSource(dataSourceLike, keyExpr),
    [this.dataSourceConfiguration, this.keyExpr],
  );

  public readonly pageIndex = this.options.twoWay('paging.pageIndex');

  public readonly pageSize = this.options.twoWay('paging.pageSize');

  private readonly _items = state<unknown[]>([]);

  public readonly items: Subscribable<unknown[]> = this._items;

  private readonly _totalCount = state(0);

  public readonly totalCount: Subscribable<number> = this._totalCount;

  private readonly _isLoading = state(false);

  public readonly isLoading: Subscribable<boolean> = this._isLoading;

  public readonly filter = state<any>(undefined);

  // public itemsWithChanges = computed(
  //   (items, changes: Change[] | undefined) => items.map((item) => (changes ?? []).filter(
  //     (change) => change.key === this.getDataKey(item),
  //   ).reduce((p, v) => ({
  //     // @ts-expect-error
  //     ...item, ...v.data,
  //   }), item)),
  //   [this.items, this.editing.changes],
  // );

  public readonly pageCount = computed(
    (totalCount, pageSize) => Math.ceil(totalCount / pageSize!),
    [this.totalCount, this.pageSize],
  );

  public static dependencies = [OptionsController] as const;

  constructor(
    private readonly options: OptionsController,
  ) {
    effect(
      (dataSource) => {
        const changedCallback = (): void => {
          this._items.update(dataSource.items());
          this._totalCount.update(dataSource.totalCount());
        };
        const loadingChangedCallback = (): void => {
          this._isLoading.update(dataSource.isLoading());
        };
        if (dataSource.isLoaded()) {
          changedCallback();
        }
        dataSource.on('changed', changedCallback);
        dataSource.on('loadingChanged', loadingChangedCallback);

        return (): void => {
          dataSource.off('changed', changedCallback);
          dataSource.off('loadingChanged', loadingChangedCallback);
        };
      },
      [this.dataSource],
    );

    effect(
      (pageIndex, pageSize, dataSource, filter) => {
        dataSource.pageIndex(pageIndex!);
        dataSource.requireTotalCount(true);
        dataSource.pageSize(pageSize!);
        dataSource.filter(filter);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        dataSource.load();
      },
      [this.pageIndex, this.pageSize, this.dataSource, this.filter],
    );
  }

  public getDataKey(data: unknown): unknown {
    return this.dataSource.unreactive_get().store().keyOf(data);
  }
}
