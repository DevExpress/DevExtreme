import { DataAccessorType } from '../../types';

export type DateFilterType = string | string[] | (string | Date)[][];

export interface RemoteFilterOptions {
  dataAccessors: DataAccessorType;
  dataSourceFilter?: unknown[];
  dateSerializationFormat?: string;
  forceIsoDateParsing?: boolean;
}

export interface CombineRemoteFilterType extends RemoteFilterOptions {
  min: Date;
  max: Date;
}
