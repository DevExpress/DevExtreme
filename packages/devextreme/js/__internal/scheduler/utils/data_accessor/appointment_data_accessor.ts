import { compileGetter, compileSetter } from '@js/core/utils/data';
import dateSerialization from '@js/core/utils/date_serialization';
import type { Appointment } from '@js/ui/scheduler';

import { validateRRule } from '../../recurrence/validate_rule';
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
  allDay: boolean;
  disabled: boolean;
}

const isDateField = (field: string): boolean => field === 'startDate' || field === 'endDate';
const isBooleanField = (field: string): boolean => field === 'allDay' || field === 'disabled';

export class AppointmentDataAccessor extends DataAccessor<Appointment, KnownFields> {
  public expr!: IFieldExpr;

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

    const getter = (object: Appointment): unknown => {
      const date = this.forceIsoDateParsing
        ? dateSerialization.deserializeDate(commonGetter(object))
        : commonGetter(object);

      return date === undefined ? date : new Date(date);
    };

    const setter = (object: Appointment, value: unknown): void => {
      if (this.dateSerializationFormat) {
        serializationFormatCache = this.dateSerializationFormat;
      } else if (this.forceIsoDateParsing && !serializationFormatCache) {
        const oldValue = commonGetter(object);

        serializationFormatCache = dateSerialization.getDateSerializationFormat(oldValue);
      }

      const newValue = dateSerialization.serializeDate(
        value,
        serializationFormatCache,
      );

      commonSetter(object, newValue);
    };

    return { getter, setter };
  }

  private getBooleanFieldAccessExpressions(expr: string): AccessExpressions {
    const { getter: commonGetter, setter } = this.getCommonAccessExpressions(expr);
    const getter = (object: Appointment): unknown => Boolean(commonGetter(object));

    return { getter, setter };
  }

  private getAccessExpressions(name: string, expr: string): AccessExpressions {
    switch (true) {
      case isBooleanField(name):
        return this.getBooleanFieldAccessExpressions(expr);
      case isDateField(name):
        return this.getDateFieldAccessExpressions(expr);
      default:
        return this.getCommonAccessExpressions(expr);
    }
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

  public isRecurrent<T extends Appointment>(appointment: T): boolean {
    const recurrenceRule = this.get('recurrenceRule', appointment);
    const isRecurrent = validateRRule(recurrenceRule);
    return isRecurrent;
  }
}
