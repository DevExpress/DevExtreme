import { ColumnBase, ColumnLookup as LookupBase } from '../../data_grid';

export interface Lookup extends LookupBase {
  items: unknown[];
}

export interface Column extends ColumnBase {
  lookup?: Lookup;
  serializeValue?: unknown;
  displayField?: unknown;
}

type MakeFieldRequired<Type, Field extends keyof Type> = Type & Required<Pick<Type, Field>>;

export type LookupColumn = MakeFieldRequired<Column, 'lookup'>;
