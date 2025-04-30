import { compileGetter, compileSetter } from '@js/core/utils/data';
import type { DataAccessorGetter, DataAccessorSetter } from '@ts/scheduler/utils/data_accessor/types';

import { DataAccessor } from '../utils/data_accessor/data_accessor';
import type { RawResourceData, ResourceConfig, ResourceData } from './types';

export class ResourceDataAccessor extends DataAccessor<RawResourceData, ResourceData> {
  constructor(config: ResourceConfig) {
    super();

    this.updateExpressions({
      idExpr: config.valueExpr ?? 'id',
      textExpr: config.displayExpr ?? 'text',
      colorExpr: config.colorExpr ?? 'color',
    });
  }

  public updateExpression(field: string, expr: string | undefined): void {
    const name = field.replace('Expr', '');

    if (!expr) {
      /* eslint-disable @typescript-eslint/no-dynamic-delete */
      delete this.getter[name];
      delete this.setter[name];
      /* eslint-enable @typescript-eslint/no-dynamic-delete */
      return;
    }

    this.getter[name] = compileGetter(expr) as DataAccessorGetter<RawResourceData>;
    this.setter[name] = compileSetter(expr) as DataAccessorSetter<RawResourceData>;
  }
}
