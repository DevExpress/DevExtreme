import { isFunction, isDefined, isObject } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { findField, foreachTree, setFieldProperty } from './ui.pivot_grid.utils';

const COLUMN = 'column';
const ROW = 'row';
const NULL = null;

const calculatePercentValue = function (value, totalValue) {
  let result: any = value / totalValue;
  if (!isDefined(value) || isNaN(result)) {
    result = NULL;
  }
  return result;
};

const percentOfGrandTotal = function (e, dimension?) {
  return calculatePercentValue(e.value(), e.grandTotal(dimension).value());
};

const percentOfParent = function (e, dimension) {
  const parent = e.parent(dimension);
  const parentValue = parent ? parent.value() : e.value();

  return calculatePercentValue(e.value(), parentValue);
};

const createAbsoluteVariationExp = function (allowCrossGroup) {
  return function (e) {
    const prevCell = e.prev(COLUMN, allowCrossGroup);
    const prevValue = prevCell && prevCell.value();

    if (isDefined(prevValue) && isDefined(e.value())) {
      return e.value() - prevValue;
    }

    return NULL;
  };
};

const createPercentVariationExp = function (allowCrossGroup) {
  const absoluteExp = createAbsoluteVariationExp(allowCrossGroup);
  return function (e) {
    const absVar = absoluteExp(e);
    const prevCell = e.prev(COLUMN, allowCrossGroup);
    const prevValue = prevCell && prevCell.value();

    return absVar !== NULL && prevValue ? absVar / prevValue : NULL;
  };
};

const summaryDictionary = {
  percentOfColumnTotal(e) {
    return percentOfParent(e, ROW);
  },

  percentOfRowTotal(e) {
    return percentOfParent(e, COLUMN);
  },

  percentOfColumnGrandTotal(e) {
    return percentOfGrandTotal(e, ROW);
  },

  percentOfRowGrandTotal(e) {
    return percentOfGrandTotal(e, COLUMN);
  },

  percentOfGrandTotal(e) {
    return percentOfGrandTotal(e);
  },
};
const getPrevCellCrossGroup = function (cell, direction) {
  if (!cell || !cell.parent(direction)) {
    return undefined;
  }

  let prevCell = cell.prev(direction);

  if (!prevCell) {
    prevCell = getPrevCellCrossGroup(cell.parent(direction), direction);
  }

  return prevCell;
};

const createRunningTotalExpr = function (field) {
  if (!field.runningTotal) {
    return undefined;
  }
  const direction = field.runningTotal === COLUMN ? ROW : COLUMN;
  return function (e) {
    const prevCell = field.allowCrossGroupCalculation
      ? getPrevCellCrossGroup(e, direction)
      : e.prev(direction, false);
    let value = e.value(true);
    const prevValue = prevCell && prevCell.value(true);

    if (isDefined(prevValue) && isDefined(value)) {
      value = prevValue + value;
    } else if (isDefined(prevValue)) {
      value = prevValue;
    }

    return value;
  };
};

function createCache() {
  return {
    fields: {},
    positions: {},
  };
}

function getFieldPos(descriptions, field, cache) {
  let fieldParams = {
    index: -1,
  };

  if (!isObject(field)) {
    if (cache.fields[field]) {
      field = cache[field];
    } else {
      const allFields = descriptions.columns.concat(descriptions.rows).concat(descriptions.values);
      const fieldIndex = findField(allFields, field);
      field = cache[field] = allFields[fieldIndex];
    }
  }

  if (field) {
    const area = field.area || 'data';
    fieldParams = cache.positions[field.index] = cache.positions[field.index] || {
      area,
      index: descriptions[area === 'data' ? 'values' : `${area}s`].indexOf(field),
    };
  }

  return fieldParams;
}

function getPathFieldName(dimension) {
  return dimension === ROW ? '_rowPath' : '_columnPath';
}

const SummaryCell = function (columnPath, rowPath, data, descriptions, fieldIndex, fieldsCache?) {
  //- @ts-expect-error
  this._columnPath = columnPath;
  //- @ts-expect-error
  this._rowPath = rowPath;
  //- @ts-expect-error
  this._fieldIndex = fieldIndex;
  //- @ts-expect-error
  this._fieldsCache = fieldsCache || createCache();
  //- @ts-expect-error
  this._data = data;
  //- @ts-expect-error
  this._descriptions = descriptions;

  const cell = data.values
    && data.values[rowPath[0].index]
    && data.values[rowPath[0].index][columnPath[0].index];

  if (cell) {
    cell.originalCell = cell.originalCell || cell.slice();
    cell.postProcessedFlags = cell.postProcessedFlags || [];
    //- @ts-expect-error
    this._cell = cell;
  }
};
SummaryCell.prototype = extend(SummaryCell.prototype, {

  _getPath(dimension) {
    return this[getPathFieldName(dimension)];
  },

  _getDimension(dimension) {
    dimension = dimension === ROW ? 'rows' : 'columns';
    return this._descriptions[dimension];
  },

  _createCell(config) {
    const that = this;
    return new SummaryCell(
      config._columnPath || that._columnPath,
      config._rowPath || that._rowPath,
      that._data,
      that._descriptions,
      that._fieldIndex,
    );
  },

  parent(direction) {
    const path = this._getPath(direction).slice();
    const config = {};
    path.shift();

    if (path.length) {
      config[getPathFieldName(direction)] = path;
      return this._createCell(config);
    }
    return NULL;
  },

  children(direction) {
    const path = this._getPath(direction).slice();
    const item = path[0];
    const result = [];
    const cellConfig = {};

    if (item.children) {
      for (let i = 0; i < item.children.length; i += 1) {
        cellConfig[getPathFieldName(direction)] = [item.children[i]].concat(path.slice());
        // @ts-expect-error
        result.push(this._createCell(cellConfig));
      }
    }

    return result;
  },

  grandTotal(direction) {
    const config: any = {};
    const rowPath = this._rowPath;
    const columnPath = this._columnPath;
    const dimensionPath = this._getPath(direction);
    const pathFieldName = getPathFieldName(direction);

    if (!direction) {
      config._rowPath = [rowPath[rowPath.length - 1]];
      config._columnPath = [columnPath[columnPath.length - 1]];
    } else {
      config[pathFieldName] = [dimensionPath[dimensionPath.length - 1]];
    }
    return this._createCell(config);
  },

  next(direction, allowCrossGroup) {
    const currentPath = this._getPath(direction);
    const item = currentPath[0];
    let parent = this.parent(direction);
    let siblings;

    if (parent) {
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

      return siblings[0] || NULL;
    }

    return NULL;
  },

  prev(direction, allowCrossGroup) {
    const currentPath = this._getPath(direction);
    const item = currentPath[0];
    let parent = this.parent(direction);
    let siblings;

    if (parent) {
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

      return siblings[siblings.length - 1] || NULL;
    }

    return NULL;
  },

  cell() {
    return this._cell;
  },

  field(area) {
    if (area === 'data') {
      return this._descriptions.values[this._fieldIndex];
    }
    const path = this._getPath(area);
    const descriptions = this._getDimension(area);
    const field = descriptions[path.length - 2];

    return field || NULL;
  },

  child(direction, fieldValue) {
    let childLevelField;
    const children = this.children(direction);
    for (let i = 0; i < children.length; i += 1) {
      childLevelField = childLevelField || children[i].field(direction);
      if (children[i].value(childLevelField) === fieldValue) {
        return children[i];
      }
    }
    return NULL;
  },

  slice(field, value) {
    const that = this;
    const config = {};
    const fieldPos: any = getFieldPos(this._descriptions, field, this._fieldsCache);
    const { area } = fieldPos;
    const fieldIndex = fieldPos.index;
    let sliceCell = NULL;
    const newPath: any = [];

    if (area === ROW || area === COLUMN) {
      const path = this._getPath(area).slice();
      const level: any = fieldIndex !== -1 && (path.length - 2 - fieldIndex);

      if (path[level]) {
        newPath[path.length - 1] = path[path.length - 1];
        for (let i = level; i >= 0; i -= 1) {
          if (path[i + 1]) {
            const childItems = path[i + 1].children || [];
            const currentValue = i === level ? value : path[i].value;
            path[i] = undefined;

            for (let childIndex = 0; childIndex < childItems.length; childIndex += 1) {
              if (childItems[childIndex].value === currentValue) {
                path[i] = childItems[childIndex];
                break;
              }
            }
          }
          if (path[i] === undefined) {
            return sliceCell;
          }
        }

        config[getPathFieldName(area)] = path;
        sliceCell = that._createCell(config);
      }
    }

    return sliceCell;
  },

  value(arg1, arg2) {
    const cell = this._cell;
    let fieldIndex = this._fieldIndex;
    const fistArgIsBoolean = arg1 === true || arg1 === false;
    const field = !fistArgIsBoolean ? arg1 : NULL;
    const needCalculatedValue = fistArgIsBoolean && arg1 || arg2;

    if (isDefined(field)) {
      const fieldPos: any = getFieldPos(this._descriptions, field, this._fieldsCache);
      fieldIndex = fieldPos.index;

      if (fieldPos.area !== 'data') {
        const path = this._getPath(fieldPos.area);
        const level: any = fieldIndex !== -1 && (path.length - 2 - fieldIndex);

        return path[level] && path[level].value;
      }
    }

    if (cell && cell.originalCell) {
      return needCalculatedValue ? cell[fieldIndex] : cell.originalCell[fieldIndex];
    }

    return NULL;
  },

  isPostProcessed(field) {
    let fieldIndex = this._fieldIndex;
    if (isDefined(field)) {
      const fieldPos: any = getFieldPos(this._descriptions, field, this._fieldsCache);
      fieldIndex = fieldPos.index;

      if (fieldPos.area !== 'data') {
        return false;
      }
    }
    return !!(this._cell && this._cell.postProcessedFlags[fieldIndex]);
  },
});

function getExpression(field) {
  const { summaryDisplayMode } = field;
  const crossGroupCalculation = field.allowCrossGroupCalculation;
  let expression: any = NULL;

  if (isFunction(field.calculateSummaryValue)) {
    expression = field.calculateSummaryValue;
  } else if (summaryDisplayMode) {
    if (summaryDisplayMode === 'absoluteVariation') {
      expression = createAbsoluteVariationExp(crossGroupCalculation);
    } else if (summaryDisplayMode === 'percentVariation') {
      expression = createPercentVariationExp(crossGroupCalculation);
    } else {
      expression = summaryDictionary[summaryDisplayMode];
    }

    if (expression && !field.format && summaryDisplayMode.indexOf('percent') !== -1) {
      setFieldProperty(field, 'format', 'percent');
    }
  }
  return expression;
}

function processDataCell(data, rowIndex, columnIndex, isRunningTotalCalculation) {
  const values = data.values[rowIndex][columnIndex] = data.values[rowIndex][columnIndex] || [];
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

export function applyDisplaySummaryMode(descriptions, data) {
  const expressions: any = [];
  const columnElements: any = [{ index: data.grandTotalColumnIndex, children: data.columns }];
  const rowElements: any = [{ index: data.grandTotalRowIndex, children: data.rows }];
  const valueFields = descriptions.values;
  const fieldsCache = createCache();

  data.values = data.values || [];

  foreachTree(columnElements, (columnPath) => {
    columnPath[0].isEmpty = [];
  }, false);

  foreachTree(rowElements, (rowPath) => {
    const rowItem = rowPath[0];

    rowItem.isEmpty = [];

    data.values[rowItem.index] = data.values[rowItem.index] || [];

    foreachTree(columnElements, (columnPath) => {
      const columnItem = columnPath[0];
      let isEmptyCell;

      processDataCell(data, rowItem.index, columnItem.index, false);

      for (let i = 0; i < valueFields.length; i += 1) {
        const field = valueFields[i];
        const expression = expressions[i] = expressions[i] === undefined
          ? getExpression(field)
          : expressions[i];
        isEmptyCell = false;
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
          const value = cell[i] = expression(expressionArg);
          cell.postProcessedFlags[i] = true;
          isEmptyCell = value === null || value === undefined;
        }
        if (columnItem.isEmpty[i] === undefined) {
          columnItem.isEmpty[i] = true;
        }
        if (rowItem.isEmpty[i] === undefined) {
          rowItem.isEmpty[i] = true;
        }
        if (!isEmptyCell) {
          rowItem.isEmpty[i] = columnItem.isEmpty[i] = false;
        }
      }
    }, false);
  }, false);

  data.isEmptyGrandTotalRow = rowElements[0].isEmpty;
  data.isEmptyGrandTotalColumn = columnElements[0].isEmpty;
}

export function applyRunningTotal(descriptions, data) {
  const expressions: any = [];
  const columnElements = [{ index: data.grandTotalColumnIndex, children: data.columns }];
  const rowElements = [{ index: data.grandTotalRowIndex, children: data.rows }];
  const valueFields = descriptions.values;
  const fieldsCache = createCache();

  data.values = data.values || [];

  foreachTree(rowElements, (rowPath) => {
    const rowItem = rowPath[0];
    data.values[rowItem.index] = data.values[rowItem.index] || [];

    foreachTree(columnElements, (columnPath) => {
      const columnItem = columnPath[0];

      processDataCell(data, rowItem.index, columnItem.index, true);

      for (let i = 0; i < valueFields.length; i += 1) {
        const field = valueFields[i];
        const expression = expressions[i] = expressions[i] === undefined
          ? createRunningTotalExpr(field)
          : expressions[i];

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
          cell[i] = expression(expressionArg);
          cell.postProcessedFlags[i] = true;
        }
      }
    }, false);
  }, false);
}

export function createMockSummaryCell(descriptions, fields, indices) {
  const summaryCell = new SummaryCell([], [], {}, descriptions, 0);
  summaryCell.value = function (fieldId) {
    if (isDefined(fieldId)) {
      const index = findField(fields, fieldId);
      const field = fields[index];
      if (!indices[index] && field && !isDefined(field.area)) {
        descriptions.values.push(field);
        indices[index] = true;
      }
    }
  };
  summaryCell.grandTotal = function () {
    return this;
  };
  summaryCell.children = function () {
    return [];
  };

  return summaryCell;
}

/// #DEBUG
export {
  SummaryCell as Cell,
  summaryDictionary,
  getExpression,
};
/// #ENDDEBUG
