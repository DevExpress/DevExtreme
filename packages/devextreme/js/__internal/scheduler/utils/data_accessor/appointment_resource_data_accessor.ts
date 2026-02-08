import { compileGetter, compileSetter } from '@js/core/utils/data';
import { wrapToArray } from '@ts/core/utils/m_array';

import type {
  AppointmentResourceConfig,
  ResourceConfig,
  ResourceId,
} from '../loader/types';
import type { DataAccessorGetter, DataAccessorSetter } from './types';

export interface ResourceIdAccessor {
  idsGetter: DataAccessorGetter<Record<string, unknown>, ResourceId[]>;
  idsSetter: DataAccessorSetter<Record<string, unknown>, AppointmentResourceConfig>;
}

export const getResourceIndex = (config: ResourceConfig): string => config.fieldExpr ?? config.field ?? '';

export const getAppointmentResourceAccessor = (config: ResourceConfig): ResourceIdAccessor => {
  const indexExpr = getResourceIndex(config);
  const getter = compileGetter(indexExpr) as DataAccessorGetter<unknown>;
  const setter = compileSetter(indexExpr) as DataAccessorSetter<unknown>;

  return {
    idsGetter: (item) => wrapToArray(getter(item) ?? []) as ResourceId[],
    idsSetter: (item, ids): void => setter(item, ids),
  };
};
