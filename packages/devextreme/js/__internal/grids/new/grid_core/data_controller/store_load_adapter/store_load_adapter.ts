/* eslint-disable spellcheck/spell-checker */
import type { DataSource, LoadResult } from '@js/common/data';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import type { SubsGets } from '@ts/core/reactive';

import { deferredCache } from '../deferred_cache';
import type { InternalLoadOptions, OperationOptions } from '../types';
import { getLocalLoadOptions, getStoreLoadOptions } from '../utils';
import type { LocalStoreFabric } from './types';

export class StoreLoadAdapter<TData> {
  private readonly loadFromStore: (
    loadOptions: InternalLoadOptions,
  ) => DeferredObj<LoadResult<TData>>;

  constructor(
    private readonly dataSourceReactive: SubsGets<DataSource<unknown, unknown>>,
    private readonly localLoadOptionsReactive: SubsGets<OperationOptions>,
    private readonly localStoreFabric: LocalStoreFabric<unknown, TData>,
  ) {
    this.loadFromStore = deferredCache<InternalLoadOptions, LoadResult<TData>>(
      (loadOptions: InternalLoadOptions) => {
        const dataSource = this.dataSourceReactive.unreactive_get();
        // NOTE: In runtime we have deferred here (not promise)
        return dataSource.store().load(loadOptions) as unknown as DeferredObj<LoadResult<TData>>;
      },
    );
  }

  public load(loadOptions: InternalLoadOptions = {}): DeferredObj<LoadResult<TData>> {
    const result = Deferred();
    const { localOptions, remoteOptions } = this.getLoadOptions(loadOptions);

    this.loadFromStore(remoteOptions)
      .done((loadedData) => {
        const localStore = this.localStoreFabric(loadedData);

        localStore
          .load(localOptions)
          .done((processedData) => {
            result.resolve(processedData);
          })
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          .fail(result.reject);
      })
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      .fail(result.reject);

    return result as DeferredObj<LoadResult<TData>>;
  }

  public getLocalLoadOperations(): OperationOptions {
    return this.localLoadOptionsReactive.unreactive_get();
  }

  private getLoadOptions(
    loadOptions: InternalLoadOptions,
  ): { localOptions: InternalLoadOptions; remoteOptions: InternalLoadOptions } {
    const localLoadOptions = this.localLoadOptionsReactive.unreactive_get();

    const localOptions = getLocalLoadOptions(
      loadOptions,
      localLoadOptions,
    );
    const remoteOptions = getStoreLoadOptions(
      loadOptions,
      localLoadOptions,
    );

    return { localOptions, remoteOptions };
  }
}
