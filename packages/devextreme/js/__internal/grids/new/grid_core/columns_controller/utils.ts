import type { DataType, Format } from '@js/common';
import { compileGetter } from '@js/core/utils/data';
import { captionize } from '@js/core/utils/inflector';
import {
  isDefined,
  isString, type,
} from '@js/core/utils/type';
import type { ReadonlySignal } from '@preact/signals-core';
import type { ComponentType } from 'inferno';

import type { DataObject } from '../data_controller/types';
import type { Template } from '../types';
import type { ColumnProperties, ColumnSettings, PreNormalizedColumn } from './options';
import { defaultColumnProperties, defaultColumnPropertiesByDataType } from './options';
import type { Column } from './types';

type TemplateNormalizationFunc = <T>(
  template: Template<T> | undefined
) => ComponentType<T> | undefined;

function normalizeColumn(
  column: PreNormalizedColumn,
  templateNormalizationFunc: TemplateNormalizationFunc,
  inferred?: { dataType?: DataType; format?: Format | undefined },
): Column {
  const effectiveDataType = column.dataType ?? inferred?.dataType;
  const dataTypeDefault = defaultColumnPropertiesByDataType[
    effectiveDataType ?? defaultColumnProperties.dataType
  ];

  const effectiveFormat = column.format ?? inferred?.format;

  const caption = captionize(column.name);

  const colWithDefaults = {
    ...defaultColumnProperties,
    ...dataTypeDefault,
    ...effectiveDataType && { dataType: effectiveDataType },
    ...effectiveFormat !== undefined && { format: effectiveFormat },
    caption,
    ...column,
  };

  return {
    ...colWithDefaults,
    calculateDisplayValue: isString(colWithDefaults.calculateDisplayValue)
      ? compileGetter(colWithDefaults.calculateDisplayValue) as (data: unknown) => string
      : colWithDefaults.calculateDisplayValue,
    headerItemTemplate: templateNormalizationFunc(colWithDefaults.headerItemTemplate),
    fieldTemplate: templateNormalizationFunc(colWithDefaults.fieldTemplate),
    captionTemplate: templateNormalizationFunc(colWithDefaults.captionTemplate),
    valueTemplate: templateNormalizationFunc(colWithDefaults.valueTemplate),
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
  firstItemDataTypes?: Record<string, { dataType?: DataType; format: Format | undefined }> | null,
): Column[] {
  const normalizedColumns = columns.map((c) => {
    const inferred = c.name ? firstItemDataTypes?.[c.name] : undefined;
    const column = normalizeColumn(c, templateNormalizationFunc, inferred);

    return column;
  });
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

export const getValueDataType = function (value: unknown): DataType {
  let dataType: string | undefined = type(value);
  if (dataType !== 'string' && dataType !== 'boolean' && dataType !== 'number' && dataType !== 'date' && dataType !== 'object') {
    dataType = undefined;
  }

  return dataType as DataType;
};

export const getColumnFormat = function (column: Partial<Pick<Column, 'format' | 'dataType'>>): Format | undefined {
  if (column.format) {
    return column.format;
  }

  if (column.dataType === 'date' || column.dataType === 'datetime') {
    return 'shortDate';
  }

  return undefined;
};

export function generateColumns(
  firstItem: DataObject | Record<string, unknown>,
): string[] {
  if (!firstItem) { return []; }

  return Object.keys(firstItem);
}
