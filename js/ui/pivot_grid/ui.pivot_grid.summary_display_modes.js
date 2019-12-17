import { isFunction, isDefined, isObject } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { inArray } from '../../core/utils/array';
import { findField, foreachTree, setFieldProperty } from './ui.pivot_grid.utils';

const COLUMN = 'column';
const ROW = 'row';
const NULL = null;

const calculatePercentValue = function(value, totalValue) {
    let result = value / totalValue;
    if(!isDefined(value) || isNaN(result)) {
        result = NULL;
    }
    return result;
};

const percentOfGrandTotal = function(e, dimension) {
    return calculatePercentValue(e.value(), e.grandTotal(dimension).value());
};

const percentOfParent = function(e, dimension) {
    const parent = e.parent(dimension);
    const parentValue = parent ? parent.value() : e.value();

    return calculatePercentValue(e.value(), parentValue);
};

const createAbsoluteVariationExp = function(allowCrossGroup) {
    return function(e) {
        const prevCell = e.prev(COLUMN, allowCrossGroup);
        const prevValue = prevCell && prevCell.value();

        if(isDefined(prevValue) && isDefined(e.value())) {
            return e.value() - prevValue;
        }

        return NULL;
    };
};

const createPercentVariationExp = function(allowCrossGroup) {
    const absoluteExp = createAbsoluteVariationExp(allowCrossGroup);
    return function(e) {
        const absVar = absoluteExp(e);
        const prevCell = e.prev(COLUMN, allowCrossGroup);
        const prevValue = prevCell && prevCell.value();

        return absVar !== NULL && prevValue ? absVar / prevValue : NULL;
    };
};

const summaryDictionary = {
    percentOfColumnTotal: function(e) {
        return percentOfParent(e, ROW);
    },

    percentOfRowTotal: function(e) {
        return percentOfParent(e, COLUMN);
    },

    percentOfColumnGrandTotal: function(e) {
        return percentOfGrandTotal(e, ROW);
    },

    percentOfRowGrandTotal: function(e) {
        return percentOfGrandTotal(e, COLUMN);
    },

    percentOfGrandTotal: function(e) {
        return percentOfGrandTotal(e);
    }
};
var getPrevCellCrossGroup = function(cell, direction) {
    if(!cell || !cell.parent(direction)) {
        return;
    }

    let prevCell = cell.prev(direction);

    if(!prevCell) {
        prevCell = getPrevCellCrossGroup(cell.parent(direction), direction);
    }

    return prevCell;
};

const createRunningTotalExpr = function(field) {
    if(!field.runningTotal) {
        return;
    }
    const direction = field.runningTotal === COLUMN ? ROW : COLUMN;
    return function(e) {
        const prevCell = field.allowCrossGroupCalculation ? getPrevCellCrossGroup(e, direction) : e.prev(direction, false);
        let value = e.value(true);
        const prevValue = prevCell && prevCell.value(true);

        if(isDefined(prevValue) && isDefined(value)) {
            value = prevValue + value;
        } else if(isDefined(prevValue)) {
            value = prevValue;
        }

        return value;
    };
};

function createCache() {
    return {
        fields: {},
        positions: {}
    };
}

function getFieldPos(descriptions, field, cache) {
    let fieldIndex;
    let allFields;
    let fieldParams = {
        index: -1
    };

    if(!isObject(field)) {
        if(cache.fields[field]) {
            field = cache[field];
        } else {
            allFields = descriptions.columns.concat(descriptions.rows).concat(descriptions.values);
            fieldIndex = findField(allFields, field);
            field = cache[field] = allFields[fieldIndex];
        }
    }

    if(field) {
        const area = field.area || 'data';
        fieldParams = cache.positions[field.index] = cache.positions[field.index] || {
            area: area,
            index: inArray(field, descriptions[area === 'data' ? 'values' : area + 's'])
        };
    }

    return fieldParams;
}

function getPathFieldName(dimension) {
    return dimension === ROW ? '_rowPath' : '_columnPath';
}

const SummaryCell = function(columnPath, rowPath, data, descriptions, fieldIndex, fieldsCache) {
    this._columnPath = columnPath;
    this._rowPath = rowPath;
    this._fieldIndex = fieldIndex;
    this._fieldsCache = fieldsCache || createCache();

    this._data = data;
    this._descriptions = descriptions;

    const cell = data.values && data.values[rowPath[0].index] && data.values[rowPath[0].index][columnPath[0].index];

    if(cell) {
        cell.originalCell = cell.originalCell || cell.slice();
        cell.postProcessedFlags = cell.postProcessedFlags || [];
        this._cell = cell;
    }

};
/**
* @name dxPivotGridSummaryCell
* @type object
*/
SummaryCell.prototype = extend(SummaryCell.prototype, {

    _getPath: function(dimension) {
        return this[getPathFieldName(dimension)];
    },

    _getDimension: function(dimension) {
        dimension = dimension === ROW ? 'rows' : 'columns';
        return this._descriptions[dimension];
    },

    _createCell: function(config) {
        const that = this;
        return new SummaryCell(config._columnPath || that._columnPath, config._rowPath || that._rowPath, that._data, that._descriptions, that._fieldIndex);
    },

    /**
    * @name dxPivotGridSummaryCell.parent
    * @publicName parent(direction)
    * @param1 direction:string
    * @return dxPivotGridSummaryCell
    */
    parent: function(direction) {
        const path = this._getPath(direction).slice();
        const config = {};
        path.shift();

        if(path.length) {
            config[getPathFieldName(direction)] = path;
            return this._createCell(config);
        }
        return NULL;
    },

    /**
    * @name dxPivotGridSummaryCell.children
    * @publicName children(direction)
    * @param1 direction:string
    * @return Array<dxPivotGridSummaryCell>
    */
    children: function(direction) {
        const path = this._getPath(direction).slice();
        const item = path[0];
        const result = [];
        const cellConfig = {};

        if(item.children) {
            for(let i = 0; i < item.children.length; i++) {
                cellConfig[getPathFieldName(direction)] = [item.children[i]].concat(path.slice());
                result.push(this._createCell(cellConfig));
            }
        }

        return result;
    },
    /**
    * @name dxPivotGridSummaryCell.grandTotal
    * @publicName grandTotal(direction)
    * @param1 direction:string
    * @return dxPivotGridSummaryCell
    */

    /**
   * @name dxPivotGridSummaryCell.grandTotal
   * @publicName grandTotal()
   * @return dxPivotGridSummaryCell
   */
    grandTotal: function(direction) {
        const config = {};
        const rowPath = this._rowPath;
        const columnPath = this._columnPath;
        const dimensionPath = this._getPath(direction);
        const pathFieldName = getPathFieldName(direction);

        if(!direction) {
            config._rowPath = [rowPath[rowPath.length - 1]];
            config._columnPath = [columnPath[columnPath.length - 1]];
        } else {
            config[pathFieldName] = [dimensionPath[dimensionPath.length - 1]];
        }
        return this._createCell(config);
    },

    /**
    * @name dxPivotGridSummaryCell.next
    * @publicName next(direction)
    * @param1 direction:string
    * @return dxPivotGridSummaryCell
    */

    /**
    * @name dxPivotGridSummaryCell.next
    * @publicName next(direction, allowCrossGroup)
    * @param1 direction:string
    * @param2 allowCrossGroup:bool
    * @return dxPivotGridSummaryCell
    */

    next: function(direction, allowCrossGroup) {
        const currentPath = this._getPath(direction);
        const item = currentPath[0];
        let parent = this.parent(direction);
        let siblings;
        let index;

        if(parent) {
            index = inArray(item, currentPath[1].children);
            siblings = parent.children(direction);

            if(siblings[index + 1]) {
                return siblings[index + 1];
            }
        }

        if(allowCrossGroup && parent) {
            do {
                parent = parent.next(direction, allowCrossGroup);

                siblings = parent ? parent.children(direction) : [];
            } while(parent && !siblings.length);

            return siblings[0] || NULL;
        }

        return NULL;
    },

    /**
    * @name dxPivotGridSummaryCell.prev
    * @publicName prev(direction)
    * @param1 direction:string
    * @return dxPivotGridSummaryCell
    */

    /**
    * @name dxPivotGridSummaryCell.prev
    * @publicName prev(direction, allowCrossGroup)
    * @param1 direction:string
    * @param2 allowCrossGroup:bool
    * @return dxPivotGridSummaryCell
    */

    prev: function(direction, allowCrossGroup) {
        const currentPath = this._getPath(direction);
        const item = currentPath[0];
        let parent = this.parent(direction);
        let siblings;
        let index;

        if(parent) {
            index = inArray(item, currentPath[1].children);
            siblings = parent.children(direction);

            if(siblings[index - 1]) {
                return siblings[index - 1];
            }
        }

        if(allowCrossGroup && parent) {
            do {
                parent = parent.prev(direction, allowCrossGroup);

                siblings = parent ? parent.children(direction) : [];
            } while(parent && !siblings.length);

            return siblings[siblings.length - 1] || NULL;
        }

        return NULL;
    },

    cell: function() {
        return this._cell;
    },

    /**
    * @name dxPivotGridSummaryCell.field
    * @publicName field(area)
    * @param1 area:string
    * @return PivotGridDataSourceOptions.fields
    */

    field: function(area) {
        if(area === 'data') {
            return this._descriptions.values[this._fieldIndex];
        }
        const path = this._getPath(area);
        const descriptions = this._getDimension(area);
        const field = descriptions[path.length - 2];

        return field || NULL;
    },

    /**
    * @name dxPivotGridSummaryCell.child
    * @publicName child(direction, fieldValue)
    * @param1 direction:string
    * @param2 fieldValue:number|string
    * @return dxPivotGridSummaryCell
    */
    child: function(direction, fieldValue) {
        const children = this.children(direction);
        let childLevelField;
        for(let i = 0; i < children.length; i++) {
            childLevelField = childLevelField || children[i].field(direction);
            if(children[i].value(childLevelField) === fieldValue) {
                return children[i];
            }
        }
        return NULL;
    },


    /**
   * @name dxPivotGridSummaryCell.slice
   * @publicName slice(field, value)
   * @param1 field:PivotGridDataSourceOptions.fields
   * @param2 value:number|string
   * @return dxPivotGridSummaryCell
   */
    slice: function(field, value) {
        const that = this;
        const config = {};
        const fieldPos = getFieldPos(this._descriptions, field, this._fieldsCache);
        const area = fieldPos.area;
        const fieldIndex = fieldPos.index;
        let childItems;
        let path;
        let currentValue;
        let level;
        let sliceCell = NULL;
        const newPath = [];

        if(area === ROW || area === COLUMN) {
            path = this._getPath(area).slice();
            level = fieldIndex !== -1 && (path.length - 2 - fieldIndex);

            if(path[level]) {
                newPath[path.length - 1] = path[path.length - 1];
                for(let i = level; i >= 0; i--) {
                    if(path[i + 1]) {
                        childItems = path[i + 1].children || [];
                        currentValue = i === level ? value : path[i].value;
                        path[i] = undefined;

                        for(let childIndex = 0; childIndex < childItems.length; childIndex++) {
                            if(childItems[childIndex].value === currentValue) {
                                path[i] = childItems[childIndex];
                                break;
                            }
                        }
                    }
                    if(path[i] === undefined) {
                        return sliceCell;
                    }
                }

                config[getPathFieldName(area)] = path;
                sliceCell = that._createCell(config);
            }
        }

        return sliceCell;
    },

    /**
   * @name dxPivotGridSummaryCell.value
   * @publicName value()
   * @return any
   */
    /**
  * @name dxPivotGridSummaryCell.value
  * @publicName value(postProcessed)
  * @param1 postProcessed:boolean
  * @return any
  */
    /**
   * @name dxPivotGridSummaryCell.value
   * @publicName value(field)
   * @param1 field:PivotGridDataSourceOptions.fields|string
   * @return any
   */
    /**
  * @name dxPivotGridSummaryCell.value
  * @publicName value(field, postProcessed)
  * @param1 field:PivotGridDataSourceOptions.fields|string
  * @param2 postProcessed:boolean
  * @return any
  */
    value: function(arg1, arg2) {
        const cell = this._cell;
        let fieldIndex = this._fieldIndex;
        const fistArgIsBoolean = arg1 === true || arg1 === false;
        let path;
        const field = !fistArgIsBoolean ? arg1 : NULL;
        const needCalculatedValue = fistArgIsBoolean && arg1 || arg2;
        let level;

        if(isDefined(field)) {
            const fieldPos = getFieldPos(this._descriptions, field, this._fieldsCache);
            fieldIndex = fieldPos.index;

            if(fieldPos.area !== 'data') {
                path = this._getPath(fieldPos.area);
                level = fieldIndex !== -1 && (path.length - 2 - fieldIndex);

                return path[level] && path[level].value;
            }
        }

        if(cell && cell.originalCell) {
            return needCalculatedValue ? cell[fieldIndex] : cell.originalCell[fieldIndex];
        }

        return NULL;
    },

    /**
    * @name dxPivotGridSummaryCell.isPostProcessed
    * @publicName isPostProcessed(field)
    * @param1 field:PivotGridDataSourceOptions.fields|string
    * @return boolean
    */
    isPostProcessed(field) {
        let fieldIndex = this._fieldIndex;
        if(isDefined(field)) {
            const fieldPos = getFieldPos(this._descriptions, field, this._fieldsCache);
            fieldIndex = fieldPos.index;

            if(fieldPos.area !== 'data') {
                return false;
            }
        }
        return !!(this._cell && this._cell.postProcessedFlags[fieldIndex]);
    }
});

function getExpression(field) {
    const summaryDisplayMode = field.summaryDisplayMode;
    const crossGroupCalculation = field.allowCrossGroupCalculation;
    let expression = NULL;

    if(isFunction(field.calculateSummaryValue)) {
        expression = field.calculateSummaryValue;
    } else if(summaryDisplayMode) {
        if(summaryDisplayMode === 'absoluteVariation') {
            expression = createAbsoluteVariationExp(crossGroupCalculation);
        } else if(summaryDisplayMode === 'percentVariation') {
            expression = createPercentVariationExp(crossGroupCalculation);
        } else {
            expression = summaryDictionary[summaryDisplayMode];
        }

        if(expression && !field.format && summaryDisplayMode.indexOf('percent') !== -1) {
            setFieldProperty(field, 'format', 'percent');
        }
    }
    return expression;
}

function processDataCell(data, rowIndex, columnIndex, isRunningTotalCalculation) {
    const values = data.values[rowIndex][columnIndex] = data.values[rowIndex][columnIndex] || [];
    const originalCell = values.originalCell;

    if(!originalCell) {
        return;
    }
    // T571071
    if(values.allowResetting || !isRunningTotalCalculation) {
        data.values[rowIndex][columnIndex] = originalCell.slice();
    }

    data.values[rowIndex][columnIndex].allowResetting = isRunningTotalCalculation;
}

exports.applyDisplaySummaryMode = function(descriptions, data) {
    const expressions = [];
    const columnElements = [{ index: data.grandTotalColumnIndex, children: data.columns }];
    const rowElements = [{ index: data.grandTotalRowIndex, children: data.rows }];
    const valueFields = descriptions.values;
    const fieldsCache = createCache();

    data.values = data.values || [];

    foreachTree(rowElements, function(rowPath) {
        const rowItem = rowPath[0];

        rowItem.isEmpty = [];

        data.values[rowItem.index] = data.values[rowItem.index] || [];

        foreachTree(columnElements, function(columnPath) {
            const columnItem = columnPath[0];
            let expression;
            let expressionArg;
            let cell;
            let field;
            let isEmptyCell;
            let value;

            columnItem.isEmpty = columnItem.isEmpty || [];

            processDataCell(data, rowItem.index, columnItem.index, false);

            for(let i = 0; i < valueFields.length; i++) {
                field = valueFields[i];
                expression = expressions[i] = (expressions[i] === undefined ? getExpression(field) : expressions[i]);
                isEmptyCell = false;
                if(expression) {
                    expressionArg = new SummaryCell(columnPath, rowPath, data, descriptions, i, fieldsCache);
                    cell = expressionArg.cell();
                    value = cell[i] = expression(expressionArg);
                    cell.postProcessedFlags[i] = true;
                    isEmptyCell = value === null || value === undefined;
                }
                if(columnItem.isEmpty[i] === undefined) {
                    columnItem.isEmpty[i] = true;
                }
                if(rowItem.isEmpty[i] === undefined) {
                    rowItem.isEmpty[i] = true;
                }
                if(!isEmptyCell) {
                    rowItem.isEmpty[i] = columnItem.isEmpty[i] = false;
                }
            }
        }, false);
    }, false);

    data.isEmptyGrandTotalRow = rowElements[0].isEmpty;
    data.isEmptyGrandTotalColumn = columnElements[0].isEmpty;
};

exports.applyRunningTotal = function(descriptions, data) {
    const expressions = [];
    const columnElements = [{ index: data.grandTotalColumnIndex, children: data.columns }];
    const rowElements = [{ index: data.grandTotalRowIndex, children: data.rows }];
    const valueFields = descriptions.values;
    const fieldsCache = createCache();

    data.values = data.values || [];

    foreachTree(rowElements, function(rowPath) {
        const rowItem = rowPath[0];
        data.values[rowItem.index] = data.values[rowItem.index] || [];

        foreachTree(columnElements, function(columnPath) {
            const columnItem = columnPath[0];
            let expression;
            let expressionArg;
            let cell;
            let field;

            processDataCell(data, rowItem.index, columnItem.index, true);

            for(let i = 0; i < valueFields.length; i++) {
                field = valueFields[i];
                expression = expressions[i] = (expressions[i] === undefined ? createRunningTotalExpr(field) : expressions[i]);

                if(expression) {
                    expressionArg = new SummaryCell(columnPath, rowPath, data, descriptions, i, fieldsCache);
                    cell = expressionArg.cell();
                    cell[i] = expression(expressionArg);
                    cell.postProcessedFlags[i] = true;
                }
            }
        }, false);
    }, false);
};

exports.createMockSummaryCell = function(descriptions, fields, indices) {
    const summaryCell = new SummaryCell([], [], {}, descriptions, 0);
    summaryCell.value = function(fieldId) {
        if(isDefined(fieldId)) {
            const index = findField(fields, fieldId);
            const field = fields[index];
            if(!indices[index] && field && !isDefined(field.area)) {
                descriptions.values.push(field);
                indices[index] = true;
            }
        }
    };
    summaryCell.grandTotal = function() {
        return this;
    };
    summaryCell.children = function() {
        return [];
    };

    return summaryCell;
};
///#DEBUG
exports.Cell = SummaryCell;
exports.summaryDictionary = summaryDictionary;
exports.getExpression = getExpression;
///#ENDDEBUG
