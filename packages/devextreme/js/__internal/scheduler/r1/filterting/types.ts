import type { AppointmentDataAccessor } from '@ts/scheduler/utils';

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
