import { compileGetter, compileSetter } from '@js/core/utils/data';
import dateSerialization from '@js/core/utils/date_serialization';
import type { Appointment } from '@js/ui/scheduler';

import { DataAccessor } from './DataAccessor';
import type { DataAccessorGetter, DataAccessorSetter, IFieldExpr } from './types';

type AppointmentGetter = DataAccessorGetter<Appointment>;
type AppointmentSetter = DataAccessorSetter<Appointment>;
interface KnownFields extends Record<string, unknown> {
  startDate: Date;
  endDate: Date;
  startDateTimeZone?: string;
  endDateTimeZone?: string;
  recurrenceRule?: string;
  recurrenceException?: string;
}

const isDateField = (field: string): boolean => field === 'startDate' || field === 'endDate';

export class AppointmentDataAccessor extends DataAccessor<Appointment, KnownFields> {
  public expr!: IFieldExpr;

  // TODO(3): resources data accessor sets inside scheduler. Move logic to this class
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public resources: any;

  protected forceIsoDateParsing = true;

  protected dateSerializationFormat?: string;

  constructor(
    fields: IFieldExpr,
    forceIsoDateParsing: boolean,
    dateSerializationFormat?: string,
  ) {
    super();
    this.expr = { ...fields };
    this.forceIsoDateParsing = forceIsoDateParsing;
    this.dateSerializationFormat = dateSerializationFormat;
    this.updateExpressions<IFieldExpr>(fields);
  }

  public updateExpression(field: string, expr: string | undefined): void {
    const name = field.replace('Expr', '');

    if (expr) {
      const commonGetter = compileGetter(expr) as AppointmentGetter;
      const commonSetter = compileSetter(expr) as AppointmentSetter;

      let getter: AppointmentGetter = commonGetter;
      let setter: AppointmentSetter = commonSetter;

      if (isDateField(name)) {
        getter = (object): unknown => {
          let value = commonGetter(object);
          if (this.forceIsoDateParsing) {
            value = dateSerialization.deserializeDate(value);
          }

          return value;
        };
        setter = (object, value): void => {
          const serializationFormat = this.dateSerializationFormat
            ?? dateSerialization.getDateSerializationFormat(commonGetter(object));

          const newValue = dateSerialization.serializeDate(
            value,
            serializationFormat,
          );

          commonSetter(object, newValue);
        };
      }

      this.getter[name] = getter;
      this.setter[name] = setter;
      this.expr[field] = expr;
    } else {
      /* eslint-disable @typescript-eslint/no-dynamic-delete */
      delete this.getter[name];
      delete this.setter[name];
      delete this.expr[field];
      /* eslint-enable @typescript-eslint/no-dynamic-delete */
    }
  }
}
