import { compileGetter, compileSetter } from '@js/core/utils/data';

import type { RawResourceData, ResourceConfig, ResourceData } from '../loader/types';
import { DataAccessor } from './data_accessor';
import type { DataAccessorGetter, DataAccessorSetter } from './types';

export class ResourceDataAccessor extends DataAccessor<RawResourceData, ResourceData> {
  public idExpr: string | Function;

  public textExpr: string | Function;

  public colorExpr: string;

  public parentIdExpr?: string;

  constructor(
    config: ResourceConfig,
  ) {
    super();

    this.idExpr = config.valueExpr ?? 'id';
    this.textExpr = config.displayExpr ?? 'text';
    this.colorExpr = config.colorExpr ?? 'color';
    this.parentIdExpr = config.parentIdExpr;

    const expressions: Record<string, string | Function> = {
      idExpr: this.idExpr,
      textExpr: this.textExpr,
      colorExpr: this.colorExpr,
    };

    if (this.parentIdExpr) {
      expressions.parentIdExpr = this.parentIdExpr;
    }

    this.updateExpressions(expressions);
  }

  public updateExpression(field: string, expr: string | Function | undefined): void {
    const name = field.replace('Expr', '');

    if (!expr) {
      /* eslint-disable @typescript-eslint/no-dynamic-delete */
      delete this.getter[name];
      delete this.setter[name];
      /* eslint-enable @typescript-eslint/no-dynamic-delete */
      return;
    }

    if (typeof expr === 'function') {
      this.getter[name] = expr as DataAccessorGetter<RawResourceData>;
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.setter[name];
      return;
    }

    this.getter[name] = compileGetter(expr) as DataAccessorGetter<RawResourceData>;
    this.setter[name] = compileSetter(expr) as DataAccessorSetter<RawResourceData>;
  }
}
