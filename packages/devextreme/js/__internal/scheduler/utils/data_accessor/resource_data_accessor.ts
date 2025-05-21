import { compileGetter, compileSetter } from '@js/core/utils/data';

import type { RawResourceData, ResourceConfig, ResourceData } from '../loader/types';
import { DataAccessor } from './data_accessor';
import type { DataAccessorGetter, DataAccessorSetter } from './types';

export class ResourceDataAccessor extends DataAccessor<RawResourceData, ResourceData> {
  constructor(
    config: ResourceConfig,
    public idExpr = config.valueExpr ?? 'id',
    public textExpr = config.displayExpr ?? 'text',
    public colorExpr = config.colorExpr ?? 'color',
  ) {
    super();

    this.updateExpressions({ idExpr, textExpr, colorExpr });
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
