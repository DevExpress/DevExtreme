import type { LoadResult } from '@js/common/data';
import type { LoadOptions } from '@js/common/data.types';
import type { DeferredObj } from '@js/core/utils/deferred';

export type LocalStoreFabric<TLoadedData, TLocalProcessedData> = (
  data: LoadResult<TLoadedData>,
) => {
  load: (loadOptions: LoadOptions) => DeferredObj<LoadResult<TLocalProcessedData>>;
};
