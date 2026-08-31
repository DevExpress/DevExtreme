import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import type { DataSource, StoreLoadOptions } from '@ts/data/data_source/types';

import { executeTask } from './m_data_source_adapter_utils';
import type { LoadOperation, RawItemData } from './types';

export type CustomLoadOptions = StoreLoadOptions & { isLoadingAll?: boolean };

// TODO:
// - use options.delay instead of getLoadingTimeout
// - modernize the code (remove each, codes-style)
export class CustomLoadPipeline {
  private customLoading = false;

  private loadingAll = false;

  constructor(
    private readonly dataSource: DataSource,
    private readonly getLoadingTimeout: () => number | undefined,
    private readonly customizeStoreLoadOptions: (operation: LoadOperation) => void,
    private readonly customizeLoadResult: (operation: LoadOperation) => void,
  ) {}

  public load(options: CustomLoadOptions): DeferredObj<unknown> {
    const { dataSource } = this;
    const d = Deferred();
    const store = dataSource.store();
    const dataSourceLoadOptions = dataSource.loadOptions();
    const operation: LoadOperation = {
      storeLoadOptions: extend({}, options, { langParams: dataSourceLoadOptions?.langParams }),
      isCustomLoading: true,
    };

    // @ts-expect-error badly typed Store type
    const customLoadOptions: string[] = store._customLoadOptions() ?? [];

    each(customLoadOptions, (_: number, optionName: string) => {
      if (!(optionName in operation.storeLoadOptions)) {
        operation.storeLoadOptions[optionName] = dataSourceLoadOptions[optionName];
      }
    });

    this.loadingAll = options.isLoadingAll ?? false;

    this.scheduleCustomLoadCallbacks(d);
    dataSource._scheduleLoadCallbacks(d);

    this.customizeStoreLoadOptions(operation);

    executeTask(() => {
      if (!dataSource.store()) {
        d.reject('canceled');
        return;
      }

      when(operation.data ?? this.loadFromStore(operation.storeLoadOptions))
        .done((data: unknown, loadedExtra: unknown) => {
          operation.data = data as RawItemData[];
          operation.extra = (loadedExtra ?? {}) as LoadOperation['extra'];

          this.customizeLoadResult(operation);

          // `customizeLoadResult` may have replaced `extra`, so re-read it.
          const extra = (operation.extra ?? {}) as { totalCount?: unknown };
          operation.extra = extra as LoadOperation['extra'];

          if (options.requireTotalCount && extra.totalCount === undefined) {
            extra.totalCount = store.totalCount(operation.storeLoadOptions);
          }

          when(operation.data, extra.totalCount)
            .done((resolvedData: unknown, totalCount: unknown) => {
              extra.totalCount = totalCount;
              d.resolve(resolvedData, extra);
            })
            .fail((e: unknown) => { d.reject(e); });
        })
        .fail((e: unknown) => { d.reject(e); });
    }, this.getLoadingTimeout());

    return d
      .fail((...args: unknown[]) => {
        dataSource._eventsStrategy.fireEvent('loadError', args);
      })
      .always(() => {
        this.loadingAll = false;
      })
      .promise() as unknown as DeferredObj<unknown>;
  }

  public loadAll(): DeferredObj<unknown> {
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
  ): DeferredObj<unknown> {
    const d = Deferred();
    const operation: LoadOperation = {
      data,
      isCustomLoading: true,
      storeLoadOptions: { isLoadingAll: true },
      loadOptions,
    };

    this.customizeLoadResult(operation);

    // customizeLoadResult may have replaced operation.data with deferred
    when(operation.data)
      .done((loadedData: unknown) => { d.resolve(loadedData, operation.extra); })
      .fail((...args: unknown[]) => { d.reject(...args); });

    return d;
  }

  public loadFromStore(loadOptions: StoreLoadOptions): DeferredObj<unknown> {
    const d = Deferred();

    (this.dataSource
      .store()
      .load(loadOptions) as unknown as DeferredObj<unknown>)
      .done((data: unknown, extra: unknown) => {
        // A store may resolve with a single `{ data, totalCount }` object
        // instead of the `(data, extra)` pair the pipeline expects.
        const result = data as { data?: unknown } | undefined;

        if (result && !Array.isArray(result) && Array.isArray(result.data)) {
          d.resolve(result.data, result);
        } else {
          d.resolve(data, extra);
        }
      })
      .fail((...args: unknown[]) => { d.reject(...args); });

    return d;
  }

  public isCustomLoading(): boolean {
    return this.customLoading;
  }

  public isLoadingAll(): boolean {
    return this.loadingAll;
  }

  private scheduleCustomLoadCallbacks(deferred: DeferredObj<unknown>): void {
    this.customLoading = true;

    deferred.always(() => {
      this.customLoading = false;
    });
  }
}
