import type { DataSource } from '@js/common/data';
import type { FilterDescriptor } from '@js/common/data.types';
import ArrayStore from '@js/common/data/array_store';
import { Deferred } from '@js/core/utils/deferred';
import { isDefined, isPlainObject } from '@js/core/utils/type';
import type { ReadonlySignal } from '@ts/core/reactive/index';
import { computed, effect, signal } from '@ts/core/reactive/index';
import { equalByValue } from '@ts/core/utils/m_common';
import type { PromiseWithResolvers } from '@ts/core/utils/promise';
import { createPromise } from '@ts/core/utils/promise';

import gridCoreUtils from '../../../grid_core/m_utils';
import { ColumnsController } from '../columns_controller/columns_controller';
import { ErrorController } from '../error_controller/error_controller';
import { FilterController } from '../filtering/filter_controller';
import { normalizeFilterWithSelectors } from '../filtering/utils';
import { LifeCycleController } from '../lifecycle/controller';
import { OptionsController } from '../options_controller/options_controller';
import { SortingController } from '../sorting_controller/index';
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

const FILTER_OBJ_COMPARE_DEPTH = 6;

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

  private previousDisplayFilter: FilterDescriptor = undefined;

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

  private readonly normalizedDisplayFilter = computed(
    (): FilterDescriptor => normalizeFilterWithSelectors(
      this.filterController.displayFilter.value,
      this.columnsController.columns.value,
      !!this.normalizedRemoteOptions.value.filtering,
    ),
  );

  public static dependencies = [
    ColumnsController,
    OptionsController,
    SortingController,
    FilterController,
    ErrorController,
    LifeCycleController,
  ] as const;

  constructor(
    private readonly columnsController: ColumnsController,
    private readonly options: OptionsController,
    private readonly sortingController: SortingController,
    private readonly filterController: FilterController,
    private readonly errorController: ErrorController,
    private readonly lifecycle: LifeCycleController,
  ) {
    effect(() => {
      if (this.dataSource.value) {
        this.columnsController.resetColumnOptionsFromDataItem();
      }
    });

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
        const loadErrorCallback = (error: Error): void => {
          const callback = this.onDataErrorOccurred.peek();
          callback({ error });
          this.errorController.showError(error.message ?? error);
          changedCallback();
        };
        const customizeStoreLoadOptionsCallback = (e): void => {
          e.storeLoadOptions.filter = this.combineFilterWithDisplayFilter(
            e.storeLoadOptions.filter,
          );

          const localOperations = this.normalizedLocalOperations.peek();
          this.pendingLocalOperations[e.operationId] = getLocalLoadOptions(
            e.storeLoadOptions,
            localOperations,
          );
          e.storeLoadOptions = getStoreLoadOptions(
            e.storeLoadOptions,
            localOperations,
          );
        };

        const getLoadOptionsWithoutLocalPaging = (loadOptions): unknown => {
          const { skip, take, ...rest } = loadOptions;
          return rest;
        };

        const dataLoadedCallback = (e): void => {
          /*
            We use Deffered here because the code below is synchronous.
            customizeLoadResult callback does not support async code.
          */
          const { operationId } = e;
          const localLoadOptions = { ...this.pendingLocalOperations[operationId] };
          const { skip, take } = localLoadOptions;
          const hasLocalPaging = isDefined(skip) && isDefined(take);

          const localOptionsWithoutPaging = getLoadOptionsWithoutLocalPaging(localLoadOptions);

          new ArrayStore(e.data).load(localOptionsWithoutPaging).done((filteredData) => {
            e.extra = isPlainObject(e.extra) ? e.extra : {};

            if (hasLocalPaging) {
              e.take = take;
              e.skip = skip;

              if (e.storeLoadOptions.requireTotalCount) {
                e.extra.totalCount = filteredData.length;
              }

              new ArrayStore(e.data).load(localLoadOptions).done((newData) => {
                e.data = newData;
              });
            } else {
              e.data = filteredData;
            }
          }).fail((error) => {
            // @ts-expect-error
            e.data = new Deferred().reject(error);
          });

          this.pendingLocalOperations[operationId] = undefined;
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
        const initialized = this.options.initialized.value;
        const dataSource = this.dataSource.value;
        const pageIndex = this.pageIndex.value;
        const pageSize = this.pageSize.value;
        const isLoaded = this.isLoaded.value;
        const displayFilter = this.filterController.displayFilter.value;
        const pagingEnabled = this.pagingEnabled.value;
        const sortParameters = this.sortingController.sortParameters.value;

        if (!initialized) {
          return;
        }

        let someParamChanged = false;

        if (dataSource.pageIndex() !== pageIndex) {
          dataSource.pageIndex(pageIndex);
          someParamChanged ||= true;
        }

        if (dataSource.pageSize() !== pageSize) {
          const newPageIndex = isLoaded
            ? Math.max(Math.min(this.pageCount.peek() - 1, pageIndex), 0)
            : pageIndex;

          dataSource.pageSize(pageSize);
          dataSource.pageIndex(newPageIndex);

          someParamChanged ||= true;
        }

        if (!dataSource.requireTotalCount()) {
          dataSource.requireTotalCount(true);
          someParamChanged ||= true;
        }

        const filterChanged = !equalByValue(
          this.previousDisplayFilter,
          displayFilter,
          {
            maxDepth: FILTER_OBJ_COMPARE_DEPTH,
            strict: true,
          },
        );
        if (filterChanged && isLoaded) {
          this.dataSource.peek().pageIndex(0);
          someParamChanged ||= true;
        }
        this.previousDisplayFilter = displayFilter;

        if (!equalByValue(dataSource.paginate(), pagingEnabled)) {
          dataSource.paginate(pagingEnabled);
          someParamChanged ||= true;
        }

        if (sortParameters && !equalByValue(dataSource.sort(), sortParameters)) {
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

  public getCombinedFilter(): FilterDescriptor {
    return this.combineFilterWithDisplayFilter(
      this.dataSource.peek().filter(),
    );
  }

  private combineFilterWithDisplayFilter(filter: FilterDescriptor): FilterDescriptor {
    return gridCoreUtils.combineFilters([
      filter,
      this.normalizedDisplayFilter.peek(),
    ]);
  }

  private normalizePageIndex(dataSource: DataSource): 'normalized' | 'require-reload' {
    const pageIndex = dataSource.pageIndex();
    const totalCount = dataSource.totalCount();
    const pageSize = dataSource.pageSize();
    const pageCount = Math.ceil(totalCount / pageSize);

    if (totalCount > 0 && pageIndex >= pageCount) {
      dataSource.pageIndex(pageCount - 1);
      return 'require-reload';
    }

    return 'normalized';
  }

  private onChanged(dataSource: DataSource, e): void {
    const normalizePageIndexResult = this.normalizePageIndex(dataSource);
    if (normalizePageIndexResult === 'require-reload') {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      dataSource.load();
      return;
    }

    let items = dataSource.items() as DataObject[];

    if (e?.changes) {
      items = this._items.peek();
      items = updateItemsImmutable(items, e.changes, dataSource.store());
    }

    const firstItem = items[0];

    this.columnsController.setColumnOptionsFromDataItem(firstItem ?? {});

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

    this.lifecycle.contentRendered.schedule(() => {
      this.lifecycle.fireContentReady();
    });
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
