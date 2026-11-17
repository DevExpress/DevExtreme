import { isDefined, isFunction, isObject } from '@js/core/utils/type';
import type { PivotGridSummaryDisplayMode } from '@js/ui/pivot_grid/data_source';
import pivotGridUtils, { findField, foreachTree } from '@ts/grids/pivot_grid/m_widget_utils';
import type { PivotGridDescriptions, PivotGridField } from '@ts/grids/pivot_grid/types';

import type {
  SummaryCellData,
  SummaryCellPaths,
  SummaryData,
  SummaryDataCell,
  SummaryExpression,
  SummaryFieldId,
  SummaryFieldPosition,
  SummaryFieldsCache,
  SummaryHeaderItem,
} from './types';

const COLUMN = 'column';
const ROW = 'row';

const calculatePercentValue = function calculatePercentValue(
  value: unknown,
  totalValue: unknown,
): number | null {
  const result = Number(value) / Number(totalValue);
  if (!isDefined(value) || isNaN(result)) {
    return null;
  }
  return result;
};

const percentOfGrandTotal = function percentOfGrandTotal(
  e: SummaryCell,
  dimension?: string,
): number | null {
  return calculatePercentValue(e.value(), e.grandTotal(dimension).value());
};

const percentOfParent = function percentOfParent(
  e: SummaryCell,
  dimension: string,
): number | null {
  const parent = e.parent(dimension);
  const parentValue = parent ? parent.value() : e.value();

  return calculatePercentValue(e.value(), parentValue);
};

const createAbsoluteVariationExp = function createAbsoluteVariationExp(
  allowCrossGroup: boolean | undefined,
): (e: SummaryCell) => number | null {
  return function absoluteVariation(e: SummaryCell): number | null {
    const prevCell = e.prev(COLUMN, allowCrossGroup);
    const prevValue = prevCell?.value();

    if (isDefined(prevValue) && isDefined(e.value())) {
      return Number(e.value()) - Number(prevValue);
    }

    return null;
  };
};

const createPercentVariationExp = function createPercentVariationExp(
  allowCrossGroup: boolean | undefined,
): (e: SummaryCell) => number | null {
  const absoluteExp = createAbsoluteVariationExp(allowCrossGroup);
  return function percentVariation(e: SummaryCell): number | null {
    const absVar = absoluteExp(e);
    const prevCell = e.prev(COLUMN, allowCrossGroup);
    const prevValue = prevCell?.value();

    return absVar !== null && prevValue ? absVar / Number(prevValue) : null;
  };
};

const summaryDictionary: Partial<Record<PivotGridSummaryDisplayMode, SummaryExpression>> = {
  percentOfColumnTotal(e: SummaryCell): number | null {
    return percentOfParent(e, ROW);
  },

  percentOfRowTotal(e: SummaryCell): number | null {
    return percentOfParent(e, COLUMN);
  },

  percentOfColumnGrandTotal(e: SummaryCell): number | null {
    return percentOfGrandTotal(e, ROW);
  },

  percentOfRowGrandTotal(e: SummaryCell): number | null {
    return percentOfGrandTotal(e, COLUMN);
  },

  percentOfGrandTotal(e: SummaryCell): number | null {
    return percentOfGrandTotal(e);
  },
};
const getPrevCellCrossGroup = function getPrevCellCrossGroup(
  cell: SummaryCell | null | undefined,
  direction: string,
): SummaryCell | null | undefined {
  if (!cell?.parent(direction)) {
    return undefined;
  }

  const prevCell = cell.prev(direction);

  return prevCell ?? getPrevCellCrossGroup(cell.parent(direction), direction);
};

const createRunningTotalExpr = (field: PivotGridField): SummaryExpression | undefined => {
  if (!field.runningTotal) {
    return undefined;
  }

  const direction = field.runningTotal === COLUMN ? ROW : COLUMN;

  return (e: SummaryCell): unknown => {
    const prevCell = field.allowCrossGroupCalculation
      ? getPrevCellCrossGroup(e, direction)
      : e.prev(direction, false);

    const calculatedValue = e.value(true);
    const originalValue = e.value(false);
    const prevCalculatedValue = prevCell?.value(true);

    switch (true) {
      case isDefined(calculatedValue) && isDefined(originalValue) && isDefined(prevCalculatedValue):
        // @ts-expect-error summary values are unknown, + also joins strings
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands -- values are unknown
        return prevCalculatedValue + calculatedValue;
      case isDefined(prevCalculatedValue):
        return prevCalculatedValue;
      default:
        return calculatedValue;
    }
  };
};

function createCache(): SummaryFieldsCache {
  return {
    fields: {},
    positions: {},
  };
}

function getFieldPos(
  descriptions: PivotGridDescriptions,
  field: SummaryFieldId,
  cache: SummaryFieldsCache,
): SummaryFieldPosition {
  let fieldParams: SummaryFieldPosition = {
    index: -1,
  };
  let fieldObject = isObject(field) ? field : undefined;

  if (!isObject(field)) {
    if (cache.fields[field]) {
      // @ts-expect-error found fields are stored on the cache itself, not in cache.fields
      fieldObject = cache[field];
    } else {
      const allFields = descriptions.columns.concat(descriptions.rows).concat(descriptions.values);
      const fieldIndex = findField(allFields, field);
      fieldObject = allFields[fieldIndex];
      cache[field] = fieldObject;
    }
  }

  if (fieldObject) {
    const area = fieldObject.area ?? 'data';
    const positionKey = String(fieldObject.index);
    const descriptionName: keyof PivotGridDescriptions = area === 'data' ? 'values' : `${area}s`;
    fieldParams = cache.positions[positionKey] || {
      area,
      index: descriptions[descriptionName].indexOf(fieldObject),
    };
    cache.positions[positionKey] = fieldParams;
  }

  return fieldParams;
}

function getPathFieldName(dimension?: string): '_rowPath' | '_columnPath' {
  return dimension === ROW ? '_rowPath' : '_columnPath';
}

class SummaryCell {
  private readonly _columnPath: SummaryHeaderItem[];

  private readonly _rowPath: SummaryHeaderItem[];

  private readonly _fieldIndex: number;

  private readonly _fieldsCache: SummaryFieldsCache;

  private readonly _data: SummaryCellData;

  private readonly _descriptions: PivotGridDescriptions;

  private readonly _cell?: SummaryDataCell;

  constructor(
    columnPath: SummaryHeaderItem[],
    rowPath: SummaryHeaderItem[],
    data: SummaryCellData,
    descriptions: PivotGridDescriptions,
    fieldIndex: number,
    fieldsCache?: SummaryFieldsCache,
  ) {
    this._columnPath = columnPath;
    this._rowPath = rowPath;
    this._fieldIndex = fieldIndex;
    this._fieldsCache = fieldsCache ?? createCache();
    this._data = data;
    this._descriptions = descriptions;

    const cell = data.values?.[rowPath[0].index]?.[columnPath[0].index];

    if (cell) {
      cell.originalCell ??= cell.slice();
      cell.postProcessedFlags ??= [];
      this._cell = cell;
    }
  }

  private _getPath(dimension?: string): SummaryHeaderItem[] {
    return this[getPathFieldName(dimension)];
  }

  private _getDimension(dimension: string): PivotGridField[] {
    const dimensionName = dimension === ROW ? 'rows' : 'columns';
    return this._descriptions[dimensionName];
  }

  private _createCell(config: SummaryCellPaths): SummaryCell {
    return new SummaryCell(
      config._columnPath ?? this._columnPath,
      config._rowPath ?? this._rowPath,
      this._data,
      this._descriptions,
      this._fieldIndex,
    );
  }

  public parent(direction: string): SummaryCell | null {
    const path = this._getPath(direction).slice();
    const config: SummaryCellPaths = {};
    path.shift();

    if (path.length) {
      config[getPathFieldName(direction)] = path;
      return this._createCell(config);
    }
    return null;
  }

  public children(direction: string): SummaryCell[] {
    const path = this._getPath(direction).slice();
    const item = path[0];
    const result: SummaryCell[] = [];
    const cellConfig: SummaryCellPaths = {};

    if (item.children) {
      for (const child of item.children) {
        cellConfig[getPathFieldName(direction)] = [child].concat(path.slice());
        result.push(this._createCell(cellConfig));
      }
    }

    return result;
  }

  public grandTotal(direction?: string): SummaryCell {
    const config: SummaryCellPaths = {};

    if (!direction) {
      config._rowPath = this._rowPath.slice(-1);
      config._columnPath = this._columnPath.slice(-1);
    } else {
      const pathFieldName = getPathFieldName(direction);
      config[pathFieldName] = this._getPath(direction).slice(-1);
    }
    return this._createCell(config);
  }

  public next(direction: string, allowCrossGroup?: boolean): SummaryCell | null {
    const currentPath = this._getPath(direction);
    const item = currentPath[0];
    let parent = this.parent(direction);
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in both branches
    let siblings: SummaryCell[];

    if (parent && currentPath[1].children) {
      const index = currentPath[1].children.indexOf(item);
      siblings = parent.children(direction);

      if (siblings[index + 1]) {
        return siblings[index + 1];
      }
    }

    if (allowCrossGroup && parent) {
      do {
        parent = parent.next(direction, allowCrossGroup);

        siblings = parent ? parent.children(direction) : [];
      } while (parent && !siblings.length);

      return siblings[0] || null;
    }

    return null;
  }

  public prev(direction: string, allowCrossGroup?: boolean): SummaryCell | null {
    const currentPath = this._getPath(direction);
    const item = currentPath[0];
    let parent = this.parent(direction);
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in both branches
    let siblings: SummaryCell[];

    if (parent && currentPath[1].children) {
      const index = currentPath[1].children.indexOf(item);
      siblings = parent.children(direction);

      if (siblings[index - 1]) {
        return siblings[index - 1];
      }
    }

    if (allowCrossGroup && parent) {
      do {
        parent = parent.prev(direction, allowCrossGroup);

        siblings = parent ? parent.children(direction) : [];
      } while (parent && !siblings.length);

      return siblings[siblings.length - 1] || null;
    }

    return null;
  }

  public cell(): SummaryDataCell | undefined {
    return this._cell;
  }

  public field(area: string): PivotGridField | null {
    if (area === 'data') {
      return this._descriptions.values[this._fieldIndex];
    }
    const path = this._getPath(area);
    const descriptions = this._getDimension(area);
    const field = descriptions[path.length - 2];

    return field || null;
  }

  public child(direction: string, fieldValue: unknown): SummaryCell | null {
    const children = this.children(direction);
    const childLevelField = children[0]?.field(direction);
    for (const child of children) {
      if (child.value(childLevelField) === fieldValue) {
        return child;
      }
    }
    return null;
  }

  public slice(field: SummaryFieldId, value: unknown): SummaryCell | null {
    const config: SummaryCellPaths = {};
    const { area, index: fieldIndex } = getFieldPos(this._descriptions, field, this._fieldsCache);
    const newPath: SummaryHeaderItem[] = [];

    if (area !== ROW && area !== COLUMN) {
      return null;
    }

    const path = this._getPath(area).slice();
    const level = fieldIndex !== -1 && (path.length - 2 - fieldIndex);

    if (level === false || !path[level]) {
      return null;
    }

    newPath[path.length - 1] = path[path.length - 1];
    for (let i = level; i >= 0; i -= 1) {
      const parentItem: SummaryHeaderItem | undefined = path[i + 1];
      if (parentItem) {
        const childItems = parentItem.children ?? [];
        const currentValue = i === level ? value : path[i].value;
        const childItem = childItems.find((item) => item.value === currentValue);

        if (!childItem) {
          return null;
        }
        path[i] = childItem;
      }
      if (path[i] === undefined) {
        return null;
      }
    }

    config[getPathFieldName(area)] = path;
    return this._createCell(config);
  }

  public value(arg1?: boolean | SummaryFieldId | null, arg2?: boolean): unknown {
    const cell = this._cell;
    let fieldIndex = this._fieldIndex;
    const fistArgIsBoolean = arg1 === true || arg1 === false;
    const field = !fistArgIsBoolean ? arg1 : null;
    const needCalculatedValue = (fistArgIsBoolean && arg1) || arg2;

    if (isDefined(field)) {
      const fieldPos = getFieldPos(this._descriptions, field, this._fieldsCache);
      fieldIndex = fieldPos.index;

      if (fieldPos.area !== 'data') {
        const path = this._getPath(fieldPos.area);
        const level = fieldIndex !== -1 && (path.length - 2 - fieldIndex);

        return level === false ? undefined : path[level]?.value;
      }
    }

    if (cell?.originalCell) {
      return needCalculatedValue ? cell[fieldIndex] : cell.originalCell[fieldIndex];
    }

    return null;
  }

  public isPostProcessed(field?: SummaryFieldId | null): boolean {
    let fieldIndex = this._fieldIndex;
    if (isDefined(field)) {
      const fieldPos = getFieldPos(this._descriptions, field, this._fieldsCache);
      fieldIndex = fieldPos.index;

      if (fieldPos.area !== 'data') {
        return false;
      }
    }
    return !!this._cell?.postProcessedFlags?.[fieldIndex];
  }
}

function getExpression(field: PivotGridField): SummaryExpression | null | undefined {
  const { summaryDisplayMode, allowCrossGroupCalculation } = field;
  let expression: SummaryExpression | null | undefined = null;

  if (isFunction(field.calculateSummaryValue)) {
    // @ts-expect-error SummaryCell returns null where dxPivotGridSummaryCell says it does not
    expression = field.calculateSummaryValue;
  } else if (summaryDisplayMode) {
    if (summaryDisplayMode === 'absoluteVariation') {
      expression = createAbsoluteVariationExp(allowCrossGroupCalculation);
    } else if (summaryDisplayMode === 'percentVariation') {
      expression = createPercentVariationExp(allowCrossGroupCalculation);
    } else {
      expression = summaryDictionary[summaryDisplayMode];
    }

    if (expression && !field.format && summaryDisplayMode.includes('percent')) {
      pivotGridUtils.setFieldProperty(field, 'format', 'percent');
    }
  }
  return expression;
}

function processDataCell(
  data: SummaryData,
  rowIndex: number,
  columnIndex: number,
  isRunningTotalCalculation: boolean,
): void {
  data.values[rowIndex][columnIndex] = data.values[rowIndex][columnIndex] || [];
  const values = data.values[rowIndex][columnIndex];
  const { originalCell } = values;

  if (!originalCell) {
    return;
  }
  // T571071
  if (values.allowResetting || !isRunningTotalCalculation) {
    data.values[rowIndex][columnIndex] = originalCell.slice();
  }

  data.values[rowIndex][columnIndex].allowResetting = isRunningTotalCalculation;
}

function applyDisplaySummaryMode(descriptions: PivotGridDescriptions, data: SummaryData): void {
  const expressions: (SummaryExpression | null | undefined)[] = [];
  const columnElements: SummaryHeaderItem[] = [
    { index: data.grandTotalColumnIndex, children: data.columns },
  ];
  const rowElements: SummaryHeaderItem[] = [
    { index: data.grandTotalRowIndex, children: data.rows },
  ];
  const valueFields = descriptions.values;
  const fieldsCache = createCache();

  data.values = data.values || [];

  foreachTree(columnElements, (columnPath: SummaryHeaderItem[]) => {
    columnPath[0].isEmpty = [];
  }, false);

  foreachTree(rowElements, (rowPath: SummaryHeaderItem[]) => {
    const rowItem = rowPath[0];

    rowItem.isEmpty = [];

    data.values[rowItem.index] = data.values[rowItem.index] || [];

    foreachTree(columnElements, (columnPath: SummaryHeaderItem[]) => {
      const columnItem = columnPath[0];

      processDataCell(data, rowItem.index, columnItem.index, false);

      if (!rowItem.isEmpty || !columnItem.isEmpty) {
        return;
      }

      for (let i = 0; i < valueFields.length; i += 1) {
        const field = valueFields[i];
        if (expressions[i] === undefined) {
          expressions[i] = getExpression(field);
        }
        const expression = expressions[i];
        let isEmptyCell = false;
        if (expression) {
          const expressionArg = new SummaryCell(
            columnPath,
            rowPath,
            data,
            descriptions,
            i,
            fieldsCache,
          );
          const cell = expressionArg.cell();
          if (cell?.postProcessedFlags) {
            const value = expression(expressionArg);
            cell[i] = value;
            cell.postProcessedFlags[i] = true;
            isEmptyCell = value === null || value === undefined;
          }
        }
        columnItem.isEmpty[i] ??= true;
        rowItem.isEmpty[i] ??= true;
        if (!isEmptyCell) {
          columnItem.isEmpty[i] = false;
          rowItem.isEmpty[i] = false;
        }
      }
    }, false);
  }, false);

  data.isEmptyGrandTotalRow = rowElements[0].isEmpty;
  data.isEmptyGrandTotalColumn = columnElements[0].isEmpty;
}

function applyRunningTotal(descriptions: PivotGridDescriptions, data: SummaryData): void {
  const expressions: (SummaryExpression | undefined)[] = [];
  const columnElements: SummaryHeaderItem[] = [
    { index: data.grandTotalColumnIndex, children: data.columns },
  ];
  const rowElements: SummaryHeaderItem[] = [
    { index: data.grandTotalRowIndex, children: data.rows },
  ];
  const valueFields = descriptions.values;
  const fieldsCache = createCache();

  data.values = data.values || [];

  foreachTree(rowElements, (rowPath: SummaryHeaderItem[]) => {
    const rowItem = rowPath[0];
    data.values[rowItem.index] = data.values[rowItem.index] || [];

    foreachTree(columnElements, (columnPath: SummaryHeaderItem[]) => {
      const columnItem = columnPath[0];

      processDataCell(data, rowItem.index, columnItem.index, true);

      for (let i = 0; i < valueFields.length; i += 1) {
        const field = valueFields[i];
        expressions[i] ??= createRunningTotalExpr(field);
        const expression = expressions[i];

        if (expression) {
          const expressionArg = new SummaryCell(
            columnPath,
            rowPath,
            data,
            descriptions,
            i,
            fieldsCache,
          );
          const cell = expressionArg.cell();
          if (cell?.postProcessedFlags) {
            cell[i] = expression(expressionArg);
            cell.postProcessedFlags[i] = true;
          }
        }
      }
    }, false);
  }, false);
}

function createMockSummaryCell(
  descriptions: PivotGridDescriptions,
  fields: PivotGridField[],
  indices: Record<number, boolean>,
): SummaryCell {
  const summaryCell = new SummaryCell([], [], {}, descriptions, 0);
  summaryCell.value = function value(fieldId?: boolean | SummaryFieldId | null): void {
    if (isDefined(fieldId)) {
      // @ts-expect-error findField() finds nothing for a field object or a boolean
      const index = findField(fields, fieldId);
      const field = fields[index];
      if (!indices[index] && field && !isDefined(field.area)) {
        descriptions.values.push(field);
        indices[index] = true;
      }
    }
  };
  summaryCell.grandTotal = function grandTotal(this: SummaryCell): SummaryCell {
    return this;
  };
  summaryCell.children = function children(): SummaryCell[] {
    return [];
  };

  return summaryCell;
}

export default {
  Cell: SummaryCell,
  summaryDictionary,
  getExpression,
  applyRunningTotal,
  createMockSummaryCell,
  applyDisplaySummaryMode,
};
export {
  applyDisplaySummaryMode,
  applyRunningTotal,
  SummaryCell as Cell,
  createMockSummaryCell,
  getExpression,
  summaryDictionary,
};
