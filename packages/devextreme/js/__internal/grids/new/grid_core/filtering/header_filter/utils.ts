import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';

import type { HeaderFilterRootOptions } from './types';

const mergeColumnHeaderFilterOptions = (
  column: Column,
  rootOptions: HeaderFilterRootOptions | undefined,
): Column => {
  const { texts, visible, ...restRootOptions } = rootOptions ?? {};

  return {
    ...column,
    allowHeaderFiltering: !!rootOptions?.visible
      && !!column?.allowFiltering
      && !!column?.allowHeaderFiltering,
    headerFilter: {
      ...restRootOptions,
      ...column?.headerFilter,
      search: {
        ...restRootOptions?.search,
        ...column?.headerFilter?.search,
      },
    },
  };
};

export default {
  mergeColumnHeaderFilterOptions,
};
