import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import type { DataSource, StoreLoadOptions } from '@ts/data/data_source/types';

export class CustomLoadPipeline {
  constructor(private readonly dataSource: DataSource) {}

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
}
