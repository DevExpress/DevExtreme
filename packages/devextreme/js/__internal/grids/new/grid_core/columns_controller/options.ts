import type { DataType } from '@js/common';
import messageLocalization from '@js/localization/message';
import filterUtils from '@js/ui/shared/filtering';

import { defaultSetFieldValue } from '../editing/utils';
import type { Template, WithRequired } from '../types';
import { parseValue } from '../utils/parse_value/index';
import type { Column, FieldInfo } from './types';

interface NonNormalizedColumnOptions {
  calculateDisplayValue: string | ((this: Column, data: unknown) => unknown);
  headerItemTemplate?: Template<{ column: Column }>;
  fieldTemplate?: Template<{ field: FieldInfo }>;
  fieldCaptionTemplate?: Template<{ field: FieldInfo }>;
  fieldValueTemplate?: Template<{ field: FieldInfo }>;
}

export type ColumnSettings = Partial<
Omit<Column, keyof NonNormalizedColumnOptions>
& NonNormalizedColumnOptions
>;

export type PreNormalizedColumn = WithRequired<ColumnSettings, 'name' | 'visibleIndex'>;

export type ColumnProperties = ColumnSettings | string;

export const defaultColumnProperties = {
  dataType: 'string',
  calculateFieldValue(data): unknown {
    // @ts-expect-error
    const value = data[this.dataField];
    return parseValue(this, value) ?? value;
  },
  calculateDisplayValue(data): unknown {
    return this.calculateFieldValue(data);
  },
  calculateFilterExpression: filterUtils.defaultCalculateFilterExpression,
  defaultCalculateFilterExpression: filterUtils.defaultCalculateFilterExpression,
  alignment: 'left',
  visible: true,
  allowReordering: true,
  allowHiding: true,
  trueText: undefined,
  falseText: undefined,
  showInColumnChooser: true,
  validationRules: [],
  allowEditing: true,
  editorOptions: {},
  formItem: {},
  setFieldValue: defaultSetFieldValue,
  defaultSetFieldValue,
} satisfies Partial<Column>;

export const defaultColumnPropertiesByDataType: Record<
  DataType,
  Exclude<ColumnProperties, string>
> = {
  boolean: {
    customizeText({ value }): string {
      const trueText = this.trueText ?? messageLocalization.format('dxDataGrid-trueText');
      const falseText = this.falseText ?? messageLocalization.format('dxDataGrid-falseText');
      return value
        ? trueText
        : falseText;
    },
  },
  string: {

  },
  date: {
    format: 'shortDate',
  },
  datetime: {
    format: 'shortDateShortTime',
  },
  number: {

  },
  object: {

  },
};

export interface Options {
  columns?: ColumnProperties[];

  allowColumnReordering?: boolean;
}

export const defaultOptions = {
  allowColumnReordering: false,
} satisfies Options;
