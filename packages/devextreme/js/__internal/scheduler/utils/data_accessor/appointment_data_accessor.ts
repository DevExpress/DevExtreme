import { compileGetter, compileSetter } from '@js/core/utils/data';
import dateSerialization from '@js/core/utils/date_serialization';
import type { Appointment } from '@js/ui/scheduler';

import { DataAccessor } from './data_accessor';
import type { DataAccessorGetter, DataAccessorSetter, IFieldExpr } from './types';

type AppointmentGetter = DataAccessorGetter<Appointment>;
type AppointmentSetter = DataAccessorSetter<Appointment>;
interface AccessExpressions {
  getter: AppointmentGetter;
  setter: AppointmentSetter;
}
interface KnownFields extends Appointment {
  startDate: Date;
  endDate: Date;
}

const isDateField = (field: string): boolean => field === 'startDate' || field === 'endDate';

export class AppointmentDataAccessor extends DataAccessor<Appointment, KnownFields> {
  public expr!: IFieldExpr;

  // TODO(3): resources data accessor sets inside scheduler. Move logic to this class
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public resources: any;

  constructor(
    fields: IFieldExpr,
    protected forceIsoDateParsing = true,
    protected dateSerializationFormat?: string,
  ) {
    super();
    this.expr = { ...fields };
    this.updateExpressions<IFieldExpr>(fields);
  }

  private getCommonAccessExpressions(expr: string): AccessExpressions {
    return {
      getter: compileGetter(expr) as AppointmentGetter,
      setter: compileSetter(expr) as AppointmentSetter,
    };
  }

  private getDateFieldAccessExpressions(expr: string): AccessExpressions {
    const { getter: commonGetter, setter: commonSetter } = this.getCommonAccessExpressions(expr);
    // TODO: check cache usage, it sets once and forever now
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let serializationFormatCache: string | undefined;

    const getter = (object: Appointment): unknown => (this.forceIsoDateParsing
      ? dateSerialization.deserializeDate(commonGetter(object))
      : commonGetter(object));

    const setter = (object: Appointment, value: unknown): void => {
      if (this.dateSerializationFormat) {
        serializationFormatCache = this.dateSerializationFormat;
      } else if (this.forceIsoDateParsing && !serializationFormatCache) {
        const oldValue = commonGetter(object);

        serializationFormatCache = dateSerialization.getDateSerializationFormat(oldValue) as string;
      }

      const newValue = dateSerialization.serializeDate(
        value,
        serializationFormatCache,
      );

      commonSetter(object, newValue);
    };

    return { getter, setter };
  }

  private getAccessExpressions(name: string, expr: string): AccessExpressions {
    return isDateField(name)
      ? this.getDateFieldAccessExpressions(expr)
      : this.getCommonAccessExpressions(expr);
  }

  public updateExpression(field: string, expr: string | undefined): void {
    const name = field.replace('Expr', '');

    if (!expr) {
      /* eslint-disable @typescript-eslint/no-dynamic-delete */
      delete this.getter[name];
      delete this.setter[name];
      delete this.expr[field];
      /* eslint-enable @typescript-eslint/no-dynamic-delete */
      return;
    }

    const { getter, setter } = this.getAccessExpressions(name, expr);

    this.getter[name] = getter;
    this.setter[name] = setter;
    this.expr[field] = expr;
  }
}
