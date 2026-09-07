import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import type { DataSource } from '@ts/data/data_source/data_source';
import type { StoreLoadOptions } from '@ts/data/data_source/types';

import { executeTask } from './m_data_source_adapter_utils';
import type { LoadOperation, RawItemData } from './types';

export type CustomStoreLoadOptions = StoreLoadOptions & { isLoadingAll?: boolean };

export interface CustomLoadResult {
  data: RawItemData[],
  extra?: LoadOperation['extra']
}

/**
 * Loads data through the adapter's `customizeStoreLoadOptions` and
 * `customizeLoadResult` stages, but leaves the DataSource's own state alone:
 * its items, pageIndex, totalCount and load queue stay as they are, and the
 * result goes to the caller instead.
 *
 * Serves what the grid needs beyond the rows it renders: lookups, header
 * filters, focused row lookups, group counts and `loadAll`.
 */
export class CustomLoader {
  private _isLoading = false;

  private _isLoadingAll = false;

  constructor(
    private readonly dataSource: DataSource,
    private readonly getLoadingTimeout: () => number | undefined,
    private readonly customizeStoreLoadOptions: (operation: LoadOperation) => void,
    private readonly customizeLoadResult: (operation: LoadOperation) => void,
  ) {}

  public isLoading(): boolean {
    return this._isLoading;
  }

  public isLoadingAll(): boolean {
    return this._isLoadingAll;
  }

  public load(options: CustomStoreLoadOptions): DeferredObj<CustomLoadResult> {
    const d = Deferred<CustomLoadResult>();

    this._isLoading = true;
    this._isLoadingAll = options.isLoadingAll ?? false;
    this.dataSource._scheduleLoadCallbacks(d);

    const operation = this.createLoadOperation(options);

    this.customizeStoreLoadOptions(operation);

    executeTask(() => {
      const store = this.dataSource.store();

      if (!store) {
        // @ts-expect-error badly typed Deferred.reject
        d.reject('canceled');
        return;
      }

      const loadDeferred = operation.data ?? this.loadFromStore(operation.storeLoadOptions);

      when<CustomLoadResult | RawItemData[]>(loadDeferred)
        .done((result) => {
          const loaded: CustomLoadResult = Array.isArray(result) ? { data: result } : result;

          operation.data = loaded.data;
          operation.extra = loaded.extra;

          this.customizeLoadResult(operation);

          // customizeLoadResult may have replaced extra, so re-read it
          let totalCount: number | DeferredObj<number> | undefined = operation.extra?.totalCount;

          if (options.requireTotalCount && totalCount === undefined) {
            totalCount = store.totalCount(operation.storeLoadOptions);
          }

          // customizeLoadResult may have replaced data, so re-resolve it
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          when<any>(operation.data, totalCount)
            .done((resolvedData: RawItemData[], resolvedTotalCount?: number) => {
              operation.extra ??= {};
              operation.extra.totalCount = resolvedTotalCount;
              d.resolve({
                data: resolvedData,
                extra: operation.extra,
              });
            })
            // @ts-expect-error badly typed Deferred.reject
            .fail((e: unknown) => { d.reject(e); });
        })
        // @ts-expect-error badly typed Deferred.reject
        .fail((e: unknown) => { d.reject(e); });
    }, this.getLoadingTimeout());

    return d
      .fail((...args: unknown[]) => {
        this.dataSource._eventsStrategy.fireEvent('loadError', args);
      })
      .always(() => {
        this._isLoading = false;
        this._isLoadingAll = false;
      })
      .promise() as unknown as DeferredObj<CustomLoadResult>;
  }

  public loadAll(): DeferredObj<CustomLoadResult> {
    return this.load({
      ...this.dataSource.loadOptions(),
      isLoadingAll: true,
      requireTotalCount: false,
    });
  }

  /**
   * Runs already-loaded data through the pipeline's result stage
   */
  public processLoadedData(
    data: RawItemData[],
    loadOptions: StoreLoadOptions,
  ): DeferredObj<CustomLoadResult> {
    const d = Deferred<CustomLoadResult>();
    const operation: LoadOperation = {
      data,
      isCustomLoading: true,
      storeLoadOptions: { isLoadingAll: true },
      loadOptions,
    };

    this.customizeLoadResult(operation);

    // customizeLoadResult may have replaced operation.data with deferred
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    when<any>(operation.data)
      .done((loadedData: RawItemData[]) => {
        d.resolve({
          data: loadedData,
          extra: operation.extra,
        });
      })
      // @ts-expect-error badly typed Deferred.reject
      .fail((...args: unknown[]) => { d.reject(...args); });

    return d;
  }

  public loadFromStore(loadOptions: StoreLoadOptions): DeferredObj<CustomLoadResult> {
    const d = Deferred<CustomLoadResult>();

    this.dataSource
      .store()
      .load(loadOptions)
      .done((data: unknown, extra: unknown) => {
        // A store may resolve with a single `{ data, ...extra }` object
        // instead of the `(data, extra)` pair the pipeline expects.
        const result = data as {
          data?: unknown,
        } & LoadOperation['extra'] | undefined;

        if (result && !Array.isArray(result) && Array.isArray(result.data)) {
          d.resolve({
            data: result.data,
            extra: result,
          });
        } else {
          d.resolve({
            data: data as RawItemData[],
            extra: extra as LoadOperation['extra'],
          });
        }
      })
      // @ts-expect-error badly typed Deferred.reject
      .fail((...args: unknown[]) => { d.reject(...args); });

    return d;
  }

  private createLoadOperation(options: CustomStoreLoadOptions): LoadOperation {
    const dataSourceLoadOptions = this.dataSource.loadOptions();
    const storeLoadOptions: CustomStoreLoadOptions = extend(
      {},
      options,
      { langParams: dataSourceLoadOptions.langParams },
    );

    const customLoadOptions: string[] = this.dataSource.store()._customLoadOptions() ?? [];

    for (const optionName of customLoadOptions) {
      if (!(optionName in storeLoadOptions)) {
        storeLoadOptions[optionName] = dataSourceLoadOptions[optionName];
      }
    }

    return {
      storeLoadOptions,
      isCustomLoading: true,
    };
  }
}
