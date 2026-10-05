import type { Format } from '@js/common/core/localization';
import messageLocalization from '@js/common/core/localization/message';
import { DataSource } from '@js/common/data/data_source/data_source';
import { errors as dataErrors } from '@js/common/data/errors';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { compileGetter } from '@js/core/utils/data';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { captionize } from '@js/core/utils/inflector';
import {
  isBoolean, isDefined, isFunction, isNumeric, isString,
} from '@js/core/utils/type';
import formatHelper from '@js/format_helper';
import type { CustomOperation, DataType, Field } from '@js/ui/filter_builder';
import filterUtils from '@js/ui/shared/filtering';
import errors from '@js/ui/widget/ui.errors';
import { getGlobalFormatByDataType } from '@ts/core/global_format_config';

import type { EditorFactoryOwner } from './m_between';
import { getConfig } from './m_between';
import filterOperationsDictionary from './m_filter_operations_dictionary';

type FieldValue = string | number | boolean | Date | null | undefined;
export type ConditionValue = FieldValue | FieldValue[];

export type Criteria = unknown[];
export type Condition = [string, string, ...ConditionValue[]];
type NegationGroup = ['!', Criteria];

export type FilterExpression = ReturnType<NonNullable<CustomOperation['calculateFilterExpression']>>;

type FilterExpressionCallback = (
  filterValue: unknown,
  selectedFilterOperation: string,
  target?: string,
) => FilterExpression;

export interface FilterBuilderField extends Field {
  dataField: string;
  calculateFilterExpression?: FilterExpressionCallback;
  createFilterExpression?: FilterExpressionCallback;
  defaultCalculateFilterExpression: FilterExpressionCallback;
  defaultFilterOperation?: string;
  id?: string;
  parentId?: string;
  lookup?: NonNullable<Field['lookup']> & {
    items?: unknown;
    calculateCellValue?: (value: ConditionValue) => string;
  };
}

export interface FilterCustomOperation extends Omit<CustomOperation, 'name' | 'calculateFilterExpression'> {
  name: string;
  notForLookup?: boolean;
  valueSeparator?: string;
  calculateFilterExpression?: (
    filterValue: unknown,
    field: Field,
    fields?: Field[],
  ) => FilterExpression;
}

type LookupField = FilterBuilderField & {
  lookup: NonNullable<FilterBuilderField['lookup']>;
};

export interface OperationMenuItem {
  icon: string;
  text: string;
  value: string;
  isCustom?: boolean;
}

export interface GroupMenuItem {
  text: string;
  value: string;
}

interface OperationsField {
  dataType?: string;
  defaultFilterOperation?: string;
  filterOperations?: readonly string[] | null;
  lookup?: object | null;
}

const DEFAULT_DATA_TYPE = 'string';
const EMPTY_MENU_ICON = 'icon-none';
const AND_GROUP_OPERATION = 'and';
const EQUAL_OPERATION = '=';
const NOT_EQUAL_OPERATION = '<>';
const DATATYPE_OPERATIONS: Record<string, string[]> = {
  number: ['=', '<>', '<', '>', '<=', '>=', 'isblank', 'isnotblank'],
  string: ['contains', 'notcontains', 'startswith', 'endswith', '=', '<>', 'isblank', 'isnotblank'],
  date: ['=', '<>', '<', '>', '<=', '>=', 'isblank', 'isnotblank'],
  datetime: ['=', '<>', '<', '>', '<=', '>=', 'isblank', 'isnotblank'],
  boolean: ['=', '<>', 'isblank', 'isnotblank'],
  object: ['isblank', 'isnotblank'],
};
const DEFAULT_FORMAT: Partial<Record<DataType, Format>> = {
  date: 'shortDate',
  datetime: 'shortDateShortTime',
};
const LOOKUP_OPERATIONS = ['=', '<>', 'isblank', 'isnotblank'];
const AVAILABLE_FIELD_PROPERTIES = [
  'caption',
  'customizeText',
  'dataField',
  'dataType',
  'editorTemplate',
  'falseText',
  'editorOptions',
  'filterOperations',
  'format',
  'lookup',
  'trueText',
  'calculateFilterExpression',
  'name',
];

const FILTER_BUILDER_CLASS = 'dx-filterbuilder';
const FILTER_BUILDER_ITEM_TEXT_CLASS = `${FILTER_BUILDER_CLASS}-text`;
const FILTER_BUILDER_ITEM_TEXT_PART_CLASS = `${FILTER_BUILDER_ITEM_TEXT_CLASS}-part`;
const FILTER_BUILDER_ITEM_TEXT_SEPARATOR_CLASS = `${FILTER_BUILDER_ITEM_TEXT_CLASS}-separator`;
const FILTER_BUILDER_ITEM_TEXT_SEPARATOR_EMPTY_CLASS = `${FILTER_BUILDER_ITEM_TEXT_SEPARATOR_CLASS}-empty`;

function getDateFormat(dataType: DataType | undefined): Format | undefined {
  if (!dataType) return undefined;
  return getGlobalFormatByDataType(dataType) ?? DEFAULT_FORMAT[dataType];
}

function getFormattedValueText(field: Field, value: FieldValue): string {
  const fieldFormat = field.format ?? getDateFormat(field.dataType);

  if (isBoolean(value)) {
    const trueText = field.trueText ?? messageLocalization.format('dxDataGrid-trueText');
    const falseText = field.falseText ?? messageLocalization.format('dxDataGrid-falseText');

    return value ? trueText : falseText;
  }

  if (field.dataType === 'date' || field.dataType === 'datetime') {
    if (isString(value) || isNumeric(value)) {
      return formatHelper.format(new Date(value), fieldFormat);
    }
  }

  return formatHelper.format(value, fieldFormat);
}

export function isCondition(criteria: unknown): criteria is Condition {
  if (!Array.isArray(criteria)) {
    return false;
  }

  return criteria.length > 1 && !Array.isArray(criteria[0]) && !Array.isArray(criteria[1]);
}

function isNegationGroup(group: Criteria): group is NegationGroup {
  return group
    && group.length > 1
    && group[0] === '!'
    && !isCondition(group);
}

export function getGroupCriteria(group: Criteria): Criteria {
  return isNegationGroup(group) ? group[1] : group;
}

function setGroupCriteria(group: Criteria, criteria: Criteria): Criteria {
  if (isNegationGroup(group)) {
    group[1] = criteria;
    return group;
  }
  return criteria;
}

function convertGroupToNewStructure(group: Criteria, value: string): void {
  const isNegationValue = function (groupValue: string): boolean {
    return groupValue.includes('!');
  };
  const convertGroupToNegationGroup = function (target: Criteria): void {
    const criteria = target.slice(0);
    target.length = 0;
    target.push('!', criteria);
  };
  const convertNegationGroupToGroup = function (target: Criteria): void {
    const criteria = getGroupCriteria(target);
    target.length = 0;
    ([] as Criteria).push.apply(target, criteria);
  };

  if (isNegationValue(value)) {
    if (!isNegationGroup(group)) {
      convertGroupToNegationGroup(group);
    }
  } else if (isNegationGroup(group)) {
    convertNegationGroupToGroup(group);
  }
}

export function setGroupValue(group: Criteria, value: string): Criteria {
  convertGroupToNewStructure(group, value);

  const criteria = getGroupCriteria(group);
  let i = 0;
  const getNormalizedGroupValue = function (groupValue: string): string {
    return groupValue.includes('!') ? groupValue.substring(1) : groupValue;
  };
  const changeCriteriaValue = function (target: Criteria, newValue: string): void {
    for (i = 0; i < target.length; i += 1) {
      if (!Array.isArray(target[i])) {
        target[i] = newValue;
      }
    }
  };

  changeCriteriaValue(criteria, getNormalizedGroupValue(value));

  return group;
}

function getCriteriaOperation(criteria: Criteria): string {
  if (isCondition(criteria)) {
    return AND_GROUP_OPERATION;
  }

  let value = '';
  for (const item of criteria) {
    if (!Array.isArray(item)) {
      if (value && value !== item) {
        throw dataErrors.Error('E4019');
      }
      if (item !== '!') {
        value = item as string;
      }
    }
  }
  return value;
}

export function getGroupValue(group: Criteria): string {
  const criteria = getGroupCriteria(group);
  let value = getCriteriaOperation(criteria);

  if (!value) {
    value = AND_GROUP_OPERATION;
  }
  if (criteria !== group) {
    value = `!${value}`;
  }
  return value;
}

export function getGroupMenuItem(
  group: Criteria,
  availableGroups: GroupMenuItem[],
): GroupMenuItem {
  const groupValue = getGroupValue(group);

  return availableGroups.filter((item) => item.value === groupValue)[0];
}

function getDefaultFilterOperations(field: OperationsField): string[] {
  return (field.lookup && LOOKUP_OPERATIONS)
    || DATATYPE_OPERATIONS[field.dataType || DEFAULT_DATA_TYPE];
}

function containItems(entity: unknown): number | false {
  return Array.isArray(entity) && entity.length;
}

export function getFilterOperations(field: OperationsField): string[] {
  const result = containItems(field.filterOperations)
    ? field.filterOperations
    : getDefaultFilterOperations(field);
  const operations: string[] = extend([], result);
  return operations;
}

export function getCaptionByOperation(
  operation: string,
  filterOperationDescriptions: Partial<Record<string, string>> | undefined,
): string {
  const operationName = filterOperationsDictionary.getNameByFilterOperation(operation) as string;
  const description = filterOperationDescriptions && filterOperationDescriptions[operationName];
  return description || operationName;
}

export function getOperationFromAvailable(
  operation: string,
  availableOperations: OperationMenuItem[],
): OperationMenuItem {
  for (const availableOperation of availableOperations) {
    if (availableOperation.value === operation) {
      return availableOperation;
    }
  }
  // @ts-expect-error wrong usage of new
  throw new errors.Error('E1048', operation);
}

export function getCustomOperation(
  customOperations: FilterCustomOperation[],
  name: string,
): FilterCustomOperation | null {
  const filteredOperations = customOperations.filter((item) => item.name === name);
  return filteredOperations.length ? filteredOperations[0] : null;
}

export function getAvailableOperations(
  field: FilterBuilderField,
  filterOperationDescriptions: Partial<Record<string, string>> | undefined,
  customOperations: FilterCustomOperation[],
): OperationMenuItem[] {
  const filterOperations = getFilterOperations(field);
  const isLookupField = !!field.lookup;
  customOperations.forEach((customOperation) => {
    if (!field.filterOperations && !filterOperations.includes(customOperation.name)) {
      const dataTypes = customOperation && customOperation.dataTypes;
      const isOperationForbidden = isLookupField ? !!customOperation.notForLookup : false;
      if (
        !isOperationForbidden
        && dataTypes
        && dataTypes.includes(field.dataType || DEFAULT_DATA_TYPE)
      ) {
        filterOperations.push(customOperation.name);
      }
    }
  });

  return filterOperations.map((operation) => {
    const customOperation = getCustomOperation(customOperations, operation);
    if (customOperation) {
      return {
        icon: customOperation.icon || EMPTY_MENU_ICON,
        text: customOperation.caption || captionize(customOperation.name),
        value: customOperation.name,
        isCustom: true,
      };
    }
    return {
      icon: filterOperationsDictionary.getIconByFilterOperation(operation) || EMPTY_MENU_ICON,
      text: getCaptionByOperation(operation, filterOperationDescriptions),
      value: operation,
    };
  });
}

export function getDefaultOperation(field: OperationsField): string {
  return field.defaultFilterOperation || getFilterOperations(field)[0];
}

export function updateConditionByOperation(
  condition: Condition,
  operation: string,
  customOperations: FilterCustomOperation[],
): Condition {
  let customOperation = getCustomOperation(customOperations, operation);
  if (customOperation) {
    if (customOperation.hasValue === false) {
      condition[1] = operation;
      condition.length = 2;
    } else {
      condition[1] = operation;
      condition[2] = '';
    }
    return condition;
  }

  if (operation === 'isblank') {
    condition[1] = EQUAL_OPERATION;
    condition[2] = null;
  } else if (operation === 'isnotblank') {
    condition[1] = NOT_EQUAL_OPERATION;
    condition[2] = null;
  } else {
    customOperation = getCustomOperation(customOperations, condition[1]);
    if (customOperation || (condition.length === 2 || condition[2] === null)) {
      condition[2] = '';
    }
    condition[1] = operation;
  }
  return condition;
}

export function createCondition(
  field: OperationsField & { dataField?: string },
  customOperations: FilterCustomOperation[],
): Condition {
  const condition: Condition = [field.dataField as string, '', ''];
  const filterOperation = getDefaultOperation(field);

  updateConditionByOperation(condition, filterOperation, customOperations);

  return condition;
}

export function removeItem(group: Criteria, item: unknown): Criteria {
  const criteria = getGroupCriteria(group);
  const index = criteria.indexOf(item);

  criteria.splice(index, 1);

  if (criteria.length !== 1) {
    criteria.splice(index, 1);
  }
  return group;
}

function isNegationGroupOperation(operation: string): boolean {
  return operation.includes('not');
}

function getGroupOperationFromNegationOperation(operation: string): string {
  return operation.substring(3).toLowerCase();
}

export function createEmptyGroup(value: string): Criteria {
  const isNegation = isNegationGroupOperation(value);
  const groupOperation = isNegation ? getGroupOperationFromNegationOperation(value) : value;

  return isNegation ? ['!', [groupOperation]] : [groupOperation];
}

export function isEmptyGroup(group: Criteria): boolean {
  const criteria = getGroupCriteria(group);

  if (isCondition(criteria)) {
    return false;
  }

  const hasConditions = criteria.some((item) => isCondition(item));

  return !hasConditions;
}

export function addItem(item: unknown, group: Criteria): Criteria {
  const criteria = getGroupCriteria(group);
  const groupValue = getGroupValue(criteria);

  if (criteria.length === 1) {
    criteria.unshift(item);
  } else {
    criteria.push(item, groupValue);
  }

  return group;
}

function hasParent(dataField: string): boolean {
  return dataField.lastIndexOf('.') !== -1;
}

function generateCaptionByDataField(
  dataField: string,
  allowHierarchicalFields: boolean | undefined,
): string {
  let caption = '';
  let name = dataField;

  if (allowHierarchicalFields) {
    name = dataField.substring(dataField.lastIndexOf('.') + 1);
  } else if (hasParent(dataField)) {
    dataField.split('.').forEach((field, index, arr) => {
      caption += captionize(field);
      if (index !== (arr.length - 1)) {
        caption += '.';
      }
    });

    return caption;
  }

  return captionize(name);
}

function getParentIdFromItemDataField(dataField: string): string {
  return dataField.substring(0, dataField.lastIndexOf('.'));
}

function itemExists(plainItems: FilterBuilderField[], parentId: string): boolean {
  return plainItems.some((item) => item.dataField === parentId);
}

function pushItemAndCheckParent(
  originalItems: FilterBuilderField[],
  plainItems: FilterBuilderField[],
  item: FilterBuilderField,
): void {
  const { dataField } = item;
  if (hasParent(dataField)) {
    item.parentId = getParentIdFromItemDataField(dataField);
    if (!itemExists(plainItems, item.parentId) && !itemExists(originalItems, item.parentId)) {
      pushItemAndCheckParent(originalItems, plainItems, {
        id: item.parentId,
        dataType: 'object',
        dataField: item.parentId,
        caption: generateCaptionByDataField(item.parentId, true),
        filterOperations: ['isblank', 'isnotblank'],
        defaultCalculateFilterExpression: filterUtils.defaultCalculateFilterExpression,
      });
    }
  }
  plainItems.push(item);
}

export function getItems(
  fields: FilterBuilderField[],
  allowHierarchicalFields: boolean | undefined,
): FilterBuilderField[] {
  const items: FilterBuilderField[] = [];

  for (const field of fields) {
    const item: FilterBuilderField = extend(
      true,
      { caption: generateCaptionByDataField(field.dataField, allowHierarchicalFields) },
      field,
    );
    item.id = item.name || item.dataField;

    if (allowHierarchicalFields) {
      pushItemAndCheckParent(fields, items, item);
    } else {
      items.push(item);
    }
  }

  return items;
}

export function getField(dataField: string, fields: FilterBuilderField[]): FilterBuilderField {
  for (const field of fields) {
    if (field.name === dataField) {
      return field;
    }
    if (field.dataField.toLowerCase() === dataField.toLowerCase()) {
      return field;
    }
  }
  const extendedFields = getItems(fields, true)
    .filter((item) => item.dataField.toLowerCase() === dataField.toLowerCase());
  if (extendedFields.length > 0) {
    return extendedFields[0];
  }
  // @ts-expect-error wrong usage of new
  throw new errors.Error('E1047', dataField);
}

export function isGroup(criteria: unknown): criteria is Criteria {
  if (!Array.isArray(criteria)) {
    return false;
  }

  return criteria.length < 2 || (Array.isArray(criteria[0]) || Array.isArray(criteria[1]));
}

function appendGroupOperationToCriteria(criteria: Criteria, groupOperation: string): Criteria {
  const isNegation = isNegationGroupOperation(groupOperation);
  const operation = isNegation
    ? getGroupOperationFromNegationOperation(groupOperation)
    : groupOperation;

  return isNegation ? ['!', criteria, operation] : [criteria, operation];
}

function conditionHasCustomOperation(
  condition: Condition,
  customOperations: FilterCustomOperation[],
): boolean {
  const customOperation = getCustomOperation(customOperations, condition[1]);
  return !!customOperation && customOperation.name === condition[1];
}

function convertToInnerCondition(
  condition: Condition,
  customOperations: FilterCustomOperation[],
): Condition {
  if (conditionHasCustomOperation(condition, customOperations)) {
    return condition;
  }

  if (condition.length < 3) {
    // eslint-disable-next-line prefer-destructuring
    condition[2] = condition[1];
    condition[1] = EQUAL_OPERATION;
  }
  return condition;
}

export function convertToInnerStructure(
  value: unknown,
  customOperations: FilterCustomOperation[],
  defaultGroupOperation?: string,
): Criteria {
  const defaultOperation = defaultGroupOperation || AND_GROUP_OPERATION;
  if (!value) {
    return createEmptyGroup(defaultOperation);
  }

  const clone: Criteria = extend(true, [], value);

  if (isCondition(clone)) {
    return appendGroupOperationToCriteria(
      convertToInnerCondition(clone, customOperations),
      defaultOperation,
    );
  }
  if (isNegationGroup(clone)) {
    const [, innerCriteria] = clone;
    if (isCondition(innerCriteria)) {
      return ['!', appendGroupOperationToCriteria(
        convertToInnerCondition(innerCriteria, customOperations),
        defaultOperation,
      )];
    }
    if (isNegationGroup(innerCriteria)) {
      return ['!', appendGroupOperationToCriteria(
        convertToInnerStructure(innerCriteria, customOperations),
        defaultOperation,
      )];
    }
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return ['!', convertToInnerGroup(innerCriteria, customOperations, defaultOperation)];
  }
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return convertToInnerGroup(clone, customOperations, defaultOperation);
}

function appendGroupOperationToGroup(group: Criteria, groupOperation: string): Criteria {
  const isNegation = isNegationGroupOperation(groupOperation);

  const operation = isNegation
    ? getGroupOperationFromNegationOperation(groupOperation)
    : groupOperation;
  group.push(operation);

  let result: Criteria = group;

  if (isNegation) {
    result = ['!', result];
  }

  return result;
}

function convertToInnerGroup(
  group: Criteria,
  customOperations: FilterCustomOperation[],
  defaultGroupOperation?: string,
): Criteria {
  const defaultOperation = defaultGroupOperation || AND_GROUP_OPERATION;
  const groupOperation = getCriteriaOperation(group).toLowerCase() || defaultOperation;
  let innerGroup: Criteria = [];
  for (const item of group) {
    if (isGroup(item)) {
      innerGroup.push(convertToInnerStructure(item, customOperations, defaultOperation));
      innerGroup = appendGroupOperationToGroup(innerGroup, groupOperation);
    } else if (isCondition(item)) {
      innerGroup.push(convertToInnerCondition(item, customOperations));
      innerGroup = appendGroupOperationToGroup(innerGroup, groupOperation);
    }
  }

  if (innerGroup.length === 0) {
    innerGroup = appendGroupOperationToGroup(innerGroup, groupOperation);
  }

  return innerGroup;
}

export function getNormalizedFields(fields: Field[]): FilterBuilderField[] {
  return fields.reduce<FilterBuilderField[]>((result, field) => {
    if (isDefined(field.dataField)) {
      const normalizedField: Partial<FilterBuilderField> = {};
      // eslint-disable-next-line no-restricted-syntax
      for (const key in field) {
        if (field[key] && AVAILABLE_FIELD_PROPERTIES.includes(key)) {
          normalizedField[key] = field[key];
        }
      }
      normalizedField.defaultCalculateFilterExpression = filterUtils
        .defaultCalculateFilterExpression;
      if (!isDefined(normalizedField.dataType)) {
        normalizedField.dataType = DEFAULT_DATA_TYPE;
      }
      if (!isDefined(normalizedField.trueText)) {
        normalizedField.trueText = messageLocalization.format('dxDataGrid-trueText');
      }
      if (!isDefined(normalizedField.falseText)) {
        normalizedField.falseText = messageLocalization.format('dxDataGrid-falseText');
      }
      result.push(normalizedField as FilterBuilderField);
    }
    return result;
  }, []);
}

function getConditionFilterExpression(
  condition: Condition,
  fields: FilterBuilderField[],
  customOperations: FilterCustomOperation[],
  target: string,
): FilterExpression {
  const field = getField(condition[0], fields);
  const filterExpression = convertToInnerCondition(condition, customOperations);
  const customOperation = customOperations.length
    && getCustomOperation(customOperations, filterExpression[1]);

  if (customOperation && customOperation.calculateFilterExpression) {
    return customOperation.calculateFilterExpression.apply(
      customOperation,
      [filterExpression[2], field, fields],
    );
  } if (field.createFilterExpression) {
    return field.createFilterExpression.apply(
      field,
      [filterExpression[2], filterExpression[1], target],
    );
  } if (field.calculateFilterExpression) {
    return field.calculateFilterExpression.apply(
      field,
      [filterExpression[2], filterExpression[1], target],
    );
  }
  return field.defaultCalculateFilterExpression.apply(
    field,
    [filterExpression[2], filterExpression[1], target],
  );
}

export function getFilterExpression(
  value: Criteria | null | undefined,
  fields: FilterBuilderField[],
  customOperations: FilterCustomOperation[],
  target: string,
): FilterExpression | null {
  if (!isDefined(value)) {
    return null;
  }

  if (isNegationGroup(value)) {
    const filterExpression = getFilterExpression(value[1], fields, customOperations, target);
    return ['!', filterExpression];
  }
  const criteria = getGroupCriteria(value);
  if (isCondition(criteria)) {
    return getConditionFilterExpression(criteria, fields, customOperations, target) || null;
  }
  let result: FilterExpression[] = [];
  let filterExpression: FilterExpression | null = null;
  const groupValue = getGroupValue(criteria);

  for (let i = 0; i < criteria.length; i += 1) {
    const item = criteria[i];
    if (isGroup(item)) {
      filterExpression = getFilterExpression(item, fields, customOperations, target);
      if (filterExpression && i) {
        result.push(groupValue);
      }
      if (filterExpression) {
        result.push(filterExpression);
      }
    } else if (isCondition(item)) {
      filterExpression = getConditionFilterExpression(item, fields, customOperations, target);
      if (filterExpression && result.length) {
        result.push(groupValue);
      }
      if (filterExpression) {
        result.push(filterExpression);
      }
    }
  }

  if (result.length === 1) {
    // @ts-expect-error a single expression replaces the list
    // eslint-disable-next-line prefer-destructuring
    result = result[0];
  }

  return result.length ? result : null;
}

export function isValidCondition(condition: Condition): boolean {
  return condition[2] !== '';
}

export function getNormalizedFilter(group: Criteria): Criteria | null {
  let normalizedGroup = group;
  const criteria = getGroupCriteria(normalizedGroup);
  let i = 0;

  if (criteria.length === 0) {
    return null;
  }

  const itemsForRemove: unknown[] = [];
  for (i = 0; i < criteria.length; i += 1) {
    const item = criteria[i];
    if (isGroup(item)) {
      const normalizedGroupValue = getNormalizedFilter(item);
      if (normalizedGroupValue) {
        criteria[i] = normalizedGroupValue;
      } else {
        itemsForRemove.push(item);
      }
    } else if (isCondition(item)) {
      if (!isValidCondition(item)) {
        itemsForRemove.push(item);
      }
    }
  }
  for (i = 0; i < itemsForRemove.length; i += 1) {
    removeItem(criteria, itemsForRemove[i]);
  }

  if (criteria.length === 1) {
    return null;
  }

  criteria.splice(criteria.length - 1, 1);

  if (criteria.length === 1) {
    normalizedGroup = setGroupCriteria(normalizedGroup, criteria[0] as Criteria);
  }

  if (normalizedGroup.length === 0) {
    return null;
  }

  return normalizedGroup;
}

export function getCurrentLookupValueText(
  field: LookupField,
  value: ConditionValue,
  handler: (text: string) => void,
): void {
  if (value === '') {
    handler('');
    return;
  }
  const { lookup } = field;
  if (lookup.items) {
    // @ts-expect-error calculateCellValue is declared only on the grid lookup
    handler(lookup.calculateCellValue(value) || '');
  } else {
    const lookupDataSource = isFunction(lookup.dataSource)
      // @ts-expect-error the lookup dataSource type has no function form
      ? lookup.dataSource({})
      : lookup.dataSource;
    const dataSource = new DataSource(lookupDataSource);
    dataSource.loadSingle(lookup.valueExpr, value).done((result) => {
      let valueText = '';

      if (result) {
        // @ts-expect-error compileGetter has unknown return type
        valueText = lookup.displayExpr ? compileGetter(lookup.displayExpr)(result) : result;
      }

      if (field.customizeText) {
        valueText = field.customizeText({
          // @ts-expect-error FieldInfo.value does not admit boolean or null
          value,
          valueText,
        });
      }

      handler(valueText);
    }).fail(() => {
      handler('');
    });
  }
}

function getPrimitiveValueText(
  field: Field,
  value: FieldValue,
  customOperation: CustomOperation | null,
  target: string,
  options?: { values: FieldValue[] },
): string {
  let valueText = getFormattedValueText(field, value);

  if (field.customizeText) {
    valueText = field.customizeText.call(field, {
      // @ts-expect-error FieldInfo.value does not admit boolean or null
      value,
      valueText,
      target,
    });
  }

  if (customOperation && customOperation.customizeText) {
    valueText = customOperation.customizeText.call(customOperation, {
      value,
      valueText,
      field,
      target,
      // @ts-expect-error customizeText is declared with one argument
    }, options);
  }

  return valueText;
}

function getArrayValueText(
  field: Field,
  value: FieldValue[],
  customOperation: CustomOperation | null,
  target: string,
): string[] {
  const options = { values: value };
  return value.map((v) => getPrimitiveValueText(field, v, customOperation, target, options));
}

function checkDefaultValue(value: FieldValue | FieldValue[]): value is '' | null {
  return value === '' || value === null;
}

export function getCurrentValueText(
  this: unknown,
  field: Field,
  value: FieldValue | FieldValue[],
  customOperation: CustomOperation | null,
  target = 'filterBuilder',
): string | DeferredObj<string | string[]> {
  if (checkDefaultValue(value)) {
    return '';
  }

  if (Array.isArray(value)) {
    // @ts-expect-error Deferred has badly typed ctor function
    const result: DeferredObj<string | string[]> = new Deferred();
    when.apply(this, getArrayValueText(field, value, customOperation, target)).done((...args) => {
      const text: string | string[] = (args as string[]).some((item) => !checkDefaultValue(item))
        ? (args as string[]).map((item) => (!checkDefaultValue(item) ? item : '?'))
        : '';
      result.resolve(text);
    });
    return result;
  }
  return getPrimitiveValueText(field, value, customOperation, target);
}

export function getCaptionWithParents(
  item: FilterBuilderField,
  plainItems: FilterBuilderField[],
): string | undefined {
  if (hasParent(item.dataField)) {
    const parentId = getParentIdFromItemDataField(item.dataField);
    for (const plainItem of plainItems) {
      if (plainItem.dataField === parentId) {
        return `${getCaptionWithParents(plainItem, plainItems)}.${item.caption}`;
      }
    }
  }
  return item.caption;
}

export function getOperationValue(condition: Condition): string {
  let caption = '';
  if (condition[2] === null) {
    if (condition[1] === EQUAL_OPERATION) {
      caption = 'isblank';
    } else {
      caption = 'isnotblank';
    }
  } else {
    // eslint-disable-next-line prefer-destructuring
    caption = condition[1];
  }
  return caption;
}

export function getMergedOperations(
  customOperations: CustomOperation[],
  betweenCaption: string | undefined,
  context: EditorFactoryOwner,
): FilterCustomOperation[] {
  const result: FilterCustomOperation[] = extend(true, [], customOperations);
  let betweenIndex = -1;
  result.some((customOperation, index) => {
    if (customOperation.name === 'between') {
      betweenIndex = index;
      return true;
    }

    return undefined;
  });
  if (betweenIndex !== -1) {
    result[betweenIndex] = extend(getConfig(betweenCaption, context), result[betweenIndex]);
  } else {
    result.unshift(getConfig(betweenCaption, context));
  }
  return result;
}

function isMatchedCondition(filter: Criteria, addedFilterDataField: unknown): boolean {
  return filter[0] === addedFilterDataField;
}

function syncConditionIntoGroup(
  filter: Criteria,
  addedFilter: Criteria,
  canPush: boolean,
): Criteria | null {
  const result: Criteria = [];
  const isNegation = isNegationGroup(filter);
  let shouldPush = canPush;

  filter.forEach((item) => {
    if (isCondition(item)) {
      if (isMatchedCondition(item, addedFilter[0])) {
        if (shouldPush) {
          result.push(addedFilter);
          shouldPush = false;
        } else {
          result.splice(result.length - 1, 1);
        }
      } else {
        result.push(item);
      }
    } else if (result.length || isGroup(item)) {
      result.push(item);
    }
  });

  if (result.length === 0) {
    return null;
  }

  if (shouldPush) {
    result.push(AND_GROUP_OPERATION);
    result.push(addedFilter);
  }

  if (isNegation) {
    return ['!', result.length === 1 ? result[0] as Criteria : result];
  }

  return result.length === 1 ? result[0] as Criteria : result;
}

export function removeFieldConditionsFromFilter(
  filter: Criteria | null | undefined,
  dataField: string | undefined,
): Criteria | null {
  if (!filter || filter.length === 0) {
    return null;
  }

  if (isCondition(filter)) {
    const hasMatchedCondition = isMatchedCondition(filter, dataField);
    return !hasMatchedCondition ? filter : null;
  }
  return syncConditionIntoGroup(filter, [dataField], false);
}

export function syncFilters(
  filter: Criteria | null,
  addedFilter: Criteria,
): Criteria | null {
  if (filter === null || filter.length === 0) {
    return addedFilter;
  }

  if (isCondition(filter)) {
    if (isMatchedCondition(filter, addedFilter[0])) {
      return addedFilter;
    }
    return [filter, AND_GROUP_OPERATION, addedFilter];
  }

  const groupValue = getGroupValue(filter);
  if (groupValue !== AND_GROUP_OPERATION) {
    return [addedFilter, 'and', filter];
  }

  return syncConditionIntoGroup(filter, addedFilter, true);
}

export function getMatchedConditions(
  filter: Criteria | null,
  dataField: string | undefined,
): Criteria[] {
  if (filter === null || filter.length === 0) return [];

  if (isCondition(filter)) {
    if (isMatchedCondition(filter, dataField)) {
      return [filter];
    }
    return [];
  }

  const groupValue = getGroupValue(filter);
  if (groupValue !== AND_GROUP_OPERATION) {
    return [];
  }

  const result = filter.filter(
    (item): item is Condition => isCondition(item) && isMatchedCondition(item, dataField),
  );

  return result;
}

export function filterHasField(
  filter: Criteria | null,
  dataField: string | undefined,
): boolean {
  if (filter === null || filter.length === 0) return false;

  if (isCondition(filter)) {
    return filter[0] === dataField;
  }

  return filter.some(
    (item) => (isCondition(item) || isGroup(item)) && filterHasField(item, dataField),
  );
}

export const renderValueText = function (
  $container: dxElementWrapper,
  value: string | string[] | undefined,
  customOperation?: FilterCustomOperation | null,
): void {
  if (Array.isArray(value)) {
    const lastItemIndex = value.length - 1;
    $container.empty();
    value.forEach((t, i) => {
      $('<span>')
        .addClass(FILTER_BUILDER_ITEM_TEXT_PART_CLASS)
        .text(t)
        .appendTo($container);
      if (i !== lastItemIndex) {
        $('<span>')
          .addClass(FILTER_BUILDER_ITEM_TEXT_SEPARATOR_CLASS)
          .text(
            customOperation && customOperation.valueSeparator
              ? customOperation.valueSeparator
              : '|',
          )
          .addClass(FILTER_BUILDER_ITEM_TEXT_SEPARATOR_EMPTY_CLASS)
          .appendTo($container);
      }
    });
  } else if (value) {
    $container.text(value);
  } else {
    $container.text(messageLocalization.format('dxFilterBuilder-enterValueText'));
  }
};
