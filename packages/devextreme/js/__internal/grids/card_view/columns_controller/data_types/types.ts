import { Column } from "../types";
import { NumberDataType } from "./number";

export type DataType = {
  name?: string;
} & Pick<Column, 'fieldTemplate'>

export type PredefinedTypes = {
  number: NumberDataType
};

export type PredefinedTypesEnum = keyof PredefinedTypes;
