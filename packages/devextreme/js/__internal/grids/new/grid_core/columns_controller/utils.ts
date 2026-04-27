import type { DataType, Format } from '@js/common';
import dateLocalization from '@js/common/core/localization/date';
import { compileGetter, getPathParts } from '@js/core/utils/data';
import { captionize } from '@js/core/utils/inflector';
import {
  isDefined,
  isString, type,
} from '@js/core/utils/type';
import { getGlobalFormatByDataType } from '@ts/core/m_global_format_config';
import { getTreeNodeByPath, setTreeNodeByPath } from '@ts/grids/new/grid_core/utils/tree/index';
import type { ComponentType } from 'inferno';

import type { DataObject } from '../data_controller/types';
import type { Template } from '../types';
import type { ColumnProperties, ColumnSettings, PreNormalizedColumn } from './options';
import { defaultColumnProperties, defaultColumnPropertiesByDataType } from './options';
import type { Column, ColumnFromDataOptions, ColumnsConfigurationFromData } from './types';

type TemplateNormalizationFunc = <T>(
  template: Template<T> | undefined,
) => ComponentType<T> | undefined;

const getGlobalFormat = (
  dataType: 'date' | 'datetime',
): Format | undefined => {
  const globalFormat = getGlobalFormatByDataType(dataType);

  if (!globalFormat) {
    return undefined;
  }

  if (isString(globalFormat)) {
    return (
      (value: Date | string | number) => {
        const dateValue = value instanceof Date ? value : new Date(value);

        return isNaN(dateValue.getTime())
          ? ''
          : dateLocalization.format(dateValue, globalFormat) as string;
      }
    ) as unknown as Format;
  }

  return globalFormat as Format;
};

const getGlobalColumnFormat = (
  dataType: DataType | undefined,
): Format | undefined => {
  if (dataType === 'date' || dataType === 'datetime') {
    return getGlobalFormat(dataType);
  }

  return undefined;
};

export function normalizeColumn(
  column: PreNormalizedColumn,
  templateNormalizationFunc?: TemplateNormalizationFunc,
  columnFromDataOptions?: ColumnFromDataOptions,
): Column {
  const dataType = column.dataType
    ?? columnFromDataOptions?.dataType
    ?? defaultColumnProperties.dataType;
  const columnDataTypeDefaultOptions = defaultColumnPropertiesByDataType[dataType];
  const shouldUseInferredFormat = column.dataType === undefined
    || columnFromDataOptions?.dataType === dataType;
  const columnFormat = column.format
    ?? (shouldUseInferredFormat ? columnFromDataOptions?.format : undefined)
    ?? getGlobalColumnFormat(dataType)
    ?? columnDataTypeDefaultOptions?.format;
  const caption = captionize(column.name);

  const colWithDefaults = {
    ...defaultColumnProperties,
    ...columnDataTypeDefaultOptions,
    caption,
    ...column,
  };

  const normalizedColumn: Column = {
    ...colWithDefaults,
    dataType,
    ...!!columnFormat && { format: columnFormat },
    calculateDisplayValue: isString(colWithDefaults.calculateDisplayValue)
      ? compileGetter(colWithDefaults.calculateDisplayValue) as (data: unknown) => string
      : colWithDefaults.calculateDisplayValue,
    headerItemTemplate: templateNormalizationFunc?.(colWithDefaults.headerItemTemplate),
    fieldTemplate: templateNormalizationFunc?.(colWithDefaults.fieldTemplate),
    fieldCaptionTemplate: templateNormalizationFunc?.(colWithDefaults.fieldCaptionTemplate),
    fieldValueTemplate: templateNormalizationFunc?.(colWithDefaults.fieldValueTemplate),
    // @ts-expect-error for compatibility
    calculateCellValue: colWithDefaults.calculateFieldValue,
    allowFiltering: colWithDefaults.allowFiltering ?? !!colWithDefaults.dataField,
    allowHeaderFiltering:
      colWithDefaults.allowHeaderFiltering
      ?? colWithDefaults.allowFiltering
      ?? !!colWithDefaults.dataField,
    allowSearch:
      colWithDefaults.allowSearch
      ?? colWithDefaults.allowFiltering
      ?? !!colWithDefaults.dataField,
    allowSorting: colWithDefaults.allowSorting ?? !!colWithDefaults.dataField,
  };

  normalizedColumn.selector ??= (data): unknown => normalizedColumn.calculateFieldValue(data);

  return normalizedColumn;
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

export function normalizeColumnsVisibleIndexes(
  columns: PreNormalizedColumn[],
  forceIndex?: number,
): PreNormalizedColumn[] {
  const result = [...columns];

  const visibleIndexes = normalizeVisibleIndexes(
    columns.map((c) => c.visibleIndex),
    forceIndex,
  );

  visibleIndexes.forEach((visibleIndex, i) => {
    result[i].visibleIndex = visibleIndex;
  });

  return result;
}

export function normalizeColumns(
  columns: PreNormalizedColumn[],
  templateNormalizationFunc: TemplateNormalizationFunc,
  columnsFromData?: Record<string, ColumnFromDataOptions>,
): Column[] {
  return columns.map((col) => {
    const columnFromDataOptions = columnsFromData?.[col.name];

    return normalizeColumn(col, templateNormalizationFunc, columnFromDataOptions);
  });
}

export function preNormalizeColumns(columns: ColumnProperties[]): PreNormalizedColumn[] {
  const normalizedColumns = columns?.map((column): ColumnSettings => {
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
    normalizedColumns?.map((c) => c.visibleIndex),
  );

  normalizedColumns?.forEach((_, i) => {
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

export const getValueDataType = (
  value: unknown,
): DataType | undefined => {
  const dataType: string | undefined = type(value);
  const isUnknownDataType = dataType !== 'string'
    && dataType !== 'boolean'
    && dataType !== 'number'
    && dataType !== 'date'
    && dataType !== 'object';

  return isUnknownDataType
    ? undefined
    : dataType as DataType;
};

export const getColumnFormat = (
  column: Partial<Pick<Column, 'format' | 'dataType'>>,
): Format | undefined => {
  if (column.format) {
    return column.format;
  }

  if (column.dataType === 'date') {
    return getGlobalFormat('date') || 'shortDate';
  }

  if (column.dataType === 'datetime') {
    return getGlobalFormat('datetime') || 'shortDateShortTime';
  }

  return undefined;
};

export const getColumnOptionsFromDataItem = (
  dataItem: DataObject,
): ColumnsConfigurationFromData => {
  const dataFields = Object.keys(dataItem);

  return {
    dataFields,
    columns: Object.entries(dataItem).reduce<Record<string, ColumnFromDataOptions>>((
      result,
      [key, value],
    ) => {
      const dataType = getValueDataType(value);
      const format = getColumnFormat({ dataType });
      result[key] = { dataType, format };
      return result;
    }, {}),
  };
};

export const columnOptionUpdate = (
  settings: PreNormalizedColumn[],
  columnIdx: number,
  updatePath: string,
  value: unknown,
): PreNormalizedColumn[] => {
  const newSettings = [...settings];
  const updatePathParts = getPathParts(updatePath);

  const columnTreeNode = getTreeNodeByPath(newSettings[columnIdx], updatePathParts);

  if (columnTreeNode === value) {
    return settings;
  }

  newSettings[columnIdx] = setTreeNodeByPath(settings[columnIdx], value, updatePathParts);

  return normalizeColumnsVisibleIndexes(newSettings, columnIdx);
};

export function addDataFieldToComputedColumns(columns: Column[]): Column[] {
  return columns.map((column) => {
    if (column.dataField) {
      return column;
    }

    // NOTE: same logic in datagrid
    return {
      ...column,
      dataField: column.name,
    };
  });
}
