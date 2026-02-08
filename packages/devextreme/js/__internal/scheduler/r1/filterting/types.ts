import type { AppointmentDataAccessor } from '../../utils/data_accessor/appointment_data_accessor';

export type DateFilterType = string | string[] | (string | Date)[][];

export interface RemoteFilterOptions {
  dataAccessors: AppointmentDataAccessor;
  dataSourceFilter?: unknown[];
  dateSerializationFormat?: string;
  forceIsoDateParsing?: boolean;
}

export interface CombineRemoteFilterType extends RemoteFilterOptions {
  min: Date;
  max: Date;
}
