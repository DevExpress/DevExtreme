import { compileGetter, compileSetter } from '@js/core/utils/data';
import { wrapToArray } from '@ts/core/utils/m_array';
import type { DataAccessorGetter, DataAccessorSetter } from '@ts/scheduler/utils/data_accessor/types';

import type {
  ResourceConfig, ResourceId, ResourceIdAccessor,
} from './types';

export const getResourceIndex = (config: ResourceConfig): string => config.fieldExpr ?? config.field ?? '';

export const getAppointmentResourceAccessor = (config: ResourceConfig): ResourceIdAccessor => {
  const indexExpr = getResourceIndex(config);
  const getter = compileGetter(indexExpr) as DataAccessorGetter<unknown>;
  const setter = compileSetter(indexExpr) as DataAccessorSetter<unknown>;

  return {
    idGetter: (item) => wrapToArray(getter(item) ?? []) as ResourceId[],
    idSetter: (item, ids): void => setter(item, ids),
  };
};
