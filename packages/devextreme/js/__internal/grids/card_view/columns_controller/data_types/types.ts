// @ts-nocheck
import type { Column } from '../types';
import type { NumberDataType } from './number';

export type DataType = {
  name?: string;
} & Pick<Column, 'fieldTemplate'>;

export interface PredefinedTypes {
  number: NumberDataType;
}

export type PredefinedTypesEnum = keyof PredefinedTypes;
