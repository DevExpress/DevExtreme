import type { DataSource } from '@js/common/data';
import ArrayStore from '@js/common/data/array_store';
import { Deferred } from '@js/core/utils/deferred';
import type { ReadonlySignal } from '@preact/signals-core';
import { computed, effect, signal } from '@preact/signals-core';
import type { PromiseWithResolvers } from '@ts/core/utils/promise';
import { createPromise } from '@ts/core/utils/promise';

import { FilterController } from '../filtering/filter_controller';
import { OptionsController } from '../options_controller/options_controller';
import { SortingController } from '../sorting_controller/sorting_controller';
import { StoreLoadAdapter } from './store_load_adapter/index';
import type { DataObject, Key } from './types';
import {
  getLocalLoadOptions,
  getStoreLoadOptions,
  isCustomStore,
  isLocalStore,
  normalizeDataSource,
  normalizeLocalOptions,
  normalizeRemoteOptions,
  updateItemsImmutable,
} from './utils';

export class DataController {
  private readonly pendingLocalOperations = {};

  private loadedPromise?: PromiseWithResolvers<void>;

  private readonly dataSourceConfiguration = this.options.oneWay('dataSource');

  private readonly keyExpr = this.options.oneWay('keyExpr');

  public readonly dataSource = computed(
    () => normalizeDataSource(
      this.dataSourceConfiguration.value,
      this.keyExpr.value,
    ),
  );

  // TODO
  private readonly cacheEnabled = this.options.oneWay('cacheEnabled');

  private readonly pagingEnabled = this.options.twoWay('paging.enabled');

  public readonly pageIndex = this.options.twoWay('paging.pageIndex');

  public readonly pageSize = this.options.twoWay('paging.pageSize');

  private readonly remoteOperations = this.options.oneWay('remoteOperations');

  private readonly onDataErrorOccurred = this.options.action('onDataErrorOccurred');

  private readonly _items = signal<DataObject[]>([]);

  public readonly items: ReadonlySignal<DataObject[]> = this._items;

  private readonly _totalCount = signal(0);

  public readonly totalCount: ReadonlySignal<number> = this._totalCount;

  public readonly isLoading = signal(false);

  public readonly pageCount = computed(
    () => Math.ceil(
      this.totalCount.value / this.pageSize.value,
    ),
  );

  public readonly isLoaded = signal(false);

  public readonly isReloading = signal(false);

  private readonly normalizedRemoteOptions = computed(
    () => {
      const store = this.dataSource.value.store();
      return normalizeRemoteOptions(
        this.remoteOperations.value,
        isLocalStore(store),
        isCustomStore(store),
      );
    },
  );

  private readonly normalizedLocalOperations = computed(
    () => normalizeLocalOptions(this.normalizedRemoteOptions.value),
  );

  public static dependencies = [
    OptionsController,
    SortingController,
    FilterController,
  ] as const;

  constructor(
    private readonly options: OptionsController,
    private readonly sortingController: SortingController,
    private readonly filterController: FilterController,
  ) {
    effect(
      () => {
        const dataSource = this.dataSource.value;
        const changedCallback = (e?): void => {
          this.isLoaded.value = true;
          this.onChanged(dataSource, e);
        };
        const loadingChangedCallback = (): void => {
          this.isLoading.value = dataSource.isLoading();
          this.isReloading.value = true;
        };
        const loadErrorCallback = (error: string): void => {
          const callback = this.onDataErrorOccurred.peek();
          callback({ error });
          changedCallback();
        };
        const customizeStoreLoadOptionsCallback = (e): void => {
          const localOptions = this.normalizedLocalOperations.peek();
          this.pendingLocalOperations[e.operationId] = getLocalLoadOptions(
            e.storeLoadOptions,
            localOptions,
          );
          e.storeLoadOptions = getStoreLoadOptions(
            e.storeLoadOptions,
            localOptions,
          );
        };

        const dataLoadedCallback = (e): void => {
          /*
            We use Deffered here because the code below is synchronous.
            customizeLoadResult callback does not support async code.
          */
          new ArrayStore(e.data).load(this.pendingLocalOperations[e.operationId]).done((data) => {
            e.data = data;
          }).fail((error) => {
            // @ts-expect-error
            e.data = new Deferred().reject(error);
          });
          this.pendingLocalOperations[e.operationId] = undefined;
        };

        if (dataSource.isLoaded()) {
          changedCallback();
        }
        dataSource.on('changed', changedCallback);
        dataSource.on('loadingChanged', loadingChangedCallback);
        dataSource.on('loadError', loadErrorCallback);

        // @ts-expect-error
        dataSource.on('customizeStoreLoadOptions', customizeStoreLoadOptionsCallback);
        // @ts-expect-error
        dataSource.on('customizeLoadResult', dataLoadedCallback);

        return (): void => {
          dataSource.off('changed', changedCallback);
          dataSource.off('loadingChanged', loadingChangedCallback);
          dataSource.off('loadError', loadErrorCallback);

          // @ts-expect-error
          dataSource.off('customizeStoreLoadOptions', customizeStoreLoadOptionsCallback);
          // @ts-expect-error
          dataSource.off('customizeLoadResult', dataLoadedCallback);
        };
      },
    );

    effect(
      () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        this.normalizedRemoteOptions.value;
        if (this.dataSource.peek().isLoaded()) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this.dataSource.peek().load();
        }
      },
    );

    effect(
      () => {
        const dataSource = this.dataSource.value;
        const pageIndex = this.pageIndex.value;
        const pageSize = this.pageSize.value;
        const displayFilter = this.filterController.displayFilter.value;
        const pagingEnabled = this.pagingEnabled.value;
        const sortParameters = this.sortingController.sortParameters.value;

        let someParamChanged = false;
        if (dataSource.pageIndex() !== pageIndex) {
          dataSource.pageIndex(pageIndex);
          someParamChanged ||= true;
        }
        if (dataSource.pageSize() !== pageSize) {
          dataSource.pageSize(pageSize);
          someParamChanged ||= true;
        }

        if (!dataSource.requireTotalCount()) {
          dataSource.requireTotalCount(true);
          someParamChanged ||= true;
        }
        if (dataSource.filter() !== displayFilter) {
          dataSource.filter(displayFilter ?? null);
          someParamChanged ||= true;
        }
        if (dataSource.paginate() !== pagingEnabled) {
          dataSource.paginate(pagingEnabled);
          someParamChanged ||= true;
        }
        if (sortParameters && dataSource.sort() !== sortParameters) {
          dataSource.sort(sortParameters);
          someParamChanged ||= true;
        }

        if (someParamChanged || !dataSource.isLoaded()) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          dataSource.load();
        }
      },
    );
  }

  private onChanged(dataSource: DataSource, e): void {
    let items = dataSource.items() as DataObject[];

    if (e?.changes) {
      items = this._items.peek();
      items = updateItemsImmutable(items, e.changes, dataSource.store());
    }

    this._items.value = items;
    this.pageIndex.value = dataSource.pageIndex();
    this.pageSize.value = dataSource.pageSize();
    this._totalCount.value = dataSource.totalCount();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    Promise.resolve().then(() => {
      this.isReloading.value = false;
    });

    this.loadedPromise?.resolve();
    this.loadedPromise = undefined;
  }

  public getDataKey(data: DataObject): Key {
    return this.dataSource.peek().store().keyOf(data);
  }

  public waitLoaded(): Promise<void> {
    if (!this.dataSource.peek().isLoading()) {
      return Promise.resolve();
    }

    if (!this.loadedPromise) {
      this.loadedPromise = createPromise();
    }
    return this.loadedPromise.promise;
  }

  public getStoreLoadAdapter(): StoreLoadAdapter<unknown> {
    return new StoreLoadAdapter<unknown>(
      this.dataSource,
      this.normalizedLocalOperations,
      // NOTE: Badly typed ArrayStore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      (data) => new ArrayStore(data),
    );
  }

  public async update(key: Key, data: DataObject): Promise<void> {
    await this.dataSource.peek().store().update(key, data);
  }

  public async insert(data: DataObject): Promise<void> {
    await this.dataSource.peek().store().insert(data);
  }

  public async remove(key: Key): Promise<void> {
    await this.dataSource.peek().store().remove(key);
  }

  public async reload(): Promise<void> {
    await this.dataSource.peek().load();
  }

  public increasePageIndex(): void {
    const currentPageIdx = this.pageIndex.peek();
    const totalCount = this.totalCount.peek();
    const pageSize = this.pageSize.peek();
    const nextPageIdx = currentPageIdx + 1;
    const maxPageIdx = Math.ceil(totalCount / pageSize) - 1;

    if (nextPageIdx > maxPageIdx) {
      return;
    }

    this.pageIndex.value = nextPageIdx;
  }

  public decreasePageIndex(): void {
    const currentPageIdx = this.pageIndex.peek();
    const nextPageIdx = currentPageIdx - 1;

    if (nextPageIdx < 0) {
      return;
    }

    this.pageIndex.value = nextPageIdx;
  }
}
