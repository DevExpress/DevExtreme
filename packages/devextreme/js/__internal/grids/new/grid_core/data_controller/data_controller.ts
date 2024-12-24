/* eslint-disable no-param-reassign */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { SubsGets } from '@ts/core/reactive/index';
import {
  computed, effect, state,
} from '@ts/core/reactive/index';

import gridCoreUtils from '../../../grid_core/m_utils';
// import { EditingController } from '../editing/controller';
// import type { Change } from '../editing/types';
import { OptionsController } from '../options_controller/options_controller';
import type { DataObject } from './types';
import { normalizeDataSource, updateItemsImmutable } from './utils';

export class DataController {
  private readonly dataSourceConfiguration = this.options.oneWay('dataSource');

  private readonly keyExpr = this.options.oneWay('keyExpr');

  public readonly dataSource = computed(
    (dataSourceLike, keyExpr) => normalizeDataSource(dataSourceLike, keyExpr),
    [this.dataSourceConfiguration, this.keyExpr],
  );

  public readonly cacheEnabled = this.options.oneWay('cacheEnabled');

  public readonly pagingEnabled = this.options.twoWay('paging.enabled');

  public readonly pageIndex = this.options.twoWay('paging.pageIndex');

  public readonly pageSize = this.options.twoWay('paging.pageSize');

  public readonly remoteFiltering = this.options.oneWay('remoteOperations.filtering');

  public readonly remotePaging = this.options.oneWay('remoteOperations.paging');

  public readonly remoteSorting = this.options.oneWay('remoteOperations.sorting');

  public readonly remoteSummary = this.options.oneWay('remoteOperations.summary');

  public readonly dateSerializationFormat = this.options.oneWay('dateSerializationFormat');

  public readonly onDataErrorOccurred = this.options.oneWay('onDataErrorOccurred');

  private readonly _items = state<DataObject[]>([]);

  public readonly items: SubsGets<DataObject[]> = this._items;

  private readonly _totalCount = state(0);

  public readonly totalCount: SubsGets<number> = this._totalCount;

  public readonly isLoading = state(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly filter = this.options.twoWay('filterValue');

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
    (totalCount, pageSize) => Math.ceil(totalCount / pageSize),
    [this.totalCount, this.pageSize],
  );

  public static dependencies = [OptionsController] as const;

  constructor(
    private readonly options: OptionsController,
  ) {
    effect(
      (dataSource) => {
        const changedCallback = (e?): void => {
          let items = dataSource.items() as DataObject[];

          if (e?.changes) {
            items = this._items.unreactive_get();
            items = updateItemsImmutable(items, e.changes, dataSource.store());
          }

          this._items.update(items);
          this.pageIndex.update(dataSource.pageIndex());
          this.pageSize.update(dataSource.pageSize());
          this._totalCount.update(dataSource.totalCount());
        };
        const loadingChangedCallback = (): void => {
          this.isLoading.update(dataSource.isLoading());
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
      (dataSource, pageIndex, pageSize, filter) => {
        let someParamChanged = false;
        if (dataSource.pageIndex() !== pageIndex) {
          dataSource.pageIndex(pageIndex);
          someParamChanged ||= true;
        }
        if (dataSource.pageSize() !== pageSize) {
          dataSource.pageSize(pageSize);
          someParamChanged ||= true;
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
        if (dataSource.requireTotalCount() !== true) {
          dataSource.requireTotalCount(true);
          someParamChanged ||= true;
        }
        if (dataSource.filter() !== filter) {
          dataSource.filter(filter);
          someParamChanged ||= true;
        }

        if (someParamChanged || !dataSource.isLoaded()) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          dataSource.load();
        }
      },
      [this.dataSource, this.pageIndex, this.pageSize, this.filter],
    );
  }

  public getDataKey(data: unknown): unknown {
    return this.dataSource.unreactive_get().store().keyOf(data);
  }

  public getCardIndexByKey(key: object): number {
    return gridCoreUtils.getIndexByKey(key, this.items);
  }
}
