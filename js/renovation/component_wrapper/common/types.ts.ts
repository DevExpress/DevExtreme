export type AbstractFunction = (...args: any) => any;

export interface Option {
  name: string;
  fullName: string;
  value: unknown;
  previousValue: unknown;
}
