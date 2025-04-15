/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable consistent-return */
import { compileGetter } from '@js/core/utils/data';
import dateSerialization from '@js/core/utils/date_serialization';
import { captionize } from '@js/core/utils/inflector';
import {
  isDefined,
  isNumeric,
  isString,
  type,
} from '@js/core/utils/type';
import type { ComponentType } from 'inferno';

import type { Template } from '../types';
import type { ColumnProperties, ColumnSettings, PreNormalizedColumn } from './options';
import { defaultColumnProperties, defaultColumnPropertiesByDataType } from './options';
import type { Column } from './types';

type TemplateNormalizationFunc = <T>(template: Template<T>) => ComponentType<T>;

function normalizeColumn(
  column: PreNormalizedColumn,
  templateNormalizationFunc: TemplateNormalizationFunc,
): Column {
  const dataTypeDefault = defaultColumnPropertiesByDataType[
    column.dataType ?? defaultColumnProperties.dataType
  ];

  const caption = captionize(column.name);

  const colWithDefaults = {
    ...defaultColumnProperties,
    ...dataTypeDefault,
    caption,
    ...column,
  };

  return {
    ...colWithDefaults,
    calculateDisplayValue: isString(colWithDefaults.calculateDisplayValue)
      ? compileGetter(colWithDefaults.calculateDisplayValue) as (data: unknown) => string
      : colWithDefaults.calculateDisplayValue,
    headerItemTemplate: colWithDefaults.headerItemTemplate
      ? templateNormalizationFunc(colWithDefaults.headerItemTemplate)
      : undefined,
  };
}

export function getVisibleIndexes(
  indexes: (number | undefined)[],
): number[] {
  const newIndexes = [...indexes];
  let minNonExistingIndex = 0;

  indexes.forEach((visibleIndex, index) => {
    while (newIndexes.includes(minNonExistingIndex)) {
      minNonExistingIndex += 1;
    }

    newIndexes[index] = visibleIndex ?? minNonExistingIndex;
  });

  return newIndexes as number[];
}

export function normalizeVisibleIndexes(
  indexes: number[],
  forceIndex?: number,
): number[] {
  const indexMap = indexes.map(
    (visibleIndex, index) => [index, visibleIndex],
  );

  const sortedIndexMap = new Array<number>(indexes.length);
  if (isDefined(forceIndex)) {
    sortedIndexMap[indexes[forceIndex]] = forceIndex;
  }

  let j = 0;
  indexMap
    .sort((a, b) => a[1] - b[1])
    .forEach(([index]) => {
      if (index === forceIndex) {
        return;
      }

      if (isDefined(sortedIndexMap[j])) {
        j += 1;
      }

      sortedIndexMap[j] = index;
      j += 1;
    });

  const returnIndexes = new Array<number>(indexes.length);
  sortedIndexMap.forEach((index, visibleIndex) => {
    returnIndexes[index] = visibleIndex;
  });
  return returnIndexes;
}

export function normalizeColumns(
  columns: PreNormalizedColumn[],
  templateNormalizationFunc: TemplateNormalizationFunc,
): Column[] {
  const normalizedColumns = columns.map((c) => normalizeColumn(c, templateNormalizationFunc));
  return normalizedColumns;
}

export function preNormalizeColumns(columns: ColumnProperties[]): PreNormalizedColumn[] {
  const normalizedColumns = columns
    .map((column): ColumnSettings => {
      if (typeof column === 'string') {
        return {
          dataField: column,
        };
      }

      return column;
    })
    .map((column, index) => ({
      ...column,
      name: column.name ?? column.dataField ?? `column-${index}`,
    }));

  const visibleIndexes = getVisibleIndexes(
    normalizedColumns.map((c) => c.visibleIndex),
  );

  normalizedColumns.forEach((_, i) => {
    normalizedColumns[i].visibleIndex = visibleIndexes[i];
  });

  return normalizedColumns as PreNormalizedColumn[];
}

export function normalizeStringColumn(column: ColumnProperties): ColumnSettings {
  if (typeof column === 'string') {
    return { dataField: column };
  }

  return column;
}

export function getColumnIndexByName(
  columns: PreNormalizedColumn[] | Column[],
  name: string,
): number {
  return columns.findIndex((c) => c.name === name);
}

export function getColumnByIndexOrName(
  columns: Column[],
  columnNameOrIndex: string | number,
): Column | undefined {
  const column = columns.find((c, i) => {
    if (isString(columnNameOrIndex)) {
      return c.name === columnNameOrIndex;
    }
    return i === columnNameOrIndex;
  });

  return column;
}

export const getColumnDataTypeFromValue = function (value: string): any {
  if (value) {
    if (typeof value === 'string') {
      if (!isNaN(Number(value))) {
        return 'number';
      }

      const parsed = Date.parse(value);
      if (!isNaN(parsed)) {
        const hasTime = /[T\s]\d{2}:\d{2}/.test(value);
        return hasTime ? 'datetime' : 'date';
      }

      return 'string';
    }
  }
};

export const getValueDataType = function (value) {
  let dataType: any = type(value);
  if (dataType !== 'string' && dataType !== 'boolean' && dataType !== 'number' && dataType !== 'date' && dataType !== 'object') {
    dataType = undefined;
  }
  if (dataType === 'string') {
    dataType = getColumnDataTypeFromValue(value);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return dataType;
};

export const getSerializationFormat = function (dataType, value): any {
  // eslint-disable-next-line default-case
  switch (dataType) {
    case 'date':
    case 'datetime':
      return dateSerialization.getDateSerializationFormat(value);
    case 'number':
      if (isString(value)) {
        return 'string';
      }

      if (isNumeric(value)) {
        return null;
      }
  }
};
